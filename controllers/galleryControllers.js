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
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alt_text FROM multimeedia_db WHERE privacy >= ? AND deleted IS NULL";
		const privacy = 2;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alt_text != ""){
				altText = rows[i].alt_text;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("gallery", {galleryData: galleryData, imagehref: "gallery/thumbs/"});
	}
	catch(err){
		console.log(err);
		res.render("gallery", {listData: []});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("AndmebaasiÃ¼hendus on suletud!");
	  }
	}
};

module.exports = {
	galleryHome
};