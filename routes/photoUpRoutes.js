const express = require("express");
const multer = require("multer");
const loginCheck = require("../src/checkLogin");
const router = express.Router();
router.use(loginCheck.isLogin);


// seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest:"./public/gallery/orig/"});

const {
    // siia pärast vajaminevad funktsioonid
    photoUploadPage,
    photoUploadPagePost,
} = require("../controllers/photoUploadController");

router.route("/").get(photoUploadPage); // siin aint "/", kuna index võtab by default selle aluseks
router.route("/").post(uploader.single("photoInput"), photoUploadPagePost); // photoInput-ilt tuleb fail, see läheb uploaderist läbi ja alles siis POST-i


module.exports = router;
