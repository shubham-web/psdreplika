const path = require("path");
const data = {
    mockups: [
        {
            id: "book",
            editableLayers: [
                {
                    id: "cover",
                    label: "Cover",
                    px: { w: 1949, h: 2728 },
                    filename: "cover.psb",
                },
                {
                    id: "spine",
                    label: "Spine",
                    px: { w: 325, h: 2728 },
                    filename: "spine.psb",
                },
            ],
            projectLocation: path.join(__dirname, "..", "mockups", "book.zip"),
            filename: "main.psd",
        },
    ],
};
module.exports = data;
