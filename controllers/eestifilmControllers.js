const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config"); // 4 kausta väljaspool

const dbConfig = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

// @desc home pag for Estonian Film section
// @route GET /Eestifilm
//@access public

// app.get("/Eestifilm", (req, res) => {
const eestifilm = (req, res) => { // Router kasutab seda funktsiooni
    res.render("eestifilm");
}

// @desc actors/people involved with/in Estonian films
// @route GET /Eestifilm/inimesed
//@access public

// app.get("/Eestifilm/inimesed", async (req, res) => { // vana viis, enne jagamist)
const inimesed = async (req, res) => {
    let conn; // connection
    const sqlReq = "SELECT * FROM person";
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log("DB ühendus loodud!");
        const [rows, fields] = await conn.execute(sqlReq); // saadab selle ülevalpool nimetatud asja (sqlReq const) välja, salvestab selle massiivi! rows ja fields, kuna tegemist on SELECT käsuga
        res.render("filmiinimesed", { personList: rows });
    }
    catch (err) {
        console.log("Viga!" + err);
        res.render("filmiinimesed", { personList: [] }); // tühi massiiv, et ei tekiks mingit jama, igaks juhuks
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
}

// @desc page for GETTING people involved in Estonian films
// @route GET /Eestifilm/filmiinimesed_add
//@access public

// app.get("/Eestifilm/filmiinimesed_add", (req, res) => {
const inimesedAdd = (req, res) => {
    console.log(req.body);
    res.render("filmiinimesed_add", { notice: "Ootan sisestust!" });
}

// @desc page for ADDING people involved in Estonian films
// @route GET /Eestifilm/filmiinimesed_add
//@access public

//app.post("/Eestifilm/filmiinimesed_add", async (req, res) => {
const inimesedAddPost = async (req, res) => {
    console.log(req.body);
    let deceasedDate = null;
    let conn; // connection
    let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)";

    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()) {
        res.render("filmiinimesed_add", { notice: "Andmed vigased või puudu" });
    }
    else {
        try {
            conn = await mysql.createConnection(dbConfig);
            console.log("DB ühendus loodud!");
            if (req.body.deceasedInput != "") {
                deceasedDate = req.body.deceasedInput;
            }
            const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]); // kuna tuleb palju andmeid tagasi, siis on result massiiv
            console.log("Salvestati kirje: " + result.insertId); // saame teada selle äsja lisatud kirje ID
            res.render("filmiinimesed_add", { notice: "Salvestamine õnnestus!" });
        }
        catch (err) {
            console.error("SQL insert error:", err);
            res.render("filmiinimesed_add", { notice: "Salvestamine ebaõnnestus!" });
        }
        finally {
            if (conn) {
                await conn.end();
                console.log("Connection ended!");
            }
        }
    }
}

/*
// some SQL stuff for homework (ejs faili):
<select id="PersonSelect" name="personSelect">
    <option selected disabled> Vali isik </option>
    <option value="id väärtus"> Isiku nimi </option>
    ...............................................
    <option value="18"> Siia tuleb ID 18 nimi </option>
    </select>
*/

// app.get("/Eestifilm/filmi_position_add", (req, res) => {
const filmPositionAdd = (req, res) => { // näitab tühja lehte
    console.log(req.body);
    res.render("filmi_positions_add", { notice: "Ootan sisestust!" });
}

// app.get("/Eestifilm/film_positions", (req, res) => {
const position = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM `position`"; // teeb SQL päringu minu andmebaasile, tavalised SQL commandid
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log(sqlReq);
        const [rows, fields] = await conn.execute(sqlReq); // saadab selle ülevalpool nimetatud asja (sqlReq const) välja, salvestab selle massiivi! rows ja fields, kuna tegemist on SELECT käsuga
        res.render("film_positions", { positionList: rows });
    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("film_positions", { positionList: [] });

    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
};


// app.post("/Eestifilm/filmi_position_add", (req, res) => {
const filmPositionAddPost = async (req, res) => { // võtab info ja saada POSTi
    console.log(req.body);
    let conn; // connection
    let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log("DB ühendus loodud!");
        const [result] = await conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput]); // kuna tuleb palju andmeid tagasi, siis on result massiiv
        console.log("Salvestati kirje: " + result.insertId); // saame teada selle äsja lisatud kirje ID
        await res.redirect("/Eestifilm/film_positions");
    }
    catch (err) {
        throw (err);
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
    // conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput], (err, sqlres) => {
    //     if (err) {
    //         console.error("SQL insert error:", err);
    //         res.render("filmi_position_add", { notice: "Salvestamine ebaõnnestus!" });
    //     }
    //     else {
    //         res.redirect("/Eestifilm/film_positions");
    //     }
    // });
}

