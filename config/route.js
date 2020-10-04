const router = require("express").Router();
const controllers = {
    index: require("../controllers/Index"),
    main: require("../controllers/Main"),
};
let requests = {};
requests.apiPrefix = "";
requests.get = {
    "/export/:mockupid/:projectid": controllers.main.exportProject,
};

requests.post = {
    "/project/:mockupid/:layerid": controllers.main.uploadLayer,
};

requests.put = {};

requests.patch = {};

requests.delete = {};

router.use(controllers.index);
for (let url in requests.get) {
    router.route(requests.apiPrefix.concat(url)).get(requests.get[url]);
}

for (let endpoint in requests.post) {
    router
        .route(requests.apiPrefix.concat(endpoint))
        .post(requests.post[endpoint]);
}

for (let endpoint in requests.put) {
    router
        .route(requests.apiPrefix.concat(endpoint))
        .put(requests.put[endpoint]);
}

for (let endpoint in requests.patch) {
    router
        .route(requests.apiPrefix.concat(endpoint))
        .patch(requests.patch[endpoint]);
}

for (let endpoint in requests.delete) {
    router
        .route(requests.apiPrefix.concat(endpoint))
        .delete(requests.delete[endpoint]);
}

module.exports = router;
