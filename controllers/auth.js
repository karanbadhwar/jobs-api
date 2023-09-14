const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const register = async (req, res) => {
  const user = await UserModel.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await UserModel.findOne({ email });

  //If User does not exist
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  //Compare Password
  const isPassCorrect = await user.comparePassword(password);

  if (!isPassCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }

  //Create JWT
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
    },
    token,
  });
};
module.exports = {
  login,
  register,
};
