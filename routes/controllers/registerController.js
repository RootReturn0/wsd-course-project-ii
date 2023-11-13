import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const userValidationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)],
}

const getUserData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        email: params.get("email"),
        password: params.get("password"),
    };
};

const registerUser = async ({ request, response, render }) => {
    const userData = await getUserData(request);

    const [passes, errors] = await validasaur.validate(
        userData,
        userValidationRules,
    );

    if (!passes) {
        userData.validationErrors = errors;
        render("components/auth/register.eta", userData);
    } else {
        if (await userService.findUserByEmail(userData.email)) {
            render("components/auth/register.eta", {
                validationErrors: [{ email: "User already exists" }],
            });
            return;
        }
        await userService.addUser(
            userData.email,
            await bcrypt.hash(userData.password),
        );

        response.redirect("/auth/login");
    }
};

const showRegistrationForm = ({ render }) => {
    render("components/auth/register.eta");
};

export { registerUser, showRegistrationForm };