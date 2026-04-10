import { Router } from "express";
import * as DownloadAppController from "./downloadApp.controller";

const router = Router();

router.post("/", DownloadAppController.createDownloadApp);
router.get("/", DownloadAppController.getAllDownloadApps);
router.get("/active", DownloadAppController.getActiveDownloadApps);
router.patch("/:id", DownloadAppController.updateDownloadApp);
router.delete("/:id", DownloadAppController.deleteDownloadApp);

export const DownloadAppRoutes = router;
