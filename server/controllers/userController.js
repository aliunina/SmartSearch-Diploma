import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";

import User from "../models/userModel.js";
import Article from "../models/articleModel.js";
import Notification from "../models/notificationModel.js";
import UserVerification from "../models/userVerificationModel.js";
import UserResetPassword from "../models/userResetPasswordModel.js";

const saltRounds = 10;

dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to send emails.");
  }
});

const sendVerificationEmail = ({ _id, email, firstName }, req, res) => {
  let currentUrl = `${req.protocol}://${req.get('host')}/`;
  const uniqueString = uuidv4() + _id;
  const link = `${currentUrl + "api/user/verify/" + _id + "/" + uniqueString}`;

  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          const templatePath = "./templates/verificationTemplate.html";
          let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
          const emailContent = htmlTemplate
            .replace("{{name}}", firstName)
            .replace("{{link}}", link);
          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Подтвердите ваш Email",
            html: emailContent,
          };

          transporter
            .sendMail(mailOptions)
            .then(() => {
              return res.status(200).json({
                message: "Verification email sent.",
              });
            })
            .catch((error) => {
              return res.status(500).json({
                errorMessage:
                  "An error occured while sending verification email.",
              });
            });
        })
        .catch((error) => {
          return res.status(500).json({
            errorMessage: "An error occured while saving verification email.",
          });
        });
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: "An error occured while hashing email data.",
      });
    });
};

