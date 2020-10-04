const layerFiles = ["./psds/sandals/Layer 5.psd"];
const finalPsd = "./psds/sandals/sandals.psd";

function updateLinks() {
    const desc = new ActionDescriptor();
    executeAction(
        app.stringIDToTypeID("placedLayerUpdateAllModified"),
        desc,
        DialogModes.NO
    );
}
for (var i = 0; i < layerFiles.length; i++) {
    var layer = layerFiles[i];
    const file = new File(layer);
    app.open(file);
    updateLinks();
    app.activeDocument.save();
    app.activeDocument.close(SaveOptions.SAVECHANGES);
}

app.open(new File(finalPsd));
updateLinks();
jpgSaveFile = new File("./sandals.jpg");
const jpgOptns = new JPEGSaveOptions();
jpgOptns.formatOptions = FormatOptions.STANDARDBASELINE;
jpgOptns.embedColorProfile = true;
jpgOptns.matte = MatteType.NONE;
jpgOptns.quality = 10;
app.activeDocument.saveAs(jpgSaveFile, jpgOptns, true, Extension.LOWERCASE);
app.activeDocument.save();
app.activeDocument.close(SaveOptions.SAVECHANGES);
