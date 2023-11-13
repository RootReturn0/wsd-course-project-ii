import * as answerService from "../../services/answerService.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

const showMain = async ({ render }) => {
  const data = {
    numAnswers: await answerService.countAnswers(),
    numTopics: await topicService.countTopics(),
    numQuestions: await questionService.countQuestions(),
  }
  render("main.eta", data);
};

export { showMain };
