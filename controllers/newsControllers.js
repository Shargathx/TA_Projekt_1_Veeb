const fs = require("fs").promises;
const sharp = require("sharp");
const dateInfo = require("../src/dateTimeET")
const pool = require("../src/dbPool");

// @desc home pag for uploading photos
// @route GET /galleryphotoupload
//@access public


// @desc page for ADDING news entries into news_db
// @route GET /news_upload
//@access public

const newsListPage = async (req, res) => { // Toob esile kõik uudised, mis vastab expired sättele
    try {
        const today = new Date().toISOString().split('T')[0];

        const [rows] = await pool.execute("SELECT * FROM news_db WHERE expire > ? ORDER BY expire ASC", [today]);
        res.render("news_list", { news: rows });
    }
    catch (err) {
        console.log(err);
        res.render("news_list", { news: [] });
    }
    finally {
        console.log("Connection ended!");

    }

}

const loadNewsUploadPage = (req, res) => { // See renderdab POST-formi uuesti (peale saatmist näeb kasutaja tühja formi jälle)
    res.render("news_upload");
}

const newsPhotoUploadPagePost = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    try {
        let photoName = null;

        if (req.file) {
            photoName = "uudis_" + Date.now() + ".jpg";
            console.log(photoName); // et näha, mis nimega salvestub / sanity check

            await fs.rename(req.file.path, req.file.destination + photoName);
            await sharp(req.file.destination + photoName).resize(800, 600).jpeg({ quality: 90 }).toFile("./public/gallery/news/normal/" + photoName);
            await sharp(req.file.destination + photoName).resize(100, 100).jpeg({ quality: 90 }).toFile("./public/gallery/news/thumbs/" + photoName);
        }

        const expireDate = dateInfo.getFutureDate(90);

        let sqlReq = "INSERT INTO news_db (title, content, expire, photo_filename, alt_text, userId) VALUES (?, ?, ?, ?, ?, ?)";

        // kuna kasutajakontosid veel pole, siis määrame userId = 1
        const userID = 1;
        const altText = req.body.altInput || null;
        const [result] = await pool.execute(sqlReq, [req.body.titleInput, req.body.contentInput, expireDate, photoName, altText, userID]);
        console.log("Salvestati kirje: " + result.insertId);

        res.render("news_upload");
    }
    catch (err) {
        console.log(err);
        res.render("news_upload");

    }
    finally {
        console.log("Connection ended!");
    }
}



module.exports = {
    loadNewsUploadPage,
    newsListPage,
    newsPhotoUploadPagePost,
}