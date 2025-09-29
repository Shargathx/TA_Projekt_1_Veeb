const fs = require("fs");
const path = require("path");

class PageImage {
    constructor(filename) {
        this.bannerPath = path.join(__dirname, "images", filename);
        this.bannerBase64 = "";
        this.loadBanner();
    }

    loadBanner() {
        if (!fs.existsSync(this.bannerPath)) {
            console.error("Banner file not found at:", this.bannerPath);
            return;
        }

        try {
            const data = fs.readFileSync(this.bannerPath);
            this.bannerBase64 = data.toString("base64");
            console.log("Banner loaded successfully.");
        } catch (err) {
            console.error("Error reading banner:", err);
        }
    }

        getHTML(width = "auto", height = "auto") {
            if (!this.bannerBase64) return "<p>Banner not available</p>";
            return `<img src="data:image/jpeg;base64,${this.bannerBase64}" alt="Banner" style="width:${width}; height:${height};">`;
        }
}

class PageAudio {
    constructor(filename) {
        this.filename = filename;
        this.filePath = path.join(__dirname, "assets", filename);
    }

    serve(req, res) {
        if (!fs.existsSync(this.filePath)) {
            res.writeHead(404);
            return res.end("File not found");
        }
        res.writeHead(200, { "Content-Type": "audio/mpeg" });
        fs.createReadStream(this.filePath).pipe(res);
    }

    getHTML() {
        return `<audio controls><source src="/assets/${this.filename}" type="audio/mpeg">Teie brauser ei toeta audio esitust.</audio>`;
    }
}


module.exports = { PageImage, PageAudio };
