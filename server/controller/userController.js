import User from "../model/userModel.js";

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
    const savedData = await newUser.save();
    response.status(200).json(savedData);
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

export const getUserById = async (request, response) => {
  try {
    const id = request.params.id;
    const userData = await User.findById(id);
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

export const updateUser = async (request, response) => {
  try {
    const id = request.params.id;
    const userExists = await User.findById(id);
    if (!userExists) {
      return response.status(404).json({
        errorMessage: "User not found.",
      });
    }
    const updatedData = await User.findByIdAndUpdate(id, request.body, {
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
