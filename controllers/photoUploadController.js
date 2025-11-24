const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../vp2025config"); // 4 kausta väljaspool

const dbConfig = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

// @desc home pag for uploading photos
// @route GET /galleryphotoupload
//@access public

const photoUploadPage = (req, res) => { // Router kasutab seda funktsiooni
    res.render("gallery_photo_upload");
}


// @desc page for ADDING photos into gallery
// @route GET /galleryphotoupload
//@access public

const photoUploadPagePost = async (req, res) => {
    let conn;
    console.log(req.body);
    console.log(req.file);
    watermarkPath = "./public/gallery/vp_logo_small.png";
    try {
        // nime muutmine:
        const fileName = "vp_" + Date.now() + ".jpg";
        console.log(fileName); // et näha, mis nimega salvestub / sanity check
        await fs.rename(req.file.path, req.file.destination + fileName);

        // suuruse muutmiseks (normaalasuurus + watermark, nt 800x600):
        // TODO: watermark check, et kui seda faili pole, siis peaks ikkagi faili üles laadima, lihtsalt ilma watermark-ita
        await sharp(req.file.destination + fileName).resize(800, 600).composite([{input: watermarkPath, gravity: "southeast", blend: "over"}]).jpeg({ quality: 90 }).toFile("./public/gallery/normal/" + fileName);
        // võtab üleslaetava faili, muudab suuruse ja failitüübi (jpeg-ks, 90%-kvaliteediga), salvestab asukohta + nimega ^

        // thumbnail (100, 100):
        await sharp(req.file.destination + fileName).resize(100, 100).jpeg({ quality: 90 }).toFile("./public/gallery/thumbs/" + fileName);

        conn = await mysql.createConnection(dbConfig);
        let sqlReq = "INSERT INTO multimeedia_db (filename, orig_name, alt_text, privacy, userId) VALUES (?, ?, ?, ?, ?)";

        // kuna kasutajakontosid veel pole, siis määrame userId = 1
        const userID = req.session.userId;
        // const altText = req.body.altInput || null;
        // const privacy = req.body.privacyInput || null;
        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userID]);
        console.log("Salvestati kirje: " + result.insertId);

        res.render("gallery_photo_upload");
    }
    catch (err) {
        console.log(err);
        res.render("gallery_photo_upload");

    }
    finally {
        if (conn) {
            await conn.end();
            console.log("Connection ended!");
        }
    }
}

module.exports = { photoUploadPagePost };   

// IDEA FOR FUTURE, watermark as a helper method
// const addWatermark = async (inputPath, outputPath, watermarkPath) => {
//     await sharp(inputPath)
//         .resize(800, 600)
//         .composite([{ input: watermarkPath, gravity: "southeast" }])
//         .jpeg({ quality: 90 })
//         .toFile(outputPath);
// };

module.exports = {
    photoUploadPage,
    photoUploadPagePost,
}