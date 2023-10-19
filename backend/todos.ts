import app from "./index";
import { Response } from "express";

app.get("/hello", (_, res: Response) => {
  res.send("hola");
});