const express = require("express");
const loginCheck = require("../src/checkLogin");

const router = express.Router();
router.use(loginCheck.isLogin);



//kontrollerid
const {
    galleryHome,
    galleryPage,
    myGalleryPage,
    mySinglePhoto,
    updatePhoto
} = require("../controllers/galleryControllers");

router.route("/").get(galleryHome);
router.route("/myGallery").get(myGalleryPage);
router.route("/myphotos/:id").get(mySinglePhoto);
router.route("/myphotos/:id/edit").post(updatePhoto);
router.route("/:page").get(galleryPage); // has to be LAST in call order

module.exports = router;