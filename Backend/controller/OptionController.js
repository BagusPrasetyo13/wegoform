import mongoose from "mongoose";
import Form from "../model/Form.js";

class OptionController {
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 404, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 404, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!req.body.option) {
        throw { code: 404, message: "REQUIRED_OPTION" };
      }

      // MENYIMPAN OPTION DALAM BENTUK OBJECT, OBJECT YANG DIMASUKKAN KEDALAM ARRAY
      const option = {
        id: new mongoose.Types.ObjectId(),
        value: req.body.option,
      };

      // INSERT DATA OPTION KEDALAM QUESTION PADA FORM
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { "questions.$[indexQuestion].options": option } },
        {
          arrayFilters: [
            {
              //"indexQuestion.id" -> TIDAK MENGGUNAKAN UNDERSCORE KARENA ID TERDAPAT DIDALAM QUESTION
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );
      if (!form) {
        throw { code: 404, message: "ADD_OPTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ADD_OPTION_SUCCESS",
        option,
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
        throw { code: 404, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 404, message: "REQUIRED_QUESTION_ID" };
      }
      if (!req.params.optionId) {
        throw { code: 404, message: "REQUIRED_OPTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!req.body.option) {
        throw { code: 404, message: "REQUIRED_OPTION" };
      }

      // UPDATE DATA OPTION KEDALAM QUESTION PADA FORM
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $set: {
            "questions.$[indexQuestion].option.$[indexOption].value":
              req.body.option,
          },
        },
        {
          arrayFilters: [
            //"indexQuestion.id" -> TIDAK MENGGUNAKAN UNDERSCORE KARENA ID TERDAPAT DIDALAM URL QUESTION
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
            {
              "indexOption.id": new mongoose.Types.ObjectId(
                req.params.optionId
              ),
            },
          ],
          new: true,
        }
      );
      if (!form) {
        throw { code: 404, message: "UPDATE_OPTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "UPDATE_OPTION_SUCCESS",
        option: {
          id: req.params.optionId,
          value: req.body.option,
        },
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
      if (!req.params.optionId) {
        throw { code: 404, message: "REQUIRED_OPTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 404, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 404, message: "INVALID_ID" };
      }

      // UPDATE DATA OPTION KEDALAM QUESTION PADA FORM
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $pull: {
            "questions.$[indexQuestion].option": {
              id: new mongoose.Types.ObjectId(req.params.optionId),
            },
          },
        },
        {
          arrayFilters: [
            //"indexQuestion.id" -> TIDAK MENGGUNAKAN UNDERSCORE KARENA ID TERDAPAT DIDALAM URL QUESTION
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
            // {
            //   "indexOption.id": new mongoose.Types.ObjectId(
            //     req.params.optionId
            //   ),
            // },
          ],
          new: true,
        }
      );
      if (!form) {
        throw { code: 404, message: "DELETE_OPTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "DELETE_OPTION_SUCCESS",
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

export default new OptionController();
