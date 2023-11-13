import { sql } from "../database/database.js";
import * as questionService from "./questionService.js";

const addTopic = async (userId, name) => {
    await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`;
}

const countTopics = async () => {
    const rows = await sql`SELECT COUNT(*) FROM topics`;
    if (rows && rows.length > 0) {
        return rows[0].count
    }
    return 0
}

const deleteTopic = async (id) => {
    await questionService.deleteQuestionsByTopicId(id);
    await sql`DELETE FROM topics WHERE id = ${id}`
}

const findAllTopics = async () => {
    return await sql`SELECT * FROM topics ORDER BY name`;
}

const findTopicById = async (id) => {
    const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;
    if (rows && rows.length > 0) {
        return rows[0]
    }
    return null
}

export { addTopic, countTopics, deleteTopic, findAllTopics, findTopicById };
