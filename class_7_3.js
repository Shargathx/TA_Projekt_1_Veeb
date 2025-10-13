// asünkroonne lähenemine
// async funktsioonid

// fs = file system
const fs = require("fs").promises; // võtab ainult Promise-id kaasa (ootamise / wait oskus)
const textRef = "public/txt/vanasonad.txt";

function pickOneSentence(rawText) { // võtab readTextFile poolt saadetud data ja kasutab seda funktsiooni alusena (eraldab teksti jnejne)
    // jaga tekst ";" järgi massiiviks / listiks
    let oldWisdomList = rawText.split(";");
    console.log(oldWisdomList);
    let wisdomCount = oldWisdomList.length;
    console.log(wisdomCount);
    // loosin ja väljastan 1 vanasõna:
    let wisdomOfTheDay = oldWisdomList[Math.round(Math.random() * (wisdomCount - 1))];
    return wisdomOfTheDay;
}

const readTextFile = async function () {
    // try üritab käske täita
    try {
        // await paneb funktsiooni töö ootele, kuni operatsioon / ülesanne täidetud
        const data = await fs.readFile(textRef, "utf8");
        console.log("Alustasin!");
        // console.log(data);
        const todaysWisdom = await pickOneSentence(data); // saadab saadud data (txt faili sisu)
        console.log(todaysWisdom);
    }
    // catch - veahaldus, kui try ei tööta
    catch {
        console.log("Viga!");
    }
    // finally - mis toimub peale try-catch toimimist
    finally {
        console.log("Lõpetasin!");

    }
}

readTextFile();
