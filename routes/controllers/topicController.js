import { validasaur } from "../../deps.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

const topicValidationRules = {
    name: [validasaur.minLength(1)],
}

const questionValidationRules = {
    questionText: [validasaur.minLength(1)],
}

const optionValidationRules = {
    optionText: [validasaur.minLength(1)],
}

const getTopicData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        name: params.get("name"),
    };
};

const getQuestionData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        questionText: params.get("question_text"),
    };
};

const getOptionData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        optionText: params.get("option_text"),
        isCorrect: params.get("is_correct") === "on",
    };
}

// -------------------------------------Topics-------------------------------------

const showTopics = async ({ render }) => {
    const data = {
        topics: await topicService.findAllTopics()
    };
    render("components/topics/topics.eta", data);
};

const addTopic = async ({ request, response, render, user }) => {
    if (!user.admin) {
        response.redirect("/topics");
        return;
    }

    const topicData = await getTopicData(request);

    const [passes, errors] = await validasaur.validate(
        topicData,
        topicValidationRules
    );

    if (!passes) {
        const topics = await topicService.findAllTopics();
        topicData.validationErrors = errors;
        topicData.topics = topics;
        render("components/topics/topics.eta", topicData);
    } else {
        await topicService.addTopic(user.id, topicData.name);
        response.redirect("/topics");
    }
}

const deleteTopic = async ({ params, response, render, user }) => {
    if (!user.admin) {
        response.redirect("/topics");
        return;
    }

    const topicId = params.id;
    await topicService.deleteTopic(topicId);
    response.redirect("/topics");
}

// -------------------------------------Questions-------------------------------------

const showQuestions = async ({ params, render }) => {
    const topicId = params.id;
    const data = {
        questions: await questionService.findQuestionsByTopicId(topicId),
        topic: await topicService.findTopicById(params.id)
    }
    render("components/topics/questions.eta", data);
}

const addQuestion = async ({ params, request, render, response, user }) => {
    const topicId = params.id;
    const userId = user.id;
    const questionData = await getQuestionData(request);

    const [passes, errors] = await validasaur.validate(
        questionData,
        questionValidationRules
    );

    if (!passes) {
        const topic = await topicService.findTopicById(topicId);
        const questions = await questionService.findQuestionsByTopicId(topicId);
        questionData.validationErrors = errors;
        questionData.topic = topic;
        questionData.questions = questions;
        render("components/topics/questions.eta", questionData);
    } else {
        await questionService.addQuestion(
            userId,
            topicId,
            questionData.questionText
        );
        response.redirect(`/topics/${topicId}`);
    }
}

const deleteQuestion = async ({ params, response }) => {
    const topicId = params.id;
    const questionId = params.qId;

    await questionService.deleteQuestionById(questionId);
    response.redirect(`/topics/${topicId}`);
}

// -------------------------------------Options-------------------------------------

const showOptions = async ({ params, render }) => {
    const questionId = params.qId;
    const data = {
        question: await questionService.findQuestionById(questionId),
        options: await optionService.findOptionsByQuestionId(questionId)
    };
    render("components/topics/options.eta", data);
}

const addOption = async ({ params, request, render, response }) => {
    const topicId = params.id;
    const questionId = params.qId;
    const optionData = await getOptionData(request);

    const [passes, errors] = await validasaur.validate(
        optionData,
        optionValidationRules
    );

    if (!passes) {
        const question = await questionService.findQuestionById(questionId);
        const options = await optionService.findOptionsByQuestionId(questionId);
        optionData.validationErrors = errors;
        optionData.question = question;
        optionData.options = options;
        render("components/topics/options.eta", optionData);
    } else {
        await optionService.addOption(
            questionId,
            optionData.optionText,
            optionData.isCorrect
        );
        response.redirect(`/topics/${topicId}/questions/${questionId}`);
    }
}

const deleteOption = async ({ params, response }) => {
    const topicId = params.id;
    const questionId = params.qId;
    const optionId = params.oId;

    await optionService.deleteOptionById(optionId);
    response.redirect(`/topics/${topicId}/questions/${questionId}`);
}

export { showTopics, addTopic, deleteTopic, showQuestions, addQuestion, deleteQuestion, showOptions, addOption, deleteOption};
