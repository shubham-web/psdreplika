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
        {
            id: "package",
            editableLayers: [
                {
                    id: "sidea",
                    label: "Side A",
                    px: { w: 895, h: 1800 },
                    filename: "sidea.psb",
                },
                {
                    id: "sideb",
                    label: "Side B",
                    px: { w: 895, h: 1800 },
                    filename: "sideb.psb",
                },
            ],
            projectLocation: path.join(
                __dirname,
                "..",
                "mockups",
                "package.zip"
            ),
            filename: "main.psd",
        },
        {
            id: "mug",
            editableLayers: [
                {
                    id: "image",
                    label: "Image",
                    px: { w: 1500, h: 1200 },
                    filename: "image.psb",
                },
            ],
            projectLocation: path.join(__dirname, "..", "mockups", "mug.zip"),
            filename: "main.psd",
        },
        {
            id: "tshirt",
            editableLayers: [
                {
                    id: "design",
                    label: "Design",
                    px: { w: 1350, h: 1910 },
                    filename: "design.psb",
                },
            ],
            projectLocation: path.join(
                __dirname,
                "..",
                "mockups",
                "tshirt.zip"
            ),
            filename: "main.psd",
        },
    ],
};
module.exports = data;
