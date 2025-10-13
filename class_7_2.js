// fs = file system
const fs = require("fs").promises; // võtab ainult Promise-id kaasa (ootamise / wait oskus)
const textRef = "public/txt/vanasonad.txt";

fs.readFile(textRef, "utf8")
    .then((data) => {
        console.log(data) // data sellep, et textRef-ist tuleb data juba sisse
    })
    .catch(() => {
        console.log("Viga!")
    })