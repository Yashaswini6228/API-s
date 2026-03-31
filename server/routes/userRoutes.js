import express from "express";
import multer from "multer";
import {
  getAllUsers,
  getUsersWithFilters,
  getUserById,
  update,
  deleteUser,
  login,
  create,
  refreshToken
} from "../controller/userController.js";

import verifyAccessToken, { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: './uploads/' });

router.post("/register", upload.single('resume'), create);
router.post("/login", login);

router.get("/getallusers", verifyAccessToken, getAllUsers);
router.get("/getuserswithfilters", verifyAccessToken, getUsersWithFilters);
router.get("/getuserbyid/:id", verifyAccessToken, getUserById);

router.post("/refresh-token", refreshToken);


router.put("/updateuser/:id", verifyAccessToken, upload.single('resume'), update);
router.delete("/deleteuser/:id", verifyAccessToken, verifyAdmin, deleteUser);

export default router;