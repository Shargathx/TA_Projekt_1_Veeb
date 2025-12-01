const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config"); // 4 kausta väljaspool
const argon2 = require("argon2");
const pool = require("../src/dbPool");

// const dbConfig = {
//     host: dbInfo.configData.host,
//     user: dbInfo.configData.user,
//     password: dbInfo.configData.passWord,
//     database: dbInfo.configData.dataBase
// }

// @desc home page for empty signin page
// @route GET /signin
//@access public

const signinPage = (req, res) => { // Router kasutab seda funktsiooni
    res.render("signin", { notice: "Sisesta kasutajatunnus ja parool" });
}


// @desc page for POST signin page
// @route POST /signin
//@access public

const signinPagePost = async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    // andmete valideerimine:
    if (
        !req.body.emailInput ||
        !req.body.passwordInput
    ) {
        let notice = "Andmeid on puudulikud!"
        console.log(notice);
        return res.render("signin", { notice: notice });
    }

    try {
        let sqlReq = "SELECT id, password FROM users WHERE email = ?";
        const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
        // kas sellise meiliga kasutaja leiti:
        if (users.length === 0) {
            return res.render("signin", { notice: "Kasutajatunnus ja/või parool on vale!" });
        }

        const user = users[0];

        // parooli kontroll läbi argon2:
        const match = await argon2.verify(user.password, req.body.passwordInput);
        if (match) {
            // logisime sisse
            // return res.render("signin", { notice: "Sisselogitud! :)" });

            // npm install express-session -> sessiooni manager, et kontrollida if logged in on true or nah
            // paneme sessiooni käima ja määrame sessiooni ühe muutuja
            req.session.userId = user.id;
            sqlReq = "SELECT first_name, last_name FROM users WHERE id = ?";
            const [loginUser] = await pool.execute(sqlReq, [req.session.userId]);
            req.session.firstName = loginUser[0].first_name;
            req.session.lastName = loginUser[0].last_name;
            return res.redirect("/home");

        }
        else {
            // parool vale
            console.log("Vale parool!")
            return res.render("signin", { notice: "Kasutajatunnus ja/või parool on vale!" });

        }
    }
    catch (err) {
        console.log(err);
        res.render("signin", { notice: "Tehniline viga!" });

    }
    finally {
    }
}

module.exports = {
    signinPage: signinPage,
    signinPagePost: signinPagePost
};