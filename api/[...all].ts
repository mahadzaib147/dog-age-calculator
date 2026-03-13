import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isReady = false;

async function setup() {
  if (!isReady) {
    await registerRoutes({} as any, app);
    isReady = true;
  }
}

export default async function handler(req: any, res: any) {
  await setup();
  return app(req, res);
}
