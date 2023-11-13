import {sql} from "../database/database.js";

const addAnswer = async (userId, questionId, optionId) => {
    await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${optionId})`;
}

const countAnswers = async () => {
    const rows = await sql`SELECT COUNT(*) FROM question_answers`;
    if (rows && rows.length > 0) {
        return rows[0].count
    }
    return 0
}

const deleteAnswersByOptionId = async (id) => {
    await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${id}`
}

const deleteAnswersByQuestionId = async (id) => {
    await sql`DELETE FROM question_answers WHERE question_id = ${id}`
}

export { addAnswer, countAnswers, deleteAnswersByOptionId, deleteAnswersByQuestionId }