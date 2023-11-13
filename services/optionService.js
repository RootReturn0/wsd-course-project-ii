import {sql} from "../database/database.js";
import * as answerService from "./answerService.js";

const addOption = async (questionId, optionText, isCorrect) => {
    await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${optionText}, ${isCorrect})`;
}

const deleteOptionById = async (id) => {
    await answerService.deleteAnswersByOptionId(id);
    await sql`DELETE FROM question_answer_options WHERE id = ${id}`;
}

const deleteOptionsByQuestionId = async (id) => {
    await sql`DELETE FROM question_answer_options WHERE question_id = ${id}`;
}

const findOptionById = async (id) => {
    const options = await sql`SELECT * FROM question_answer_options WHERE id = ${id}`;
    if (options && options.length > 0) {
        return options[0];
    }
    return null
}

const findOptionsByQuestionId = async (id) => {
    return await sql`SELECT * FROM question_answer_options WHERE question_id = ${id}`;
}

const findOptionsByQuestionIdAndIsCorrect = async (id) => {
    return await sql`SELECT * FROM question_answer_options WHERE question_id = ${id} AND is_correct = TRUE`;
}

export { addOption, deleteOptionById, deleteOptionsByQuestionId, findOptionById, findOptionsByQuestionId, findOptionsByQuestionIdAndIsCorrect };