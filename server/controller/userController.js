import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";

import User from "../model/userModel.js";
import UserVerification from "../model/userVerificationModel.js";
import UserResetPassword from "../model/userResetPasswordModel.js";
import { request } from "http";

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
    console.log("Sender is ready: " + success);
  }
});

const sendVerificationEmail = ({ _id, email }, response) => {
  const currentUrl = process.env.APP_URL;
  const uniqueString = uuidv4() + _id;
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Подтвердите ваш Email",
    html:
      "<p>Подтвердите свой Email-адрес для БНТУ Умный поиск, чтобы завершить регистрацию и войти в свой аккаунт.</p>" +
      "<p>Срок действия ссылки - 6 часов.</p>" +
      `<p><a href="${
        currentUrl + "api/verify/user/" + _id + "/" + uniqueString
      }">Перейдите по ссылке, чтобы подтвердить</a></p>`,
  };

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
        .then((result) => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              return response.status(200).json({
                message: "Verification email sent.",
              });
            })
            .catch((error) => {
              return response.status(500).json({
                errorMessage:
                  "An error occured while sending verification email.",
              });
            });
        })
        .catch((error) => {
          return response.status(500).json({
            errorMessage: "An error occured while saving verification email.",
          });
        });
    })
    .catch(() => {
      response.status(500).json({
        errorMessage: "An error occured while hashing email data.",
      });
    });
};

export const verifyUser = (request, response) => {
  const { id, uniqueString } = request.params;
  UserVerification.find({ userId: id })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if (expiresAt < Date.now()) {
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then((result) => {
                  let message =
                    "Срок действия ссылки истёк. Пожалуйста, пройдите регистрацию еще раз.";
                  response.redirect(
                    `/api/verified?error=true&message=${message}`
                  );
                })
                .catch((error) => {
                  let message =
                    "Произошла ошибка при удалении пользовательской записи.";
                  response.redirect(
                    `/api/verified?error=true&message=${message}`
                  );
                });
            })
            .catch((error) => {
              let message =
                "Произошла ошибка при удалении записи для верификации.";
              response.redirect(`/api/verified?error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                User.updateOne({ _id: id }, { verified: true })
                  .then((result) => {
                    UserVerification.deleteOne({ userId: id })
                      .then((result) => {
                        response.redirect(`/api/verified?error=false`);
                      })
                      .catch((error) => {
                        let message =
                          "Произошла ошибка при удалении записи об успешной верификации.";
                        response.redirect(
                          `/api/verified?error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    let message =
                      "Произошла ошибка при подтверждении аккаунта.";
                    response.redirect(
                      `/api/verified?error=true&message=${message}`
                    );
                  });
              } else {
                let message =
                  "Переданы некорректные данные для подтверждения. Проверьте свой почтовый ящик.";
                response.redirect(
                  `/api/verified?error=true&message=${message}`
                );
              }
            })
            .catch((error) => {
              let message = "Произошла ошибка при сравнении уникальной строки.";
              response.redirect(`/api/verified?error=true&message=${message}`);
            });
        }
      } else {
        let message =
          "Запись для верификации не существует или верификация уже пройдена. Пожалуйста, выполните вход или зарегистрируйтесь.";
        response.redirect(`/api/verified?error=true&message=${message}`);
      }
    })
    .catch((error) => {
      let message =
        "Произошла ошибка при проверке на существование записи для верификации.";
      response.redirect(`/api/verified?error=true&message=${message}`);
    });
};

export const verified = (request, response) => {
  response.sendFile(path.resolve("views/verified.html"));
};

export const registerUser = async (request, response) => {
  try {
    const newUser = new User(request.body);

    const { email } = newUser;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response.status(400).json({
        errorMessage: "User with this email alredy exists.",
      });
    }

    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();

    //Password hashing
    bcrypt
      .hash(newUser.password, saltRounds)
      .then((hashedPassword) => {
        newUser.unhashedPassword = newUser.password;
        newUser.password = hashedPassword;
        newUser
          .save()
          .then((result) => {
            //Verification
            sendVerificationEmail(result, response);
          })
          .catch((error) =>
            response.status(500).json({
              errorMessage: error.message,
            })
          );
      })
      .catch((error) => {
        response.status(500).json({
          errorMessage: "An error occured while hashing password.",
        });
      });
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const getAllUsers = async (request, response) => {
  try {
    const userData = await User.find();
    if (!userData || userData.length === 0) {
      return response.status(404).json({
        errorMessage: "Users not found.",
      });
    }
    response.status(200).json(userData);
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

const sendResetPasswordEmail = ({ _id, email }, response) => {
  UserResetPassword.deleteMany({ userId: _id })
    .then(() => {
      const resetCode = Math.floor(100000 + Math.random() * 900000) + "";
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Сброс пароля",
        html: `<p>Код для сброса пароля на сайте БНТУ Умный поиск: ${resetCode}</p>`,
      };

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
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  return response.status(200).json({
                    message: "Reset password email sent.",
                  });
                })
                .catch((error) => {
                  return response.status(500).json({
                    errorMessage:
                      "An error occured while sending reset password email.",
                  });
                });
            })
            .catch((error) => {
              response.status(500).json({
                errorMessage:
                  "An error occured while saving user reset password record.",
              });
            });
        })
        .catch((error) => {
          response.status(500).json({
            errorMessage: "An error occured while hashing reset password code.",
          });
        });
    })
    .catch((error) => {
      response.status(500).json({
        errorMessage: "An error occured while deleting reset password records.",
      });
    });
};

