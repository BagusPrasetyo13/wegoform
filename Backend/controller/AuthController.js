import User from "../model/User.js";
import emailExists from "../helper/emailExist.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import isEmailValid from "../helper/isEmailValid.js";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

class AuthController {
  async register(req, res) {
    try {
      // -> PENGECEKAN REQUIRED = HARUS DIISI
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      // -> PENGECEKAN PASSWORD MINIMAL 6 CHAR
      if (req.body.password.length < 6) {
        throw { code: 400, message: "PASSWORD_MINIMUM_6_CHARACTERS" };
      }

      if (!isEmailValid(req.body.email)) {
        throw { code: 400, message: "INVALID_EMAIL" };
      }

      // ->PENGECEKAN KETIKA EMAIL SUDAH ADA
      // const emailExists = await User.findOne({ email: req.body.email });
      const isEmailExists = await emailExists(req.body.email);
      if (isEmailExists) {
        throw { code: 409, message: "EMAIL_ALREADY_EXISTS" };
      }

      // -> SETELAH LOLOS PENGECEKAN LAKUKAN HASHING PASSWORD
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });

      if (!user) {
        throw { code: 500, message: "USER_REGISTER_FAILED" };
      }

      // PEMBUATAN TOKEN
      let payload = { id: user._id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "USER_REGISTER_SUCCESSFULY",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 404, message: "USER_IS_NOT_FOUND" };
      }

      const isPassword = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPassword) {
        throw { code: 400, message: "INVALID_PASSWORD" };
      }

      let payload = { id: user._id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "USER_LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "REFRESH_TOKEN_IS_REQUIRED" };
      }

      const verify = await jsonwebtoken.verify(
        req.body.refreshToken,
        env.JWT_REFRESH_TOKEN_SECRET
      );

      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      const errorJwt = [
        "invalid signature",
        "jwt malformed",
        "jwt must be provided",
        "invalid token",
      ];

      if (error.message == "jwt expired") {
        error.message = "REFRESH_TOKEN_EXPIRED";
      } else if (errorJwt.includes(error.message)) {
        error.message = "INVALID_REFRESH_TOKEN";
      }
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
