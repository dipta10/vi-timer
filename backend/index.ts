import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import todoRouter from './src/routes/todo.route';
import userRouter from './src/routes/user.route';
import projectRoute from './src/routes/project.route';

// We can use the free tier of PlanetScale
// https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/
//
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

app.use('/todo', todoRouter);
app.use('/user', userRouter);
app.use('/project', projectRoute);
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
