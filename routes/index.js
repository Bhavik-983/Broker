import express from "express";
import healthRoute from "./health/index.js";
import languageRouter from "../routes/languageRoute.js";
import pageRouter from "../routes/pageRoute.js";
import websiteRouter from "../routes/websiteRoute.js";
import authRouter from "../routes/authRoute.js";
import keyRouter from "../routes/keyRoute.js";



const router = express.Router();

/* GET home page. */

//like router use like this
router.use("/health", healthRoute);
router.use("/auth", authRouter);
router.use("/website", websiteRouter);
router.use("/page", pageRouter);
router.use("/language", languageRouter);
router.use("/key", keyRouter);



export default router;
