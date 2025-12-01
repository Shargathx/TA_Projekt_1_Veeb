const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config"); // 4 kausta väljaspool
const argon2 = require("argon2");
const pool = require("../src/dbPool");
// installed "validata" / "validator" via console: npm install validata / validator
const validator = require("validator");
/*
const dbConfig = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}
    */

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
 //   let conn;
    let notice = "";
    console.log(req.body);
    console.log(req.file);

    // andmete valideerimine:
    /* // edited out the if statement to use validator instead
    if (
        !req.body.firstNameInput ||
        !req.body.lastNameInput ||
        !req.body.birthDateInput ||
        !req.body.genderInput ||
        !req.body.emailInput ||
        req.body.passwordInput.length < 8 ||
        req.body.passwordInput !== req.body.confirmPasswordInput
    ) {
        notice = "Andmeid on puudu või vigased!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }
        */
    // puhastame andmed:
    const firstName = validator.escape(req.body.firstNameInput.trim()); // escape eemaldab tekstist märgid (noolsulud, komad vms)
    const lastName = validator.escape(req.body.lastNameInput.trim());
    const birthDate = req.body.birthDateInput;
    const gender = req.body.genderInput;
    const email = req.body.emailInput.trim();
    const password = req.body.passwordInput;
    const confirmPassword = req.body.confirmPasswordInput;

    // kontroll, kas kõik oluline on olemas

    if (!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword) {
        notice = "Andmeid on puudu või vigased!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }

    // kas email on korrektne:
    if (!validator.isEmail(email)) {
        notice = "Email on vigane!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }

    // kas parool on korras:
    const passwordOptions = { minLength: 8, minLowercase: 1, minUppercase: 1, minNumber: 1, minSymbols: 0 }; // values-id võib muuta nii nagu vaja
    if (!validator.isStrongPassword(password, passwordOptions)) { // võrdleb parooli parooliOptionsiga
        notice = "Parool on nõrk!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }

    // kas paroolid klapivad:
    if (password !== confirmPassword) {
        notice = "Paroolid ei klapi!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }

    // kas sünnikuupäev on korrektne:
    if (!validator.isDate(birthDate) || validator.isAfter(birthDate)) {
        notice = "Sünnikuupäev vigane!"
        console.log(notice);
        return res.render("signup", { notice: notice });
    }

    try {
        // conn = await mysql.createConnection(dbConfig);
        // kontrollin varasemat kasutajanime olemasolu:
        let sqlReq = "SELECT id from users WHERE email = ?";
        // const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
        const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
        if (users.length > 0) {
            notice = "Selline kasutaja juba eksisteerib!";
            console.log(notice);
            return res.render("signup", { notice: notice });
        }

        // installed argon2 via "npm install argon2"
        // krüpteerime parooli:
        const pwdHash = await argon2.hash(req.body.passwordInput);
        console.log(pwdHash);
        console.log(pwdHash.length);

        sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)"

        // const [result] = await conn.execute(sqlReq, [
        const [result] = await pool.execute(sqlReq, [
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
    finally {/*
        if (conn) {
            await conn.end();
        }
            */
    }
}

module.exports = {
    signupPage,
    signupPagePost
};