import express from "express";
import { getSourcesJson } from "../controllers/fileController.js";

const fileRoute = express.Router();

fileRoute.get("/sources", getSourcesJson);

export default fileRoute;
