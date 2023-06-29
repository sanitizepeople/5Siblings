import express from "express";
import "babel-polyfill";
import cors from "cors";
import env from "./env.js";
import adminRoute from "./public/routes/adminRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(cors());
let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(intialPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(intialPath, "login-as.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(intialPath, "sign-up.html"));
});

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use("/api", adminRoute);

const PORT = 5000;
app.listen(PORT).on("listening", () => {
  console.log(`Live on ${PORT}`);
});

export default app;
