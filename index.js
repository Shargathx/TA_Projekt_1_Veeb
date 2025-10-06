// SQL andmebaasi mooduli kasutamine / aktiveerimine
const mysql = require("mysql2"); // (installed via console "npm install mysql2")
const dbInfo = require("../../../vp2025config"); // 3 kausta väljaspool

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

// loon andmebaasi (DB) ühenduse:
const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
});

app.get("/", (req, res) => {
    // res.send("Express.js läks käima ja serveerib veebi!"); // basic command, kirjutab midagi veebilehele
    res.render("index");
});

app.get("/Eestifilm", (req, res) => {
    res.render("eestifilm");
});

app.get("/Eestifilm/inimesed", (req, res) => {
    const sqlReq = "SELECT * FROM person"; // teeb SQL päringu minu andmebaasile, tavalised SQL commandid
    conn.execute(sqlReq, (err, sqlres) => {
        if (err) {
            throw (err);
        }
        else {
            console.log(sqlres);
            res.render("filmiinimesed", { personList: sqlres }); // lihtsalt kontrolliks, kas midagi läheb katki or nah
        }
    });
});

app.get("/Eestifilm/filmiinimesed_add", (req, res) => {
    console.log(req.body);
    res.render("filmiinimesed_add", { notice: "Ootan sisestust!" });
});


/* GPT SOLUTION FOR MISSING DATE FOR DECEASED INPUT THROWING ERROR
const deceasedValue = req.body.deceasedInput ? req.body.deceasedInput : null;

conn.execute(
    sqlReq,
    [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedValue],
    (err, sqlres) => {
        if (err) {
            console.error("SQL insert error:", err);
            return res.render("filmiinimesed_add", { notice: "Salvestamine ebaõnnestus!" });
        } else {
            return res.render("filmiinimesed_add", { notice: "Salvestamine õnnestus, grats" });
        }
    }
);

*/
app.post("/Eestifilm/filmiinimesed_add", (req, res) => {
    console.log(req.body);
    // res.render("filmiinimesed_add");
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()) {
        res.render("filmiinimesed_add", { notice: "Andmed vigased või puudu" });
    }
    else {
        let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput], (err, sqlres) => {
            if (err) {
                console.error("SQL insert error:", err);
                res.render("filmiinimesed_add", { notice: "Salvestamine ebaõnnestus!" });

            }
            else {
                res.render("filmiinimesed_add", { notice: "Salvestamine õnnestus, grats" });
            }
        });
    }
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




// app.get("/visitors", (req, res) => {
//     fs.readFile(visitorPath, "utf8", (err, data) => {
//         if (err) {
//             console.error(err);
//             return res.render("visitors", { visitors: ["Ei leitud ühtegi külastust!"] });
//         }
//         // splitib iga külastuse uuele reale (eemaldab ka tühjad kohad / tühikud, VARUVARIANT, kasutab PUSH meetodit / commandi)
//         else {
//             listData = data.split(";");
//             let correctListData = [];
//             for (let i = 0; i < listData.length - 1; i++) {
//                 correctListData.push(listData[i]);
//             }
//             res.render("visitors", { visitors });
//         });
// });




app.get("/visitors", (req, res) => {
    fs.readFile(visitorPath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.render("visitors", { visitors: ["Ei leitud ühtegi külastust!"] });
        }
        // splitib iga külastuse uuele reale (eemaldab ka tühjad kohad ja read / tühikud)
        const visitors = data.split("\n").filter(line => line.trim() !== "");
        res.render("visitors", { visitors });
    });
});

app.listen(5135, () => {
    console.log("Server running at http://localhost:5135/");
});