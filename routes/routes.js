import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as quizController from "./controllers/quizController.js";
import * as questionAPIController from "./apis/questionController.js";
import * as loginController from "./controllers/loginController.js";
import * as registerController from "./controllers/registerController.js";
import { oakCors } from "../deps.js";

const apiRouter = new Router({
    prefix: "/api",
});

apiRouter.get("/questions/random", oakCors(), questionAPIController.getRandomQuestion);
apiRouter.post("/questions/answer", oakCors(), questionAPIController.checkAnswer);

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicController.showTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);
router.get("/topics/:id", topicController.showQuestions);
router.post("/topics/:id/questions", topicController.addQuestion);
router.post("/topics/:id/questions/:qId/delete", topicController.deleteQuestion);
router.get("/topics/:id/questions/:qId", topicController.showOptions);
router.post("/topics/:id/questions/:qId/options", topicController.addOption);
router.post("/topics/:id/questions/:qId/options/:oId/delete", topicController.deleteOption);

router.get("/quiz", quizController.showTopics);
router.get("/quiz/:tId", quizController.selectQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.showQuestion);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.checkOption);
router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrect);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.showIncorrect);

router.get("/auth/register", registerController.showRegistrationForm);
router.post("/auth/register", registerController.registerUser);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

export { apiRouter, router };
