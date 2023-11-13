import { sql } from "../database/database.js";
import * as answerService from "./answerService.js";
import * as optionService from "./optionService.js";

const addQuestion = async (userId, topicId, questionText) => {
    await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${questionText})`;
}

const countQuestions = async () => {
    const rows = await sql`SELECT COUNT(*) FROM questions`;
    if (rows && rows.length > 0) {
        return rows[0].count
    }
    return 0
}

const deleteQuestionById = async (id) => {
    await answerService.deleteAnswersByQuestionId(id);
    await optionService.deleteOptionsByQuestionId(id);
    await sql`DELETE FROM questions WHERE id = ${id}`
}

const deleteQuestionsByTopicId = async (id) => {
    const questions = await findQuestionsByTopicId(id)
    questions.forEach(async question => {
        await deleteQuestionById(question.id)
    })
}

const findQuestionById = async (id) => {
    const questions = await sql`SELECT * FROM questions WHERE id = ${id}`;
    if (questions && questions.length > 0) {
        return questions[0]
    }
    return null
}

const findQuestionsByTopicId = async (id) => {
    return await sql`SELECT * FROM questions WHERE topic_id = ${id}`;
}

const findRandomQuestion = async () => {
    const questions = await sql`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`;
    if (questions && questions.length > 0) {
        return questions[0]
    }
    return null
}

const findRandomQuestionsByTopicId = async (id) => {
    const questions = await sql`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY RANDOM() LIMIT 1`;
    if (questions && questions.length > 0) {
        return questions[0]
    }
    return null
}


export { addQuestion, countQuestions, deleteQuestionById, deleteQuestionsByTopicId, findQuestionById, findQuestionsByTopicId, findRandomQuestion, findRandomQuestionsByTopicId };
