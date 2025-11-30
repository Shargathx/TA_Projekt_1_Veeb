window.onload = function () {
    const allThumbs = document.querySelectorAll("#gallery .thumbs");
    const modal = document.querySelector("#modal");
    const modalImage = document.querySelector("#modalImage");
    const modalCaption = document.querySelector("#modalCaption");
    const editBtn = document.querySelector("#editPhotoBtn");
    const modalClose = document.querySelector("#modalClose");

    // Open modal when clicking a thumbnail
    allThumbs.forEach(img => {
        img.addEventListener("click", function (e) {
            const photoId = e.target.dataset.id;
            const owner = e.target.dataset.owner; // may be undefined

            modalImage.src = "/gallery/normal/" + e.target.dataset.filename;
            modalImage.dataset.id = photoId;      // store ID for edit button

            // Show owner only if data-owner exists
            if (owner) {
                modalCaption.innerHTML = e.target.alt + "<br><small>Uploaded by: " + owner + "</small>";
            } else {
                modalCaption.innerHTML = e.target.alt;
            }

            modal.showModal();
            history.pushState(null, "", `/photogallery/myphotos/${photoId}`);
        });
    });

    // Close modal
    function closeModal() {
        modal.close();
        modalImage.src = "/images/empty.png";
        modalImage.dataset.id = "";            // clear ID
        modalCaption.innerHTML = "galeriipilt";
        history.pushState(null, "", "/photogallery/myGallery");
    }

    modalClose.addEventListener("click", closeModal);
    modalImage.addEventListener("click", closeModal);

    // Edit button
    editBtn.addEventListener("click", () => {
        const photoId = modalImage.dataset.id;
        if (photoId) {
            window.location.href = `/photogallery/myphotos/${photoId}`;
        } else {
            console.error("Photo ID not set!");
        }
    });
};
