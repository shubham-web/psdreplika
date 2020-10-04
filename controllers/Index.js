let express = require("express");
let router = express.Router();
let rimraf = require("rimraf");
let path = require("path");
let globby = require("globby");
router.get("/", function (req, res, next) {
    res.send("<h1>Windows Server</h1>");
});
router.get("/clean-exports", (req, res) => {
    globby([
        path.join(__dirname, "..", "public", "exports"),
        "!.gitignore",
    ]).then(function then(paths) {
        paths.map(function map(item) {
            rimraf.sync(item);
        });
    });

    res.send("Done");
});
module.exports = router;
