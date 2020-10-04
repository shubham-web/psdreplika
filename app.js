let express = require("express"),
    path = require("path"),
    config = require("./config/config"),
    cors = require("cors"),
    fileUpload = require("express-fileupload");
let routes = require("./config/route");
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, "tmp"),
    })
);
app.use(express.static(path.join(__dirname, "public")));

app.disable("X-Powered-By");
app.use(function (req, res, next) {
    res.header("X-Developed-By", "Shubham Prajapat");
    res.header("X-Powered-By", "shubhamprajapat.com");
    next();
});

app.use("/", routes);

app.use(function (req, res, next) {
    res.status(404).send({
        message: "No such api endpoint found.",
    });
});
/* error handler */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500).json({
        message: res.locals.message,
    });
});

module.exports = app;
