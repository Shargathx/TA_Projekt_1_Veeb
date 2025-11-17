const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config"); // 4 kausta väljaspool
const argon2 = require("argon2");

const dbConfig = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

// @desc home pag for empty signup page
// @route GET /signup
//@access public

const signupPage = (req, res) => { // Router kasutab seda funktsiooni
    res.render("signup", { notice: "Ootan andmeid" });
}


// @desc page for POST signup page
// @route POST /signup
//@access public

const signupPagePost = async (req, res) => {
    let conn;
    console.log(req.body);
    console.log(req.file);

    // andmete valideerimine:
    if (
        !req.body.firstNameInput ||
        !req.body.lastNameInput ||
        !req.body.birthDateInput ||
        !req.body.genderInput ||
        !req.body.emailInput ||
        req.body.passwordInput.length < 8 ||
        req.body.passwordInput !== req.body.confirmPasswordInput
    ) {
        let notice = "Andmeid on puudu või vigased!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }

    try {
        // installed argon2 via "npm install argon2"
        // krüpteerime parooli:
        const pwdHash = await argon2.hash(req.body.passwordInput);
        console.log(pwdHash);
        console.log(pwdHash.length);

        conn = await mysql.createConnection(dbConfig);

        let sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)"

        const [result] = await conn.execute(sqlReq, [
            req.body.firstNameInput,
            req.body.lastNameInput,
            req.body.birthDateInput,
            req.body.genderInput,
            req.body.emailInput,
            pwdHash
        ]);
        console.log("Salvestati kasutaja: " + result.insertId);

        res.render("signup", { notice: "Kõik OK!" });
    }
    catch (err) {
        console.log(err);
        res.render("signup", { notice: "Tehniline viga!" });

    }
    finally {
        if (conn) {
            await conn.end();
        }
    }
}

module.exports = {
    signupPage,
    signupPagePost
};