const express = require("express");
const router = express.Router();

// Controllerid:
const {
    viljaveduInAdd,
    viljaveduInAddPost,
    viljaveduOutAdd,
    viljaveduOutAddPost
} = require("../controllers/viljaveduControllers");


router.route("/").get(viljaveduInAdd);
router.route("/").post(viljaveduInAddPost);
router.route("/exit").get(viljaveduOutAdd);
router.route("/exit").post(viljaveduOutAddPost);


module.exports = router;