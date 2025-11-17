const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for photogallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res)=>{
	 res.redirect("/photogallery/1");
};

const galleryPage = async (req, res)=>{
	let conn;
	const photoLimit = 4;
	const privacy = 2;
	console.log(req.params);
	let page = parseInt(req.params.page);
	let skip = 0;

	try {
		// kontrollin et poleks liiga väike lehekülg
		if (page < 1 || isNaN(page)) {
			page = 1 // vägisi page number = 1
		}

		// vaatame, palju on fotosid kokku
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT COUNT(id) AS photos FROM multimeedia_db WHERE privacy >= ? AND DELETED IS NULL";
		const [countResult] = await conn.execute(sqlReq, [privacy]);
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
		} else{
			galleryLinks += `<a href="/photogallery/${page + 1}"> Järgmine leht </a>`;
		}


		console.log(galleryLinks);


		// fotode DB-st lugemine:
		sqlReq = "SELECT filename, alt_text FROM multimeedia_db WHERE privacy >= ? AND deleted IS NULL LIMIT ?, ?"; // limiti esimene ? = mitu vahele jätta, teine ? = mitu tk näidata

		const [rows, fields] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alt_text != ""){
				altText = rows[i].alt_text;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("gallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks});
	}
	catch(err){
		console.log(err);
		res.render("gallery", {listData: [], imagehref: "/gallery/thumbs/", links: ""});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("AndmebaasiÃ¼hendus on suletud!");
	  }
	}
};



module.exports = {
	galleryHome,
	galleryPage
};