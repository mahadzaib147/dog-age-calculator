import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function init() {
  if (!initialized) {
    await registerRoutes({} as any, app);
    initialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await init();
  return app(req, res);
}
