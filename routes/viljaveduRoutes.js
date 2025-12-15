const express = require("express");
const router = express.Router();

// Controllerid:
const {
    viljaveduInAdd,
    viljaveduInAddPost,
    viljaveduOutAdd,
    viljaveduOutAddPost,
    getAllTrucks
} = require("../controllers/viljaveduControllers");


router.route("/").get(viljaveduInAdd);
router.route("/").post(viljaveduInAddPost);
router.route("/total").get(getAllTrucks);
router.route("/exit").get(viljaveduOutAdd);
router.route("/exit").post(viljaveduOutAddPost);


module.exports = router;