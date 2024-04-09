"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const todo_route_1 = __importDefault(require("./src/routes/todo.route"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
const timeEntry_route_1 = __importDefault(require("./src/routes/timeEntry.route"));
const secrets_1 = require("./src/utils/secrets");
const auth_route_1 = __importDefault(require("./src/routes/auth.route"));
require("./src/config/passport");
// We can use the free tier of PlanetScale
// https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/
dotenv_1.default.config();
const app = (0, express_1.default)();
// ordering matters here!
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({
    extended: true,
}));
app.use((0, express_session_1.default)({
    secret: secrets_1.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours?
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/todo', secrets_1.verifyToken, todo_route_1.default);
app.use('/time-entry', secrets_1.verifyToken, timeEntry_route_1.default);
app.use('/user', secrets_1.verifyToken, user_route_1.default);
app.use('/auth', auth_route_1.default);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
