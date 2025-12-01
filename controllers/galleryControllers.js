const mysql = require("mysql2/promise");
const pool = require("../src/dbPool");

// const dbConf = {
// 	host: dbInfo.configData.host,
// 	user: dbInfo.configData.user,
// 	password: dbInfo.configData.passWord,
// 	database: dbInfo.configData.dataBase
// };

//@desc home page for photogallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res) => {
	res.redirect("/photogallery/1");
};

const myGalleryPage = async (req, res) => {
	const photoLimit = 4;
	const privacy = 2;
	console.log(req.params);
	let page = parseInt(req.params.page);
	let skip = 0;
	const userId = req.session.userId

	try {
		// kontrollin et poleks liiga väike lehekülg
		if (page < 1 || isNaN(page)) {
			page = 1 // vägisi page number = 1
		}

		// vaatame, palju on fotosid kokku
		let sqlReq = "SELECT COUNT(id) AS photos FROM multimeedia_db WHERE userId = ? AND privacy >= ? AND DELETED IS NULL";
		const [countResult] = await pool.execute(sqlReq, [userId, privacy]);
		const photoCount = countResult[0].photos; // sest SQL otsis AS "photos"

		// parandame leheküljenumbri, kui see on valitud liiga suur
		if ((page - 1) * photoLimit >= photoCount) {
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		let skip = (page - 1) * photoLimit

		// navigatsioonilinkide loomine
		// eelmine leht:
		if (page === 1) {
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;" // &nbsp - non-breakable space, jätab sisse tühikud
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}"> Eelmine leht </a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;`;
		}
		if (page * photoLimit >= photoCount) {
			galleryLinks += "Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}"> Järgmine leht </a>`;
		}


		console.log(galleryLinks);


		// fotode DB-st lugemine:
		sqlReq = "SELECT id, filename, alt_text FROM multimeedia_db WHERE userId = ? AND privacy >= ? AND deleted IS NULL LIMIT ?, ?"; // limiti esimene ? = mitu vahele jätta, teine ? = mitu tk näidata

		const [rows, fields] = await pool.execute(sqlReq, [userId, privacy, skip, photoLimit]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i++) {
			let altText = "Galeriipilt";
			if (rows[i].alt_text != "") {
				altText = rows[i].alt_text;
			}
			galleryData.push({ id: rows[i].id, src: rows[i].filename, alt: altText });
		}
		res.render("my_gallery", { galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks });
	}
	catch (err) {
		console.log(err);
		res.render("my_gallery", { listData: [], imagehref: "/gallery/thumbs/", links: "" });
	}
	finally {
		console.log("DB ühendus lõppes");
	}
};

const mySinglePhoto = async (req, res) => {
	const userId = req.session.userId;
	const photoId = req.params.id;

	if (!userId) {
		return res.redirect("/login");
	}

	try {
		const [rows] = await pool.execute("SELECT * FROM multimeedia_db WHERE id = ? AND userId = ? AND deleted IS NULL", [photoId, userId]);

		if (rows.length === 0) {
			return res.status(404).send("Photo not found");
		}

		const photo = rows[0];
		res.render("mySinglePhoto", {
			photo,
			imagehref: "/gallery/thumbs/"
		});

	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
};

const updatePhoto = async (req, res) => {
	const userId = req.session.userId;
	const photoId = req.params.id;
	const { altInput, privacyInput } = req.body;

	if (!userId) {
		return res.redirect("/login");
	}

	try {
		const sqlReq = "UPDATE multimeedia_db SET alt_text = ?, privacy = ? WHERE id = ? AND userId = ?";
		await pool.execute(sqlReq, [altInput, privacyInput, photoId, userId]);

		res.redirect("/photogallery/myGallery");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
};




const galleryPage = async (req, res) => {
	const photoLimit = 4;
	const privacy = 2;
	console.log(req.params);
	let page = parseInt(req.params.page);
	const userId = req.session.userId;
	let skip = 0;

	try {
		// kontrollin et poleks liiga väike lehekülg
		if (page < 1 || isNaN(page)) {
			page = 1 // vägisi page number = 1
		}

		// vaatame, palju on fotosid kokku
		let sqlReq = "SELECT COUNT(id) AS photos FROM multimeedia_db WHERE privacy >= ? AND DELETED IS NULL";
		const [countResult] = await pool.execute(sqlReq, [privacy]);
		const photoCount = countResult[0].photos; // sest SQL otsis AS "photos"

		// parandame leheküljenumbri, kui see on valitud liiga suur
		if ((page - 1) * photoLimit >= photoCount) {
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		let skip = (page - 1) * photoLimit

		// navigatsioonilinkide loomine
		// eelmine leht:
		if (page === 1) {
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;" // &nbsp - non-breakable space, jätab sisse tühikud
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}"> Eelmine leht </a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;`;
		}
		if (page * photoLimit >= photoCount) {
			galleryLinks += "Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}"> Järgmine leht </a>`;
		}


		console.log(galleryLinks);


		// fotode DB-st lugemine:
		sqlReq = "SELECT m.id, m.filename, m.alt_text, u.first_name, u.last_name FROM multimeedia_db m JOIN users u ON m.userId = u.id WHERE m.privacy >= ? AND m.deleted IS NULL LIMIT ?, ?"; // limiti esimene ? = mitu vahele jätta, teine ? = mitu tk näidata

		const [rows, fields] = await pool.execute(sqlReq, [privacy, skip, photoLimit]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i++) {
			let altText = "Galeriipilt";
			if (rows[i].alt_text != "") {
				altText = rows[i].alt_text;
			}
			galleryData.push({id: rows[i].id, src: rows[i].filename, alt: altText, owner: rows[i].first_name + " " + rows[i].last_name });
		}
		res.render("gallery", { galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks });
	}
	catch (err) {
		console.log(err);
		res.render("gallery", { galleryData: [], imagehref: "/gallery/thumbs/", links: "" });
	}
	finally {
			console.log("DB ühendus on suletud!");
	}
};



module.exports = {
	galleryHome,
	galleryPage,
	myGalleryPage,
	mySinglePhoto,
	updatePhoto
};