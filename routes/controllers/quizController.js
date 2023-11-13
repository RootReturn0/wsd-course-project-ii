import * as answerService from "../../services/answerService.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

// -------------------------------------Topics-------------------------------------

const showTopics = async ({ render }) => {
    const data = {
        topics: await topicService.findAllTopics()
    };
    render("components/quiz/topics.eta", data);
};

// -------------------------------------Questions-------------------------------------

const selectQuestion = async ({ params, response, render }) => {
    const topicId = params.tId;
    const question = await questionService.findRandomQuestionsByTopicId(topicId);

    if (question) {
        response.redirect(`/quiz/${params.tId}/questions/${question.id}`);
        return
    }

    const data = {
        topic: await topicService.findTopicById(topicId),
    }
    render("components/quiz/noQuestion.eta", data);
}

const showQuestion = async ({ params, render }) => {
    const topicId = params.tId;
    const questionId = params.qId;
    const data = {
        topic: await topicService.findTopicById(topicId),
        question: await questionService.findQuestionById(questionId),
        options: await optionService.findOptionsByQuestionId(questionId)
    }
    render("components/quiz/question.eta", data);
}

// -------------------------------------Results-------------------------------------

const checkOption = async ({ params, response, user }) => {
    const topicId = params.tId;
    const questionId = params.qId;
    const optionId = params.oId;
    const option = await optionService.findOptionById(optionId);

    await answerService.addAnswer(user.id,questionId, optionId);

    if (option.is_correct) {
        response.redirect(`/quiz/${topicId}/questions/${questionId}/correct`);
        return
    }
    response.redirect(`/quiz/${topicId}/questions/${questionId}/incorrect`);
}

const showCorrect = async ({ params, render }) => {
    const questionId = params.qId;
    const data = {
        question: await questionService.findQuestionById(questionId),
    };
    render("components/quiz/correct.eta", data);
}

const showIncorrect = async ({ params, render }) => {
    const questionId = params.qId;
    const data = {
        question: await questionService.findQuestionById(questionId),
        options: await optionService.findOptionsByQuestionIdAndIsCorrect(questionId)
    };
    render("components/quiz/incorrect.eta", data);
}

export { showTopics, selectQuestion, showQuestion, checkOption, showCorrect, showIncorrect };