import mongoose from "mongoose";
import Form from "../model/Form.js";
import Answer from "../model/Answer.js";

class ResponseController {
  async lists(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }

      // -> mengecek apakah form id valid sebagai object id
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.id,
      }).populate("answers"); // -> .populate('answers') didapatkan dari nama relasi table
      // ->  yang sudah dibuat di model form dan berelasi dengan table answers

      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      // -> ambil semua jawaban berdasarkan form id
      // const answers = await Answer.find({ formId: req.params.formId });
      // if (!answers) {
      //   throw { code: 404, message: "ANSWER NOT FOUND" };
      // }

      return res.status(200).json({
        status: true,
        message: "ANSWER_FOUND",
        form,
        total: form.answers.length,
        answers: form.answers, // mengembalikan isi table yang ada di database
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async summaries(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }

      // -> mengecek apakah form id valid sebagai object id
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.id,
      }).populate("answers");
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      const summaries = form.questions.map((question) => {
        const summary = {
          type: question.type,
          questionId: question.id,
          question: question.question,
          answers: form.answers.map((answer) => answer[question.id]),
        };
        return summary;
      });

      return res.status(200).json({
        status: true,
        message: "ANSWER_FOUND",
        summaries,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new ResponseController();