export const verifyUser = (req, res) => {
  const { id, uniqueString } = req.params;
  UserVerification.find({ userId: id })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if (expiresAt < Date.now()) {
          UserVerification.deleteOne({ userId: id })
            .then((result) => {
              User.deleteOne({ _id: id })
                .then(() => {
                  let message =
                    "Срок действия ссылки истёк. Пожалуйста, пройдите регистрацию еще раз.";
                  res.redirect(
                    `/api/user/verified?error=true&message=${message}`
                  );
                })
                .catch(() => {
                  let message =
                    "Произошла ошибка при удалении пользовательской записи.";
                  res.redirect(
                    `/api/user/verified?error=true&message=${message}`
                  );
                });
            })
            .catch(() => {
              let message =
                "Произошла ошибка при удалении записи для верификации.";
              res.redirect(`/api/user/verified?error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                User.updateOne({ _id: id }, { verified: true })
                  .then(() => {
                    UserVerification.deleteOne({ userId: id })
                      .then(() => {
                        res.redirect(`/api/user/verified?error=false`);
                      })
                      .catch(() => {
                        let message =
                          "Произошла ошибка при удалении записи об успешной верификации.";
                        res.redirect(
                          `/api/user/verified?error=true&message=${message}`
                        );
                      });
                  })
                  .catch(() => {
                    let message =
                      "Произошла ошибка при подтверждении аккаунта.";
                    res.redirect(
                      `/api/user/verified?error=true&message=${message}`
                    );
                  });
              } else {
                let message =
                  "Переданы некорректные данные для подтверждения. Проверьте свой почтовый ящик.";
                res.redirect(
                  `/api/user/verified?error=true&message=${message}`
                );
              }
            })
            .catch(() => {
              let message = "Произошла ошибка при сравнении уникальной строки.";
              res.redirect(`/api/user/verified?error=true&message=${message}`);
            });
        }
      } else {
        let message =
          "Запись для верификации не существует или верификация уже пройдена. Пожалуйста, выполните вход или зарегистрируйтесь.";
        res.redirect(`/api/user/verified?error=true&message=${message}`);
      }
    })
    .catch(() => {
      let message =
        "Произошла ошибка при проверке на существование записи для верификации.";
      res.redirect(`/api/user/verified?error=true&message=${message}`);
    });
};

export const verified = (req, res) => {  
  const filePath = "./templates/verifiedTemplate.html";
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const html = fileContent.replace(
    "{{clientUrl}}",
    process.env.CLIENT_URL + "/sign-in"
  );
  res.send(html);
};

export const registerUser = async (req, res) => {
  try {
    const newUser = new User({
      lastName: req.body.lastName.trim(),
      firstName: req.body.firstName.trim(),
      patronymic: req.body.patronymic.trim(),
      email: req.body.email.trim(),
      password: req.body.password,
      country: req.body.country.trim(),
      employment: req.body.employment.trim(),
      themes: req.body.themes,
      status: req.body.status.trim(),
    });

    const { email } = newUser;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        errorMessage: "User with this email alredy exists.",
      });
    }

    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();

    //Password hashing
    bcrypt
      .hash(newUser.password, saltRounds)
      .then((hashedPassword) => {
        newUser.password = hashedPassword;
        newUser.themes = newUser.themes
          .map((theme) => {
            return {
              text: theme,
              recentArticles: [],
            };
          })
          .filter((theme) => theme.text.trim().length > 0)
          .slice(0, 5);
        newUser
          .save()
          .then((result) => {
            //Verification
            sendVerificationEmail(result, req, res);
          })
          .catch((error) =>
            res.status(500).json({
              errorMessage: error.message,
            })
          );
      })
      .catch((error) => {
        res.status(500).json({
          errorMessage: "An error occured while hashing password.",
        });
      });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

const sendResetPasswordEmail = ({ _id, email, firstName }, res) => {
  UserResetPassword.deleteMany({ userId: _id })
    .then(() => {
      const resetCode = Math.floor(100000 + Math.random() * 900000) + "";

      bcrypt
        .hash(resetCode, 10)
        .then((hashedResetCode) => {
          const newUserResetPassword = new UserResetPassword({
            userId: _id,
            resetCode: hashedResetCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });

          newUserResetPassword
            .save()
            .then(() => {
              const templatePath = "./templates/resetPasswordTemplate.html";
              let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
              const emailContent = htmlTemplate
                .replace("{{name}}", firstName)
                .replace("{{code}}", resetCode);
              const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Сброс пароля",
                html: emailContent,
              };

              transporter
                .sendMail(mailOptions)
                .then(() => {
                  return res.status(200).json({
                    message: "Reset password email sent.",
                  });
                })
                .catch((error) => {
                  return res.status(500).json({
                    errorMessage:
                      "An error occured while sending reset password email.",
                  });
                });
            })
            .catch((error) => {
              res.status(500).json({
                errorMessage:
                  "An error occured while saving user reset password record.",
              });
            });
        })
        .catch((error) => {
          res.status(500).json({
            errorMessage: "An error occured while hashing reset password code.",
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        errorMessage: "An error occured while deleting reset password records.",
      });
    });
};

export const resetPassword = async (req, res) => {
  const { password, email } = req.body;
  const userData = await User.findOne({ email });
  if (!userData) {
    return res.status(204).json({
      errorMessage: "User not found.",
    });
  } else {
    const userResetPasswordData = await UserResetPassword.findOne({
      userId: userData._id,
    });
    if (!userResetPasswordData) {
      return res.status(204).json({
        errorMessage: "Reset password entry for this user is not found.",
      });
    } else {
      bcrypt.compare(
        req.body.code,
        userResetPasswordData.resetCode,
        (error, result) => {
          if (result) {
            bcrypt.compare(
              req.body.password,
              userData.password,
              (error, result) => {
                if (result) {
                  return res.status(400).json({
                    errorMessage: "Password can't be the same as the old one.",
                  });
                } else {
                  bcrypt
                    .hash(password, saltRounds)
                    .then((hashedPassword) => {
                      const forUpdateData = {
                        password: hashedPassword,
                        updatedAt: Date.now(),
                      };
                      User.findByIdAndUpdate(userData._id, forUpdateData)
                        .then((result) => {
                          res.status(200).json({
                            message: "Password is updated.",
                          });
                        })
                        .catch((error) => {
                          res.status(500).json({
                            errorMessage:
                              "An error occured while reseting password.",
                          });
                        });
                    })
                    .catch((error) => {
                      res.status(500).json({
                        errorMessage:
                          "An error occured while hashing password.",
                      });
                    });
                }
              }
            );
          } else {
            res.status(401).json({
              errorMessage: "Wrong code.",
            });
          }
        }
      );
    }
  }
};

export const checkCode = async (req, res) => {
  const { code, email } = req.body;
  const userData = await User.findOne({ email });
  if (!userData) {
    return res.status(204).json({
      errorMessage: "User not found.",
    });
  } else {
    const userResetPasswordData = await UserResetPassword.findOne({
      userId: userData._id,
    });
    if (!userResetPasswordData) {
      return res.status(204).json({
        errorMessage: "Reset password entry for this user is not found.",
      });
    } else {
      const { expiresAt } = userResetPasswordData;
      const hashedCode = userResetPasswordData.resetCode;

      if (expiresAt < Date.now()) {
        UserResetPassword.deleteOne({ userId: userData._id })
          .then(() => {
            return res.status(410).json({
              errorMessage: "The code has expired.",
            });
          })
          .catch(() => {
            return res.status(500).json({
              errorMessage:
                "An error occured while deleting reset password entry for this user.",
            });
          });
      } else {
        bcrypt.compare(code, hashedCode, (error, result) => {
          if (result) {
            res.status(200).json(userData);
          } else {
            res.status(401).json({
              errorMessage: "Wrong code.",
            });
          }
        });
      }
    }
  }
};

export const recoveryUser = async (req, res) => {
  try {
    const email = req.params.email;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(204).json({
        errorMessage: "User not found.",
      });
    }
    if (!userData.verified) {
      return res.status(403).json({
        errorMessage: "Email is not verified.",
      });
    }

    sendResetPasswordEmail(userData, res);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const authorizeUser = async (req, res) => {
  try {
    const credentials = new User(req.body);
    const { email, password } = credentials;

    User.findOne({ email })
      .then((userData) => {
        const hashedPasswordDB = userData.password;

        //Check if email is verified
        if (!userData.verified) {
          res.status(403).json({
            errorMessage: "Email is not verified.",
          });
        } else {
          bcrypt.compare(password, hashedPasswordDB, (error, result) => {
            if (result) {
              const token = jwt.sign(
                { id: userData._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );

              res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                  process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
              res.status(200).json(userData);
            } else {
              res.status(401).json({
                errorMessage: "Wrong email or password.",
              });
            }
          });
        }
      })
      .catch((error) => {
        return res.status(401).json({
          errorMessage: "Wrong email or password.",
        });
      });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const updateThemes = async (req, res) => {
  try {
    const userId = req.body.userId;
    const uniqueThemes = req.body.themes.reduce((accumulator, current) => {
      const duplicate = accumulator.find((theme) => theme.text.trim() === current.text.trim());
      if (!duplicate) {
        return accumulator.concat([current]);
      } else {
        return accumulator;
      }
    }, []);

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    userData.themes.forEach(async (theme) => {
      if (!uniqueThemes.find((el) => el.text === theme.text)) {
        await Notification.deleteMany({ theme: theme.text });
      }
    });

    const updatedData = await User.findByIdAndUpdate(
      userId,
      { themes: uniqueThemes },
      {
        new: true,
      }
    );
    const notifications = await Notification.find({ userId });
    res.status(200).json({
      user: updatedData,
      notifications: notifications ? notifications : [],
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.body.userId;
    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const forUpdateData = {
      lastName: req.body.lastName.trim(),
      firstName: req.body.firstName.trim(),
      patronymic: req.body.patronymic.trim(),
      country: req.body.country.trim(),
      employment: req.body.employment.trim(),
      themes: req.body.themes,
      status: req.body.status.trim(),
      updatedAt: Date.now(),
    };

    const updatedData = await User.findByIdAndUpdate(id, forUpdateData, {
      new: true,
    });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const id = req.body.userId;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const { oldPassword, newPassword, repeatPassword } = req.body;

    if (oldPassword === newPassword) {
      return res.status(400).json({
        errorMessage: "Password can't be the same as the old one.",
      });
    }

    bcrypt.compare(oldPassword, userData.password, (error, result) => {
      if (result) {
        bcrypt
          .hash(newPassword, saltRounds)
          .then(async (hashedPassword) => {
            let forUpdateData = {
              password: hashedPassword,
              updatedAt: Date.now(),
            };

            const updatedData = await User.findByIdAndUpdate(
              id,
              forUpdateData,
              {
                new: true,
              }
            );

            res.status(200).json(userData);
          })
          .catch((error) => {
            res.status(500).json({
              errorMessage: "An error occured while hashing password.",
            });
          });
      } else {
        res.status(403).json({
          errorMessage: "Wrong password.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }
    await User.findByIdAndDelete(userId);
    await Article.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    await UserResetPassword.deleteMany({ userId });
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({
      message: `User with id '${userId}' has been deleted.`,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const signOutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({
      message: `Successfully logged out.`,
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const isAuthentificated = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId);
    if (userData) {
      res.status(200).json({
        userData,
        message: `User is authentificated.`,
      });
    } else {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};
