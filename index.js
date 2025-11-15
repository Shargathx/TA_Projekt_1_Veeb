// SQL andmebaasi mooduli kasutamine / aktiveerimine
// const mysql = require("mysql2"); // (installed via console "npm install mysql2") // välja commented, kuna kasutame async-i edaspidi, siis impordime 'mysql2/promise' mooduli (allpool)
const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config"); // 3 kausta väljaspool

const fs = require("fs");
const WisdomList = require("./src/wisdomList");

// päringu "lahtiharutaja" POST jaoks
const bodyparser = require("body-parser");
const path = require("path");
const textRef = path.join(__dirname, "../txt/vanasonad.txt");
// const visitorPath = "public/txt/visitlog.txt";
const express = require("express");
const dateEt = require("./src/dateTimeET");
const { brotliDecompress } = require("zlib");

// käivitab express.js funktsiooni, annab nimeks "app"
const app = express();

// määran veebilehtede mallide renderdamise mootori (viewEngine)
app.set("view engine", "ejs");

// määran päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));

// parsime päringu URL-i -> lipp false, kui ainult tekst; true, kui muid andmeid ka
app.use(bodyparser.urlencoded({ extended: true }));

// loon andmebaasi (DB) ühenduse: see viis on manuaalsem, alumine osa hakkab kasutama asnyc-meetodit
/*
const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
});
*/

const dbConfig = { // siin pole seda (ega ülemist vana versiooni) tglt enam vaja, kuna see kolis ümber Controllerisse, aga jätan näitamise eesmärgil veel siia
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

// app.get("/", (req, res) => {
//     // res.send("Express.js läks käima ja serveerib veebi!"); // basic command, kirjutab midagi veebilehele
//     res.render("index");
// });



app.get("/timenow", (req, res) => {
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.fullDate() + " " + dateEt.fullTime();
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

app.get("/", async (req, res) => {
    let conn;
    const sqlPhotoReq = "SELECT filename, alt_text FROM multimeedia_db WHERE id=(SELECT MAX(id) FROM multimeedia_db WHERE privacy=? AND deleted IS NULL)";
    const sqlNewsReq = "SELECT title, content, photo_filename, alt_text FROM news_db WHERE expire > CURDATE() ORDER BY id DESC LIMIT 1";
    const privacy = 3;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [newsRows] = await conn.execute(sqlNewsReq);
        const latestNews = newsRows.length > 0 ? newsRows[0] : null;
        console.log("NEWS ROWS:", latestNews);
        const [rows] = await conn.execute(sqlPhotoReq, [privacy])
        console.log(rows);
        res.render("index", {
            photoList: rows,
            latestNews: latestNews
        });
    }
    catch (err) {
        console.log("Viga!" + err);
        res.render("index", { 
            photoList: [],
            latestNews: [] 
        });
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
})

/*
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
*/




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



/*
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
*/

// Eesti filmi marsruudid olid siin enne (before cleanup), edasi:
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter); // kui tuleb get /Eestifilm (vahet pole, mis /Eestifilm järel tuleb, peaasi et /Eestifilm on ees), siis kasutatakse eestifilmRouterit

const visitRoutes = require("./routes/visitRoutes");
app.use("/", visitRoutes);

// Galeriisse fotode ülesaadimiseks:
const photoUpRouter = require("./routes/photoUpRoutes");
app.use("/gallery_photo_upload", photoUpRouter);

// Uudiste marsruut
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);

// Galleri marsruut
const galleryRouter = require("./routes/galleryRoutes");
app.use("/photogallery", galleryRouter);

app.listen(5135, () => {
    console.log("Server running at http://localhost:5135/");
});