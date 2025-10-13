// asünkroonne lähenemine
// Promise kasutamine:
const myDecision = new Promise((resolve, reject) => {
    const yesNo = Math.round(Math.random());
    console.log(yesNo);
    if (yesNo == 1) {
        resolve();
    }
    else {
        reject();
    }
});

myDecision
    .then(() => console.log("Jah!"))
    .catch(() => console.log("Ei!"));