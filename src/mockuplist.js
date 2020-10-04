import bookThumb from "./assets/images/mockups/book-thumb.jpg";
import tshirtThumb from "./assets/images/mockups/tshirt-thumb.jpg";
import mugThumb from "./assets/images/mockups/mug-thumb.jpg";
import packageBox from "./assets/images/mockups/package-box-thumb.jpg";

import bookMockup from "./assets/images/mockups/book-mockup.jpg";
/* import tshirtThumb from "./assets/images/mockups/tshirt-mockcup.jpg";
import mugThumb from "./assets/images/mockups/mug-mockcup.jpg";
import packageBox from "./assets/images/mockups/package-box-mockcup.jpg"; */
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
        thumb: packageBox,
        title: "Package Box",
    },
    {
        id: "mug",
        thumb: mugThumb,
        title: "Mug",
    },
    {
        id: "tshirt",
        thumb: tshirtThumb,
        title: "Crew Neck Tshirt",
    },
];
mockuplist = mockuplist.map((m) => {
    if (m.editableLayers) {
        m.editableLayers = m.editableLayers.map((l) => {
            console.log(l);
            let ratioX = 1;
            l.ratio = { w: ratioX, h: ratioX / (l.px.w / l.px.h) };
            return l;
        });
    }
    return m;
});
console.log(mockuplist);
export default mockuplist;
