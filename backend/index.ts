import express, { type Express, type Request, type Response } from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import todoRouter from './src/routes/todo.route';
import userRouter from './src/routes/user.route';
import timeEntryRouter from './src/routes/timeEntry.route';
import { COOKIE_KEY, verifyToken } from './src/utils/secrets';
import authRoute from './src/routes/auth.route';

import './src/config/passport';

// We can use the free tier of PlanetScale
// https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/
dotenv.config();

const app: Express = express();
// ordering matters here!
app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(
  expressSession({
    secret: COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours?
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/todo', verifyToken, todoRouter);
app.use('/time-entry', verifyToken, timeEntryRouter);
app.use('/user', verifyToken, userRouter);
app.use('/auth', authRoute);
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
