const fs = require("fs");
const path = require("path");
const visitorPath = path.join(__dirname, "../public/txt/visitlog.txt");
const dateEt = require("../src/dateTimeET");

const showVisitForm = (req, res) => {
    res.render("visits");
};

const registerVisit = (req, res) => {
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const dateNow = dateEt.fullDate();
    const timeNow = dateEt.fullTime();

    const visitLine = `${firstName} ${lastName}, ${dateNow}, ${timeNow}\n`;
    console.log("Visit data:", visitLine);

    fs.open(visitorPath, "a", (err, file) => {
        if (err) throw err;

        fs.appendFile(visitorPath, visitLine, (err) => {
            if (err) throw err;
            console.log("Visit saved!");
            res.redirect("/visits/log");
        });
    });
};

const showVisitLog = (req, res) => {
    fs.readFile(visitorPath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.render("visitlog", { visits: [] });
        }

        const visits = data.split("\n").filter(line => line.trim() !== "");
        res.render("visitlog", { visits });
    });
};

module.exports = {
    showVisitForm,
    registerVisit,
    showVisitLog
};