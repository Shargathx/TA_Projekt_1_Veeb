const express = require("express");
const multer = require("multer");
const router = express.Router();

const uploader = multer({dest:"./public/gallery/orig/"});
//kontrollerid
const {
    newsListPage,
    loadNewsUploadPage,
    newsPhotoUploadPagePost
} = require("../controllers/newsControllers");

router.route("/").get(newsListPage); // news list
router.route("/upload").get(loadNewsUploadPage); // tühi form
router.route("/upload").post(uploader.single("photoInput"), newsPhotoUploadPagePost); // saadab täidetud formi teele 

module.exports = router;