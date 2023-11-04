import mongoose from "mongoose";
import Form from "../model/Form.js";

const allowedTypes = ["Text", "Dropdown", "Checkbox", "Radio", "Email"];

class QuestionController {
  async index(req, res) {
    try {
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
      });
      // PENGECEKAN JIKA FORM TIDAK DITEMUKAN
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      return res.status(200).json({
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

  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        question: null,
        type: "Text",
        required: false,
        options: [], // MEMBUAT ARRAY BARU
      };

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { questions: newQuestion } },
        { new: true }
      );

      if (!form) {
        throw { code: 400, message: "ADD_QUESTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ADD_QUESTION_SUCCESS",
        question: newQuestion,
      });
    } catch (error) {
      return res.status(500).json({
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

      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      let field = {};
      if (req.body.hasOwnProperty("question")) {
        field["questions.$[indexQuestion].question"] = req.body.question;
      } else if (req.body.hasOwnProperty("required")) {
        field["questions.$[indexQuestion].required"] = req.body.required;
      } else if (req.body.hasOwnProperty("type")) {
        // -> MEMBUAT PENGECEKAN VALIDASI MENGUNGGUNAKAN VARIABEL DILUAR CLASS
        if (!allowedTypes.includes(req.body.type)) {
          throw { code: 400, message: "INVALID QUESTION TYPE" };
        }
        field["questions.$[indexQuestion].type"] = req.body.type;
      }
      // -> MEMBUAT PENGECEKAN VALIDASI DARI TIPE ? TEXT, CHECKBOX, DROPDOWN, RADIO SECARA MANUAL
      // if (
      //   req.body.type === "Text" ||
      //   req.body.type === "Checkbox" ||
      //   req.body.type === "Radio" ||
      //   req.body.type === "Dropdown"
      // ) {
      // } else {
      //   throw { code: 400, message: "INVALID QUESTION TYPE" };
      // }
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id }, // SAMAKAN FORM ID DAN USER ID
        { $set: field }, //
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ), // AGAR TIDAK SEMUA QUESTION DI UPDATE MAKA DIFILTER BERDASARKAN QUESTION ID
            },
          ],
          new: true,
        }
      );

      if (!question) {
        throw { code: 400, message: "QUESTION_UPDATE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "QUESTION_UPDATE_SUCCESS",
        question,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 404, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 404, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      // UPDATE QUESTION DARI FORM
      // KARNA DATA QUESTION MAKANYA MASIH MENGGUNAKAN MODEL FORM
      // DAN MASIH MENGGUNAKAN FINDONEANDUPDATE BUKAN FIND UNTUK MELAKUKAN DELETE
      // KARENA QUESTION ADALAH ARRAY DI DALAM FORM
      // KARENA DIDALAM ARRAY DAN INGIN DI HAPUS MAKA BISA MENGGUNAKAN $PULL
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $pull: {
            questions: {
              id: new mongoose.Types.ObjectId(req.params.questionId),
            },
          },
        },
        { new: true }
      );

      if (!form) {
        throw { code: 400, message: "DELETE_QUESTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "DELETE_QUESTION_SUCCESSFULY",
        form, //MENGEMBALIKAN DATA FORM
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new QuestionController();
