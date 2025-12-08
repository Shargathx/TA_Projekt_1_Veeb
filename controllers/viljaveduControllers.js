const pool = require("../src/dbPool");

// @desc home pag for Estonian Film section
// @route GET /Eestifilm
//@access public

// app.get("/Eestifilm", (req, res) => {
const viljavedu = (req, res) => { // Router kasutab seda funktsiooni
    res.render("viljavedu_add");
}

// @desc actors/people involved with/in Estonian films
// @route GET /Eestifilm/inimesed
//@access public

// app.get("/Eestifilm/inimesed", async (req, res) => { // vana viis, enne jagamist)
const autod = async (req, res) => {
    const sqlReq = "SELECT * FROM viljavedu WHERE exit_mass IS NULL";
    try {
        console.log("DB ühendus loodud!");
        const [rows] = await pool.execute(sqlReq);
        res.render("viljavedu", { carList: rows });
    }
    catch (err) {
        console.log("Viga!" + err);
        res.render("viljavedu", { carList: [] });
    }
    finally {
        console.log("Ühendus lõppenud!");
    }
}

// @desc page for GETTING people involved in Estonian films
// @route GET /Eestifilm/filmiinimesed_add
//@access public

// app.get("/Eestifilm/filmiinimesed_add", (req, res) => {
const viljaveduInAdd = (req, res) => {
    console.log(req.body);
    res.render("viljavedu_add", { notice: "Ootan sisestust!" });
}

// @desc page for ADDING people involved in Estonian films
// @route GET /Eestifilm/filmiinimesed_add
//@access public

const viljaveduInAddPost = async (req, res) => {
    console.log(req.body);
    let exitMass = null;
    let cropMass = null;
    let sqlReq = "INSERT INTO viljavedu (register_number, entry_mass, exit_mass, crop_mass) VALUES (?, ?, ?, ?)";

    if (!req.body.registerNumberInput || !req.body.entryMassInput) {
        res.render("viljavedu_add", { notice: "Auto registrinumber või sisenemismass on puudu!" });
    }
    else {
        try {
            console.log("DB ühendus loodud!");
            const [result] = await pool.execute(sqlReq, [req.body.registerNumberInput, req.body.entryMassInput, exitMass, cropMass]);
            console.log("Salvestati kirje: " + result.insertId);
            res.render("viljavedu_add", { notice: "Salvestamine õnnestus!" });
        }
        catch (err) {
            console.error("SQL insert error:", err);
            res.render("viljavedu_add", { notice: "Salvestamine ebaõnnestus!" });
        }
        finally {
            console.log("Connection ended!");
        }
    }
}

const viljaveduOutAdd = async (req, res) => {
    console.log(req.body);
    let sqlReq = "SELECT * FROM viljavedu WHERE exit_mass IS NULL";
        try {
        console.log("DB ühendus loodud!");
        const [rows] = await pool.execute(sqlReq);
        res.render("viljavedu_exit", { carList: rows, notice: "Ootan väljumismassi" });
    }
    catch (err) {
        console.log("Viga!" + err);
        res.render("viljavedu_exit", { carList: [], notice: "Mingi error" });
    }
    finally {
        console.log("Ühendus lõppenud!");
    }
}

