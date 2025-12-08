require("dotenv").config();
const dbInfo = require("../../../vp2025config"); // 3 kausta väljaspool
const session = require("express-session");
const pool = require("./src/dbPool");

const bodyparser = require("body-parser");
const express = require("express");
const { brotliDecompress } = require("zlib");

const app = express();
app.use(session({ secret: process.env.SES_SECRET, saveUninitialized: true, resave: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyparser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    const sqlReq = "SELECT register_number, entry_mass FROM viljavedu WHERE exit_mass IS NULL";
    try {
        const [rows] = await pool.execute(sqlReq);
        res.render("viljavedu", {
            carList: rows
        });
    }
    catch (err) {
        console.log("Viga!" + err);
        res.render("viljavedu", {
            carlist: []
        });
    }
    finally {
    }
})

const viljaveduRouter = require("./routes/viljaveduRoutes");
app.use("/viljavedu", viljaveduRouter);

// Sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5135, () => {
    console.log("Server running at http://localhost:5135/");
});