const express = require("express");
const router = express.Router();

const {
    showVisitForm,
    registerVisit,
    showVisitLog,

} = require("../controllers/visitController");

router.route("/visits").get(showVisitForm);
router.route("/visits").post(registerVisit);
router.route("/visits/log").get(showVisitLog);

module.exports = router;