const movies = async (req, res) => {
    // title, production_year, duration (minutes), description
    let conn;
    const sqlReq = "SELECT * FROM movie"; // teeb SQL päringu minu andmebaasile, tavalised SQL commandid
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log(sqlReq);
        const [rows, fields] = await conn.execute(sqlReq); // saadab selle ülevalpool nimetatud asja (sqlReq const) välja, salvestab selle massiivi! rows ja fields, kuna tegemist on SELECT käsuga
        res.render("movies", { movieList: rows });
    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("movies", { movieList: [] });

    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
};

const moviesGet = (req, res) => { // näitab tühja form-i
    console.log(req.body);
    res.render("movies_add", { notice: "Ootan sisestust!" });
}


// TODO: movie aasta ei saa olla suurem, kui tänane päev (tulevikku filme ei saa lisada)
const movieAddPost = async (req, res) => { // võtab info ja saada POSTi
    console.log(req.body);
    let movieDescription = null;
    let conn; // connection
    let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?, ?, ?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log("DB ühendus loodud!");
        if (req.body.movieDescription != "") {
            movieDescription = req.body.movieDescriptionInput;
        }
        const [result] = await conn.execute(sqlReq, [req.body.movieNameInput, req.body.movieProductionYearInput, req.body.movieLengthInput, req.body.movieDescriptionInput]); // kuna tuleb palju andmeid tagasi, siis on result massiiv
        console.log("Salvestati kirje: " + result.insertId); // saame teada selle äsja lisatud kirje ID
        await res.redirect("/Eestifilm/movies");
    }
    catch (err) {
        throw (err);
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
    // conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput], (err, sqlres) => {
    //     if (err) {
    //         console.error("SQL insert error:", err);
    //         res.render("filmi_position_add", { notice: "Salvestamine ebaõnnestus!" });
    //     }
    //     else {
    //         res.redirect("/Eestifilm/film_positions");
    //     }
    // });
}

const relationMoviePersonPosition = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [movies] = await conn.execute("SELECT * FROM movie");
        const [persons] = await conn.execute("SELECT * FROM person");
        const [positions] = await conn.execute("SELECT * FROM position");

        res.render("person_movie_position", { movieList: movies, personList: persons, positionList: positions, notice: "" });

    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("person_movie_position", { movieList: [], personList: [], positionList: [] });
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
};

const relationMoviePersonPositionPost = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        const { personSelect, movieSelect, positionSelect, rolenameInput } = req.body;
        console.log("personSelect:", personSelect);
        console.log("movieSelect:", movieSelect);
        console.log("positionSelect:", positionSelect);
        console.log("rolenameInput:", rolenameInput);


        let roleName = null;
        if (Number(positionSelect) === 1) { // id 1 == näitleja
            roleName = rolenameInput || null;
        }

        await conn.execute("INSERT INTO person_in_movie (person_id, movie_id, position_id, role) VALUES (?, ?, ?, ?)", [personSelect, movieSelect, positionSelect, roleName]);
        /*
        const [movies] = await conn.execute("SELECT * FROM movie");
        const [persons] = await conn.execute("SELECT * FROM person");
        const [positions] = await conn.execute("SELECT * FROM position");
        res.render("person_movie_position", { movieList: movies, personList: persons, positionList: positions, notice: "Seos lisatud!" });
        */
        // redirect to all relations:
        res.redirect("person_movie_relations");

    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("person_movie_position", { movieList: [], personList: [], positionList: [], notice: "Viga!" });
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Connection ended!");
        }
    }
};

const personMovieRelations = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        const [relations] = await conn.execute("SELECT * FROM person_in_movie");
        res.render("person_movie_relations", { relationList: relations });

    } catch (err) {
        console.error("SQL query error:", err);
        res.render("person_movie_relations", { relationList: [] });
    } finally {
        if (conn) await conn.end();
    }
};



module.exports = {
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost,
    position,
    filmPositionAdd,
    filmPositionAddPost,
    movies,
    moviesGet,
    movieAddPost,
    relationMoviePersonPosition,
    relationMoviePersonPositionPost,
    personMovieRelations

}