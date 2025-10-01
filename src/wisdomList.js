const fs = require("fs");
const path = require("path");
const textRef = path.join(__dirname, "../public/txt/vanasonad.txt");

console.log("Text file path:", textRef);
console.log("Fail olemas?", fs.existsSync(textRef));

const generateAllVanasonad = function() {
    try {
        let data = fs.readFileSync(textRef, "utf8");
        if (data) {
            let list = data.split(";").map(s => s.trim()).filter(Boolean);
            return list;
        } else {
            return [];
        }
    } catch (err) {
        console.log("Error: ", err);
        return [];
    }
}

const getSingleWisdomSaying = function() {
    let wisdomList = generateAllVanasonad();
    if (wisdomList.length === 0) {
        return "<p>Vanasõnu pole!</p>";
    }
    let randomSaying = wisdomList[Math.floor(Math.random() * wisdomList.length)];
    return randomSaying;
}

const generateVanasonaForHTML = function() {
    const list = generateAllVanasonad();
    if (list.length === 0) {
        return "<p>Vanasõnu pole!</p>";
    }

    const vanasonadForHTML = list.map(vanasonad => `<li>${vanasonad}</li>`).join("");
    return `<ol>${vanasonadForHTML}</ol>`;
}

module.exports = { generateAllVanasonad, generateVanasonaForHTML, getSingleWisdomSaying };