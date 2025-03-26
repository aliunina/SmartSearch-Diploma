import bcrypt, { hash } from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import User from "../model/userModel.js";
import UserVerification from "../model/userVerificationModel.js";
import UserResetPassword from "../model/userResetPasswordModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      "<p>Потдвердите свой Email-адрес для БНТУ Умный поиск, чтобы завершить регистрацию и войти в свой аккаунт.</p>" +
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
              console.log(error);
              return response.status(500).json({
                errorMessage:
                  "An error occured while sending verification email.",
              });
            });
        })
        .catch((error) => {
          console.log(error);
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
                  console.log(error);
                  let message =
                    "Срок действия ссылки истёк. Пожалуйста, пройдите регистрацию еще раз.";
                  response.redirect(
                    `/api/verified?error=true&message=${message}`
                  );
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "Произошла ошибка при удалении пользовательской записи.";
                  response.redirect(
                    `/api/verified?error=true&message=${message}`
                  );
                });
            })
            .catch((error) => {
              console.log(error);
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
                        response.redirect(
                          `/api/verified?error=false`
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          "Произошла ошибка при удалении записи об успешной верификации.";
                        response.redirect(
                          `/api/verified?error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
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
              console.log(error);
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
      console.log(error);
      let message =
        "Произошла ошибка при проверке на существование записи для верификации.";
      response.redirect(`/api/verified?error=true&message=${message}`);
    });
};

export const verified = (request, response) => {
  response.sendFile(path.resolve("views/verified.html"));
};

export const createUser = async (request, response) => {
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
          errorMessage: error.message,
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

export const getUserByEmail = async (request, response) => {
  try {
    const email = request.params.email;
    const userData = await User.findOne({ email });
    if (!userData) {
      return response.status(404).json({
        errorMessage: "User not found.",
      });
    }
    response.status(200).json(userData);
  } catch (error) {
    response.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const getUserByCredentials = async (request, response) => {
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
