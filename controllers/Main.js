const config = require("../config/config");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs-extra");
const { exec } = require("child_process");
const extract = require("extract-zip");

const MainController = {};
const psCompatiblePath = (p) => {
    return p.replace(new RegExp("\\" + path.sep, "g"), "/");
};
const getScript = (base, targetMockup) => {
    let layerFiles = "[";
    for (let i = 0; i < targetMockup.editableLayers.length; i++) {
        let m = targetMockup.editableLayers[i];
        let psdFile = `"${psCompatiblePath(path.join(base, m.filename))}"`;
        if (i !== targetMockup.editableLayers.length - 1) {
            psdFile += ",";
        }
        layerFiles += psdFile;
    }
    layerFiles += "]";
    let finalPsd = `"${psCompatiblePath(
        path.join(base, targetMockup.filename)
    )}"`;
    let jpegOutputFileName = `${uuid()}.jpg`;
    let jpegOutput = `"${psCompatiblePath(
        path.join(base, jpegOutputFileName)
    )}"`;
    let jsScript = `const layerFiles = ${layerFiles};
        const finalPsd = ${finalPsd};
        
        function updateLinks() {
            var desc = new ActionDescriptor();
            executeAction(
                app.stringIDToTypeID("placedLayerUpdateAllModified"),
                desc,
                DialogModes.NO
            );
        }
        for (var i = 0; i < layerFiles.length; i++) {
            var layer = layerFiles[i];
            var file = new File(layer);
            app.open(file);
            updateLinks();
            app.activeDocument.save();
            app.activeDocument.close(SaveOptions.SAVECHANGES);
        }
        
        app.open(new File(finalPsd));
        updateLinks();
        jpgSaveFile = new File(${jpegOutput});
        const jpgOptns = new JPEGSaveOptions();
        jpgOptns.formatOptions = FormatOptions.STANDARDBASELINE;
        jpgOptns.embedColorProfile = true;
        jpgOptns.matte = MatteType.NONE;
        jpgOptns.quality = 10;
        app.activeDocument.saveAs(jpgSaveFile, jpgOptns, true, Extension.LOWERCASE);
        app.activeDocument.save();
        app.activeDocument.close(SaveOptions.SAVECHANGES);
    `;
    return {
        jsScript,
        finalOutput: jpegOutputFileName,
    };
};

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
    let projectzip = path.join(
        __dirname,
        "..",
        "public",
        "exports",
        `${projectid}.zip`
    );
    if (!fs.existsSync(projectdir)) {
        fs.copySync(targetMockup.projectLocation, projectzip);
        await extract(projectzip, { dir: projectdir });
        fs.removeSync(projectzip);
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
const waitUntillItsCreated = async (path) => {
    return new Promise((resolve, reject) => {
        const check = () => {
            if (fs.existsSync(path)) {
                resolve(path);
            } else {
                setTimeout(() => {
                    check();
                }, 1000);
            }
        };
        check();
    });
};
MainController.exportProject = async (req, res) => {
    if (!req.params.projectid) {
        res.status(400).json({ message: "Invalid Project id" });
        return;
    }

    if (!req.params.mockupid) {
        res.status(400).json({ message: "Please provide mockup id." });
        return;
    }
    let targetMockup = config.mockups.find((m) => m.id === req.params.mockupid);
    if (!targetMockup) {
        res.status(404).json({ message: "No such mockup exists." });
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
    let { jsScript, finalOutput } = getScript(projectdir, targetMockup);
    let scriptPath = path.join(projectdir, "ready.jsx");
    fs.writeFileSync(scriptPath, jsScript);
    let cmd = `cd "${projectdir}" && photoshop ready.jsx`;
    exec(cmd);
    await waitUntillItsCreated(path.join(projectdir, finalOutput));
    res.status(200).json({
        url: `exports/${projectid}/${finalOutput}`,
    });
};

module.exports = MainController;
