import bookThumb from "./assets/images/mockups/book-thumb.jpg";
import tshirtThumb from "./assets/images/mockups/tshirt-thumb.jpg";
import mugThumb from "./assets/images/mockups/mug-thumb.jpg";
import packageBoxThumb from "./assets/images/mockups/package-box-thumb.jpg";
import packageBox from "./assets/images/mockups/package-box.jpg";

import bookMockup from "./assets/images/mockups/book-mockup.jpg";
import mugMockup from "./assets/images/mockups/mug.jpg";
import tshirtMock from "./assets/images/mockups/tshirt.jpg";
let mockuplist = [
    {
        id: "book",
        thumb: bookThumb,
        mockup: bookMockup,
        title: "Hard Cover Book",
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
    },
    {
        id: "package",
        thumb: packageBoxThumb,
        mockup: packageBox,
        title: "Package Box",
        editableLayers: [
            {
                id: "sidea",
                label: "Side A",
                px: { w: 895, h: 1800 },
            },
            {
                id: "sideb",
                label: "Side B",
                px: { w: 895, h: 1800 },
            },
        ],
    },
    {
        id: "mug",
        thumb: mugThumb,
        mockup: mugMockup,
        title: "Mug",
        editableLayers: [
            {
                id: "image",
                label: "Image",
                px: { w: 1500, h: 1200 },
            },
        ],
    },
    {
        id: "tshirt",
        thumb: tshirtThumb,
        mockup: tshirtMock,
        title: "Crew Neck Tshirt",
        editableLayers: [
            {
                id: "design",
                label: "Design",
                px: { w: 1350, h: 1910 },
            },
        ],
    },
];
mockuplist = mockuplist.map((m) => {
    if (m.editableLayers) {
        m.editableLayers = m.editableLayers.map((l) => {
            let ratioX = 1;
            l.ratio = { w: ratioX, h: ratioX / (l.px.w / l.px.h) };
            return l;
        });
    }
    return m;
});
export default mockuplist;
