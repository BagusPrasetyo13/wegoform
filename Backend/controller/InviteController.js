import mongoose from "mongoose";
import Form from "../model/Form.js";
import User from "../model/User.js";
import isEmailValid from "../helper/isEmailValid.js";

class InviteController {
  async index(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
      }).select("invites"); // .select -> hanya mengambil field invites dari form
      if (!form) {
        throw { code: 400, message: "INVITES_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "INVITES_FOUND",
        invites: form.invites,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      // pengecekan invite mengugnakan email
      if (!req.body.email) {
        throw { code: 400, message: "REQUIRED_EMAIL" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      // PENGECEKAN AGAR USER TIDAK BISA MENG INVITE EMAIL SENDIRI
      const user = await User.findOne({
        _id: req.jwt.id,
        email: req.body.email,
      });
      if (user) {
        throw { code: 400, message: "CANT_INVITE_YOURSELF" };
      }

      // PENGECEKAN EMAIL SUDAH PERNAH DI INVITE
      // {invites} -> cek kedalam field invites lalu cari email yang ada di dalam field invites
      const emailInvited = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
        invites: { $in: req.body.email },
      });
      // Jika didalam field sudah ada email yang dikirimkan oleh user maka throw error
      if (emailInvited) {
        throw { code: 400, message: "EMAIL_ALREADY_INVITED" };
      }

      // CEK VALIDASI EMAIL
      if (!isEmailValid(req.body.email)) {
        throw { code: 400, message: "INVALID_EMAIL" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { invites: req.body.email } },
        { new: true }
      );
      if (!form) {
        throw { code: 500, message: "ADD_INVITE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "INVITE_SUCCESS",
        email: req.body.email, // mengembalikan data email
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      // pengecekan invite mengugnakan email
      if (!req.body.email) {
        throw { code: 400, message: "REQUIRED_EMAIL" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const emailExist = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
        invites: { $in: req.body.email },
      });
      if (!emailExist) {
        throw { code: 404, message: "EMAIL_NOT_FOUND" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $pull: { invites: req.body.email } },
        { new: true }
      );
      if (!form) {
        throw { code: 500, message: "REMOVE_INVITE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "REMOVE_INVITE_SUCCESS",
        email: req.body.email, // mengembalikan data email
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new InviteController();
