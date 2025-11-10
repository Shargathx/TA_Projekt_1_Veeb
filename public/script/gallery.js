window.onload = function() {
    // käin lehe läbi ja teen listi kõigist thumbs klassiga pisipiltidest:
    let allThumbs = document.querySelector("#gallery").querySelectorAll(".thumbs"); // # - id, . - class

    // määran kõigile funktsiooni, mis käivitatakse hiireklikiga:
    for (let i = 0; i < allThumbs.length; i++){
        allThumbs[i].addEventListener("click", openModal); // openModal funkt. ilma sulgudeta ei käivitu koheselt, ainult kiireklikiga. Sulgudega käivituks kohe.
    }
    document.querySelector("#modalClose").addEventListener("click", closeModal);
    document.querySelector("#modalImage").addEventListener("click", closeModal);
}

function openModal(e) { // e - tähistab event-i
    document.querySelector("#modalImage").src = "/gallery/normal/" + e.target.dataset.filename; // määrab normaalsele pildile sourciks valitud (väikese) faili
    document.querySelector("#modalCaption").innerHTML = e.target.alt; // innterHTML kirjutab selle tekstikõigu sisse
    document.querySelector("#modal").showModal();
}

function closeModal() {
    document.querySelector("#modal").close();
    document.querySelector("#modalImage").src = "/images/empty.png";
    document.querySelector("#modalCaption").innerHTML = "galeriipilt"; 
}