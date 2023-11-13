import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const getUserData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        email: params.get("email"),
        password: params.get("password"),
    };
};

const processLogin = async ({ request, render, response, state }) => {
    const userData = await getUserData(request);

    const userFromDatabase = await userService.findUserByEmail(
        userData.email
    );
    if (!userFromDatabase) {
        render("components/auth/login.eta", { error: "User not found" });
        return;
    }

    const passwordMatches = await bcrypt.compare(
        userData.password,
        userFromDatabase.password,
    );

    if (!passwordMatches) {
        render("components/auth/login.eta", { error: "Invalid password" });
        return;
    }

    await state.session.set("user", userFromDatabase);
    response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
    render("components/auth/login.eta");
};

export { processLogin, showLoginForm };