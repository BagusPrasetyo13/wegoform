import mongoose from "mongoose";
import Form from "../model/Form.js";
import Answer from "../model/Answer.js";
import answerDuplicate from "../helper/answerDuplicate.js";
import questionRequiredButEmpty from "../helper/questionRequiredButEmpty.js";
import optionValueNotExist from "../helper/optionValueNotExist.js";
import questionIdNotValid from "../helper/questionIdNotValid.js";
import emailNotValid from "../helper/emailNotValid.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_FORM_ID" };
      }

      const form = await Form.findById(req.params.formId); // QUERY FORM

      const isDuplicate = await answerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "DUPLICATE_ANSWER" };
      }

      const isquestionRequiredButEmpty = await questionRequiredButEmpty(
        form,
        req.body.answers
      );

      if (isquestionRequiredButEmpty) {
        throw { code: 400, message: "QUESTION_REQUIRED_EMPTY" };
      }

      const isoptionValueNotExist = await optionValueNotExist(
        form,
        req.body.answers
      );

      if (isoptionValueNotExist.length > 0) {
        throw {
          code: 400,
          message: "OPTION_VALUE_IS_NOT_EXIST",
          question: isoptionValueNotExist[0].question,
        };
      }

      const idQuestionNotValid = await questionIdNotValid(
        form,
        req.body.answers
      );

      if (idQuestionNotValid.length > 0) {
        throw {
          code: 400,
          message: "QUESTION_IS_NOT_EXIST",
          question: idQuestionNotValid[0].questionId,
        };
      }

      const emailIsNotValid = await emailNotValid(form, req.body.answers);
      if (emailIsNotValid.length > 0) {
        throw {
          code: 400,
          message: "EMAIL_IS_NOT_VALID",
          question: emailIsNotValid[0].question,
        };
      }

      let fields = {}; // PENAMPUNG PERTANYAAN USER
      // JAWABAN YANG AKAN DISIMPAN DALAM BENTUK ARRAY MENGGUNAKAN FOREACH
      req.body.answers.forEach((answer) => {
        fields[answer.questionId] = answer.value;
      });

      const answer = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.id,
        ...fields,
      });

      if (!answer) {
        throw { code: 400, message: "ANSWER_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ANSWER_SUCCESS",
        answer,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
        question: error.question || null,
      });
    }
  }
}

export default new AnswerController();
