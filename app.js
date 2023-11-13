import { Application, Session } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { userMiddleware } from "./middlewares/userMiddleware.js";
import { router, apiRouter } from "./routes/routes.js";

const app = new Application();
app.use(Session.initMiddleware());

app.use(errorMiddleware);
app.use(authMiddleware);
app.use(userMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());
app.use(apiRouter.routes());

export { app };
