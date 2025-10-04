const fs = require("fs");
const WisdomList = require("./src/wisdomList");
// päringu "lahtiharitaja" POST jaoks
const bodyparser = require("body-parser");
const path = require("path");
const textRef = path.join(__dirname, "../txt/vanasonad.txt");
const visitorPath = "public/txt/visitlog.txt";
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


// THE COMMENTED PART IS ONE WAY OF DOING IT, BUT SINCE I HAVE THE WISDOMLIST.JS, I CAN JUST CALL UPON THAT
// app.get("/vanasonad", (req, res) => {
//     fs.readFile(textRef, "utf8", (err, data) => {
//         if (err) {
//             // kui error, siis ikka väljastab veebilehe, lihtsalt vanasõnu pole ühtegi
//             res.render("genericlist", { heading: "Vanasonade list", listData: ["Ei leidnud ühtegi vanasõna!"] });
//         }
//         else {
//             folkWisdom = data.split(";");
//             res.render("genericlist", { heading: "Vanasonade list", listData: folkWisdom });
//         }
//     });
// });

app.get("/vanasonad", (req, res) => {
    const randomWisdom = WisdomList.getSingleWisdomSaying();
    const list = WisdomList.generateAllVanasonad();
    res.render("genericlist", {
        heading: "Vanasõnade list",
        singleWisdom: randomWisdom,
        listData: list.length ? list : ["Ei leidnud ühte vanasõna!"]
    });
});


app.get("/regvisit", (req, res) => {
    res.render("regvisit");
});

app.post("/regvisit", (req, res) => {
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const dateNow = dateEt.fullDate();
    const timeNow = dateEt.fullTime();
    const getVisitDetails = `${firstName} ${lastName}, ${dateNow}, ${timeNow}\n`;
    console.log(req.body);
    // avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a" <- teeb nii, et kui faili pole, siis loob selle faili meile automaatselt)

    fs.open(visitorPath, "a", (err, file) => {
        if (err) {
            throw err;
        } else {
            // faili senisele sisule lisamine
            fs.appendFile(visitorPath, getVisitDetails, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log("Salvestatud!");
                    // näitame kasutajale kinnituse lehte
                    res.render("confirmregister", { firstName, lastName });
                }
            });
        }
    });
});

app.get("/visitors", (req, res) => {
    fs.readFile(visitorPath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.render("visitors", { visitors: ["Ei leitud ühtegi külastust!"] });
        }
        // spitib iga külastuse uuele reale (eemaldab ka tühjad kohad / tühikud)
        const visitors = data.split("\n").filter(line => line.trim() !== "");
        res.render("visitors", { visitors });
    });
});

app.listen(5135,  () => {
    console.log("Server running at http://localhost:5135/");
});
