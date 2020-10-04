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
                },
                {
                    id: "spine",
                    label: "Spine",
                    px: { w: 325, h: 2728 },
                },
            ],
            projectLocation: path.join(__dirname, "..", "mockups", "book"),
        },
    ],
};
module.exports = data;