export const resetPassword = async (request, response) => {
  const { password, email } = new User(request.body);
  const userData = await User.findOne({ email });
  if (!userData) {
    return response.status(204).json({
      errorMessage: "User not found.",
    });
  } else {
    const userResetPasswordData = await UserResetPassword.findOne({
      userId: userData._id,
    });
    if (!userResetPasswordData) {
      return response.status(204).json({
        errorMessage: "Reset password entry for this user is not found.",
      });
    } else {
      bcrypt.compare(
        request.body.code,
        userResetPasswordData.resetCode,
        (error, result) => {
          if (result) {
            bcrypt.compare(
              request.body.password,
              userData.password,
              (error, result) => {
                if (result) {
                  return response.status(400).json({
                    errorMessage: "Password can't be the same as the old one.",
                  });
                } else {
                  bcrypt
                    .hash(password, saltRounds)
                    .then((hashedPassword) => {
                      const forUpdateData = {
                        unhashedPassword: password,
                        password: hashedPassword,
                      };
                      User.findByIdAndUpdate(userData._id, forUpdateData)
                        .then((result) => {
                          response.status(200).json({
                            message: "Password is updated.",
                          });
                        })
                        .catch((error) => {
                          response.status(500).json({
                            errorMessage:
                              "An error occured while reseting password.",
                          });
                        });
                    })
                    .catch((error) => {
                      response.status(500).json({
                        errorMessage:
                          "An error occured while hashing password.",
                      });
                    });
                }
              }
            );
          } else {
            response.status(401).json({
              errorMessage: "Wrong code.",
            });
          }
        }
      );
    }
  }
};

export const checkCode = async (request, response) => {
  const code = request.params.code;
  const email = request.params.email;
  const userData = await User.findOne({ email });
  if (!userData) {
    return response.status(204).json({
      errorMessage: "User not found.",
    });
  } else {
    const userResetPasswordData = await UserResetPassword.findOne({
      userId: userData._id,
    });
    if (!userResetPasswordData) {
      return response.status(204).json({
        errorMessage: "Reset password entry for this user is not found.",
      });
    } else {
      const { expiresAt } = userResetPasswordData;
      const hashedCode = userResetPasswordData.resetCode;

      if (expiresAt < Date.now()) {
        UserResetPassword.deleteOne({ userId: userData._id })
          .then(() => {
            return response.status(410).json({
              errorMessage: "The code has expired.",
            });
          })
          .catch(() => {
            return response.status(500).json({
              errorMessage:
                "An error occured while deleting reset password entry for this user.",
            });
          });
      } else {
        bcrypt.compare(code, hashedCode, (error, result) => {
          if (result) {
            response.status(200).json(userData);
          } else {
            response.status(401).json({
              errorMessage: "Wrong code.",
            });
          }
        });
      }
    }
  }
};

export const recoveryUser = async (request, response) => {
  try {
    const email = request.params.email;
    const userData = await User.findOne({ email });

    if (!userData) {
      return response.status(204).json({
        errorMessage: "User not found.",
      });
    }
    if (!userData.verified) {
      return response.status(403).json({
        errorMessage: "Email is not verified.",
      });
    }

    sendResetPasswordEmail(userData, response);
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const authorizeUser = async (request, response) => {
  try {
    const credentials = new User(request.body);
    const { email, password } = credentials;

    User.findOne({ email })
      .then((userData) => {
        const hashedPasswordDB = userData.password;

        //Check if email is verified
        if (!userData.verified) {
          response.status(403).json({
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

              response.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
              });
              response.status(200).json(userData);
            } else {
              response.status(401).json({
                errorMessage: "Wrong password.",
              });
            }
          });
        }
      })
      .catch((error) => {
        return response.status(404).json({
          errorMessage: "User with this email is not found.",
        });
      });
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const updateUser = async (request, response) => {
  try {
    const id = request.params.id;
    const userExists = await User.findById(id);
    if (!userExists) {
      return response.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const forUpdateData = { ...request.body, updatedAt: Date.now() };
    const updatedData = await User.findByIdAndUpdate(id, forUpdateData, {
      new: true,
    });
    response.status(200).json(updatedData);
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const deleteUser = async (request, response) => {
  try {
    const id = request.params.id;
    const userExists = await User.findById(id);
    if (!userExists) {
      return response.status(404).json({
        errorMessage: "User not found.",
      });
    }
    await User.findByIdAndDelete(id);
    response.status(200).json({
      message: `User with id '${id}' has been deleted.`,
    });
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const logOut = async (request, response) => {
  try {
    response.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });
    response.status(200).json({
      message: `Successfully logged out.`,
    });
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};
