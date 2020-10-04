let express = require("express");
let router = express.Router();

router.get("/", function (req, res, next) {
    res.send("<h1>Windows Server</h1>");
});

module.exports = router;
