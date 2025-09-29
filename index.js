const fs = require("fs");
// päringu "lahtiharitaja" POST jaoks
const bodyparser = require("body-parser");
const path = require("path");
const textRef = path.join(__dirname, "../txt/vanasonad.txt");
const express = require("express");
const dateEt = require("./src/dateTimeET");
const { brotliDecompress } = require("zlib");
// käivitab express.js funktsiooni, annab nimeks "app"
const app = express();

// määran veebilehtede mallide renderdamise mootori (viewEngine)
app.set("view engine", "ejs");

// määran päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));

// parsime päringu URL-i -> lipp false, kui ainult tekst, true, kui muid andmeid ka
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    // res.send("Express.js läks käima ja serveerib veebi!"); // basic command, kirjutab midagi veebilehele
    res.render("index");
});

app.get("/timenow", (req, res) => {
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.fullTime();
    res.render("timenow", { weekDayNow: weekDayNow, dateNow: dateNow });
});

app.get("/vanasonad", (req, res) => {
    fs.readFile(textRef, "utf8", (err, data) => {
        if (err) {
            // kui error, siis ikka väljastab veebilehe, lihtsalt vanasõnu pole ühtegi
            res.render("genericlist", { heading: "Vanasonade list", listData: ["Ei leidnud ühtegi vanasõna!"] });
        }
        else {
            folkWisdom = data.split(";");
            res.render("genericlist", { heading: "Vanasonade list", listData: folkWisdom });
        }
    });
});

app.get("/regvisit", (req, res) => {
    res.render("regvisit");
});

app.post("/regvisit", (req, res) => {
    console.log(req.body);
    // avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a" <- teeb nii, et kui faili pole, siis loob selle faili meile automaatselt)
    fs.open("public/txt/visitlog.txt", "a", (err, file) => {
        if (err) {
            throw (err);
        }
        else {
            // faili senisele sisule lisamine
            fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + "; ", (err) => {
                if (err) {
                    throw (err);
                }
                else {
                    console.log("Salvestatud!");
                    res.render("regvisit");
                }
            });
        }
    });
});

app.listen(5135, () => {
    console.log("Server running at http://localhost:5135/");
});