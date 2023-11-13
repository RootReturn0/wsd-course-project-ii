import { assertStringIncludes } from "https://deno.land/std@0.202.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { app } from "../app.js";

// ----------------------------API TESTS----------------------------------------

Deno.test({
    name: "GET request to /api/questions/random should return 200 with JSON data",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/questions/random")
            .expect(200)
            .expect("Content-Type", new RegExp("application/json"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test("POST request to /api/questions/answer with {optionId:9999} should return 404 and error message", async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
        .send({ optionId: 9999 })
        .expect(404)
        .expect("Content-Type", new RegExp("application/json"))
        .expect({
            error: "Option not found"
        });
});

// -------------------------------ACCESS CONTROL TESTS---------------------------------

Deno.test({
    name: "GET request to / should return 200 and contains correct content",
    async fn() {
        const testClient = await superoak(app);
        const resp = await testClient.get("/")
            .expect(200)
            .expect("Content-Type", "text/html; charset=utf-8");
        ;
        assertStringIncludes(resp.text, "The application provides a list of topics and allows creating multiple-choice questions into those topics that are then answered by self and others.");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "GET request to /topics without login should return 302 and redirect to /auth/login",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/topics")
            .expect(302)
            .expect("Location", "/auth/login");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "GET request to /quiz without login should return 302 and redirect to /auth/login",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/quiz")
            .expect(302)
            .expect("Location", "/auth/login");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// ----------------------------AUTHENTICATION TESTS--------------------------------

Deno.test({
    name: "POST request to /auth/login with correct user info should return 302 and redirect to /topics",
    async fn() {
        const testClient = await superoak(app);
        const resp = await testClient.post("/auth/login")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("email=admin@admin.com&password=123456")
            .expect(302)
            .expect("Location", "/topics");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "POST request to /auth/login with non-existing user info should return 200 and contains error message",
    async fn() {
        const testClient = await superoak(app);
        const resp = await testClient.post("/auth/login")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("email=fakeuser@fakeuser.com&password=123456")
            .expect(200)
            .expect("Content-Type", "text/html; charset=utf-8");
        assertStringIncludes(resp.text, "User not found");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "POST request to /auth/login with wrong password should return 200 and contains error message",
    async fn() {
        const testClient = await superoak(app);
        const resp = await testClient.post("/auth/login")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("email=admin@admin.com&password=000000")
            .expect(200)
            .expect("Content-Type", "text/html; charset=utf-8");
        assertStringIncludes(resp.text, "Invalid password");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// ----------------------------REGISTRATION TESTS--------------------------------

Deno.test({
    name: "POST request to /auth/register with invalid email and password should return 200 and contains error messages",
    async fn() {
        const testClient = await superoak(app);
        const resp = await testClient.post("/auth/register")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("email=user&password=0")
            .expect(200)
            .expect("Content-Type", "text/html; charset=utf-8");
        assertStringIncludes(resp.text, "email is not a valid email address");
        assertStringIncludes(resp.text, "password cannot be lower than 4 characters");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "POST request to /auth/register with existing email should return 200 and contains error message",
    async fn() {
        const testClient = await superoak(app);
        const resp = await testClient.post("/auth/register")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("email=admin@admin.com&password=0000000")
            .expect(200)
            .expect("Content-Type", "text/html; charset=utf-8");
        assertStringIncludes(resp.text, "User already exists");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});