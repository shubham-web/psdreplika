const config = require("../config/config");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs-extra");
const MainController = {};

MainController.uploadLayer = async (req, res) => {
    if (!req.files) {
        res.status(400).json({ message: "No file selected." });
        return;
    }
    if (!req.params.mockupid || !req.params.layerid) {
        res.status(400).json({ message: "Please provide mockup id." });
        return;
    }
    let targetMockup = config.mockups.find(
        (m) =>
            m.id === req.params.mockupid &&
            m.editableLayers.find((l) => l.id === req.params.layerid)
    );
    if (!targetMockup) {
        res.status(404).json({ message: "No such mockup exists" });
        return;
    }
    if (!req.files.layer) {
        res.status(400).json({ message: "Please select layer." });
        return;
    }
    let newProject = true;
    let projectid = uuid();
    if (req.body.projectid) {
        newProject = false;
        projectid = req.body.projectid;
    }
    let projectdir = path.join(__dirname, "..", "public", "exports", projectid);
    if (!fs.existsSync(projectdir)) {
        fs.copySync(targetMockup.projectLocation, projectdir);
    }

    let file = req.files.layer.tempFilePath;
    fs.rename(
        file,
        path.join(projectdir, `${req.params.layerid}.png`),
        function (err) {
            if (err) console.log("ERROR: " + err);
        }
    );
    res.status(200).json({
        success: 1,
        projectid: projectid,
    });
};
MainController.exportProject = (req, res) => {
    if (!req.params.projectid) {
        res.status(400).json({ message: "Invalid Project id" });
        return;
    }
    let projectid = req.params.projectid;
    let projectdir = path.join(__dirname, "..", "public", "exports", projectid);
    if (!fs.existsSync(projectdir)) {
        res.status(404).json({
            message: "Project expired or never initiated.",
        });
        return;
    }
};

module.exports = MainController;
