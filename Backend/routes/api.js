import express from "express";
import AuthController from "../controller/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import FormController from "../controller/FormController.js";
import QuestionController from "../controller/QuestionController.js";
import OptionController from "../controller/OptionController.js";
import AnswerController from "../controller/AnswerController.js";
import InviteController from "../controller/InviteController.js";
import ResponseController from "../controller/ResponseController.js";

const router = express.Router();

// Auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

// Form
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);
router.get("/forms/:id/users", jwtAuth(), FormController.showToUser); //

// Question
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
router.put(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.update
);
router.delete(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.destroy
);
router.get("/forms/:id/questions", jwtAuth(), QuestionController.index);

// Options
router.post(
  "/forms/:id/questions/:questionId/options",
  jwtAuth(),
  OptionController.store
);
router.put(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.update
);
router.delete(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.destroy
);

// INVITES
router.get("/forms/:id/invites", jwtAuth(), InviteController.index);
router.post("/forms/:id/invites", jwtAuth(), InviteController.store);
router.delete("/forms/:id/invites", jwtAuth(), InviteController.destroy);

// ANSWER
router.post("/answers/:formId", jwtAuth(), AnswerController.store);

// RESPONSE
router.get("/responses/:formId/lists", jwtAuth(), ResponseController.lists);
router.get(
  "/responses/:formId/summaries",
  jwtAuth(),
  ResponseController.summaries
);

export default router;