const viljaveduOutAddPost = async (req, res) => {
    console.log(req.body);
    let cropMass = null;
    let cropSqlReq = "SELECT entry_mass FROM viljavedu WHERE id = ?";
    console.log(req.body.registerNumberSelect);
    let sqlReq = "UPDATE viljavedu SET exit_mass = ?, crop_mass = ? WHERE id = ?";

    if (!req.body.registerNumberSelect || !req.body.exitInput) {
        res.render("viljavedu_exit", { carList: [], notice: "Auto väljumismass on puudu!" });
    }
    else {
        try {
            console.log("DB ühendus loodud!");
            const [cropResult] = await pool.execute(cropSqlReq, [req.body.registerNumberSelect]);

            console.log(cropResult[0].entry_mass);
            cropMass = parseInt(cropResult[0].entry_mass) - parseInt(req.body.exitInput);
            console.log("Vilja mass: " + cropMass);

            const [result] = await pool.execute(sqlReq, [req.body.exitInput, cropMass, req.body.registerNumberSelect]);
            //console.log("Salvestati kirje: " + result.insertId);
            res.render("viljavedu_exit", { carList: [], notice: "Salvestamine õnnestus!" });
        }
        catch (err) {
            console.error("SQL insert error:", err);
            res.render("viljavedu_exit", { carList: [], notice: "Salvestamine ebaõnnestus!" });
        }
        finally {
            console.log("Connection ended!");
        }
    }
}
/*
// app.get("/Eestifilm/filmi_position_add", (req, res) => {
const filmPositionAdd = (req, res) => { // näitab tühja lehte
    console.log(req.body);
    res.render("filmi_positions_add", { notice: "Ootan sisestust!" });
}

// app.get("/Eestifilm/film_positions", (req, res) => {
const position = async (req, res) => {
    const sqlReq = "SELECT * FROM `position`"; // teeb SQL päringu minu andmebaasile, tavalised SQL commandid
    try {
        console.log(sqlReq);
        const [rows, fields] = await pool.execute(sqlReq); // saadab selle ülevalpool nimetatud asja (sqlReq const) välja, salvestab selle massiivi! rows ja fields, kuna tegemist on SELECT käsuga
        res.render("film_positions", { positionList: rows });
    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("film_positions", { positionList: [] });

    }
    finally {
        console.log("Connection ended!");
    }
};


// app.post("/Eestifilm/filmi_position_add", (req, res) => {
const filmPositionAddPost = async (req, res) => { // võtab info ja saada POSTi
    console.log(req.body);
    let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
    try {
        console.log("DB ühendus loodud!");
        const [result] = await pool.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput]); // kuna tuleb palju andmeid tagasi, siis on result massiiv
        console.log("Salvestati kirje: " + result.insertId); // saame teada selle äsja lisatud kirje ID
        await res.redirect("/Eestifilm/position");
    }
    catch (err) {
        throw (err);
    }
    finally {
        console.log("Connection ended!");
    }
}

const movies = async (req, res) => {
    // title, production_year, duration (minutes), description
    const sqlReq = "SELECT * FROM movie"; // teeb SQL päringu minu andmebaasile, tavalised SQL commandid
    try {
        console.log(sqlReq);
        const [rows, fields] = await pool.execute(sqlReq); // saadab selle ülevalpool nimetatud asja (sqlReq const) välja, salvestab selle massiivi! rows ja fields, kuna tegemist on SELECT käsuga
        res.render("movies", { movieList: rows });
    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("movies", { movieList: [] });

    }
    finally {
        console.log("Connection ended!");
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
    let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?, ?, ?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
    try {
        console.log("DB ühendus loodud!");
        if (req.body.movieDescription != "") {
            movieDescription = req.body.movieDescriptionInput;
        }
        const [result] = await pool.execute(sqlReq, [req.body.movieNameInput, req.body.movieProductionYearInput, req.body.movieLengthInput, req.body.movieDescriptionInput]); // kuna tuleb palju andmeid tagasi, siis on result massiiv
        console.log("Salvestati kirje: " + result.insertId); // saame teada selle äsja lisatud kirje ID
        await res.redirect("/Eestifilm/movies");
    }
    catch (err) {
        throw (err);
    }
    finally {
        console.log("Connection ended!");
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
    try {
        const [movies] = await pool.execute("SELECT * FROM movie");
        const [persons] = await pool.execute("SELECT * FROM person");
        const [positions] = await pool.execute("SELECT * FROM position");

        res.render("person_movie_position", { movieList: movies, personList: persons, positionList: positions, notice: "" });

    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("person_movie_position", { movieList: [], personList: [], positionList: [] });
    }
    finally {
        console.log("Connection ended!");
    }
};

const relationMoviePersonPositionPost = async (req, res) => {
    try {
        const { personSelect, movieSelect, positionSelect, rolenameInput } = req.body;
        console.log("personSelect:", personSelect);
        console.log("movieSelect:", movieSelect);
        console.log("positionSelect:", positionSelect);
        console.log("rolenameInput:", rolenameInput);


        let roleName = null;
        if (Number(positionSelect) === 1) { // id 1 == näitleja
            roleName = rolenameInput || null;
        }

        await pool.execute("INSERT INTO person_in_movie (person_id, movie_id, position_id, role) VALUES (?, ?, ?, ?)", [personSelect, movieSelect, positionSelect, roleName]);
        // redirect to all relations:
        res.redirect("person_movie_relations");

    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("person_movie_position", { movieList: [], personList: [], positionList: [], notice: "Viga!" });
    }
    finally {
        console.log("Connection ended!");
    }
};

const personMovieRelations = async (req, res) => {
    try {

        const [relations] = await pool.execute("SELECT * FROM person_in_movie");
        res.render("person_movie_relations", { relationList: relations });

    } catch (err) {
        console.error("SQL query error:", err);
        res.render("person_movie_relations", { relationList: [] });
    } finally {
        console.log("Ühendus lõppes!");
    }
};

*/

module.exports = {
    viljavedu,
    autod,
    viljaveduInAdd,
    viljaveduInAddPost,
    viljaveduOutAdd,
    viljaveduOutAddPost
}