import mongoose from "mongoose";
import Form from "../model/Form.js";
import User from "../model/User.js";

class FormController {
  async index(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const page = parseInt(req.query.page) || 1;

      const form = await Form.paginate(
        { userId: req.jwt.id },
        { limit: limit, page: page }
      );

      if (!form) {
        throw { code: 404, message: "FORMS_NOT_FOUND" };
      }

      res.status(200).json({
        status: true,
        message: "FORMS_FOUND",
        total: form.length,
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.id, // -> DIDAPATKAN DARI FUNCTION JWTAUTH
        title: "Untitled Form",
        description: null,
        public: true,
      });
      if (!form) {
        throw { code: 500, message: "FAILED_CREATE_FORM" };
      } // -> JIKA GAGAL MEMBUAT FORM

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_FORM",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async show(req, res) {
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
      });

      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        req.body,
        { new: true }
      );
      if (!form) {
        throw { code: 404, message: "FORM_UPDATE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "FORM_UPDATE_SUCCESS",
        form,
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

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOneAndDelete({
        _id: req.params.id,
        userId: req.jwt.id,
      });
      if (!form) {
        throw { code: 404, message: "FORM_DELETE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "FORM_DELETE_SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async showToUser(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOne({
        _id: req.params.id,
      });

      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      // VALIDASI GUEST AGAR TIDAK DAPAT MENGAKSES FORM
      // HANYA PEMILIK FORM SERTA HANYA ORANG YANG DI INVITES
      // JIKA ORANG YANG SEDANG LOGIN BUKAN PEMILIK FORM DAN FORM PUBLIC DI SET FALSE
      // MAKA DILAKUKAN PENGECEKAN MENGGUNAKAN EMAIL
      if (req.jwt.id != form.userId && form.public === false) {
        // MENGAMBIL EMAIL DARI ORANG YANG SEDANG LOGIN
        const user = await User.findOne({ _id: req.jwt.id }); // PENGECEKAN SESUAI orang yang sedang login BERDASARKAN JWT ID

        // PENGECEKAN JIKA BUKAN EMAIL YANG DIINVITES
        // APAKAH EMAILNYA ADA DI DALAM ARRAY INVITES
        //JIKA TIDAK :
        if (!form.invites.includes(user.email)) {
          throw { code: 401, message: "YOURE_NOT_INVITED" };
        }
      }

      form.invites = [];

      res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new FormController();
