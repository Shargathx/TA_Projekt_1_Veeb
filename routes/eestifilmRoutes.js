const express = require("express");
const router = express.Router();

// Controllerid:
const {
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
    personMovieRelations,
} = require("../controllers/eestifilmControllers");

router.route("/").get(eestifilm); // tema enda juur on tegelt Eestifilm, aga tema tõlgendab automaatselt kui "/"
router.route("/inimesed").get(inimesed); // kaob Eestifilm eest ära 
router.route("/filmiinimesed_add").get(inimesedAdd);
router.route("/filmiinimesed_add").post(inimesedAddPost);
router.route("/position").get(position);
router.route("/position_add").get(filmPositionAdd);
router.route("/position_add").post(filmPositionAddPost);
router.route("/movies").get(movies);
router.route("/movies_add").get(moviesGet); // toob ette TÜHJA POST-formi
router.route("/movies_add").post(movieAddPost); // saadab täidetud POST-formi teele
router.route("/person_movie_position").get(relationMoviePersonPosition);
router.route("/person_movie_position").post(relationMoviePersonPositionPost);
router.route("/person_movie_relations").get(personMovieRelations);

module.exports = router; // ekspordib kõik siin olevad route-id

/* // see viis on manuaalsem, alumine kasutab async-i
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
*/


/*
app.post("/Eestifilm/filmiinimesed_add", (req, res) => { // old manual method, above uses async
    console.log(req.body);
    let deceasedDate = null;
    if (req.body.deceasedInput != "") {
        deceasedDate = req.body.deceasedInput;
    }
    // res.render("filmiinimesed_add");
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()) {
        res.render("filmiinimesed_add", { notice: "Andmed vigased või puudu" });
    }
    else {
        let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedDate], (err, sqlres) => {
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
*/
/*

*/
