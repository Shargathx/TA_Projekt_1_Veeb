const express = require("express");
const loginCheck = require("../src/checkLogin");

const router = express.Router();
router.use(loginCheck.isLogin);



//kontrollerid
const {
    galleryHome,
    galleryPage
} = require("../controllers/galleryControllers");

router.route("/").get(galleryHome);
router.route("/:page").get(galleryPage);

module.exports = router;