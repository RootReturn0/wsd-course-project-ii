import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";

const getRandomQuestion = async ({ response }) => {
    const question = await questionService.findRandomQuestion();
    if (question) {
        const options = await optionService.findOptionsByQuestionId(question.id);
        let answerOptions = [];
        options.forEach(option => {
            answerOptions.push({
                optionId: option.id,
                optionText: option.option_text
            })
        })

        response.body = { questionId: question.id, questionText: question.question_text, answerOptions };
    } else {
        response.body = {};
    }
}

const checkAnswer = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const jsonData = await body.value;
    const optionId = jsonData.optionId;

    const option = await optionService.findOptionById(optionId);

    if(option){
        if (option.is_correct){
            response.body = { correct: true };
        } else {
            response.body = { correct: false };
        }
    } else {
        response.status = 404;
        response.body = { error: "Option not found" };
    }

}

export { getRandomQuestion, checkAnswer };
