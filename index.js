const express = require("express");
const path = require("path");
const { connect } = require("./connection");
const urlRoute = require("./routers/url");
const staticRoute = require("./routers/staticrouter");
const Url = require("./models/url");

const app = express();
const port = 8001;

connect("mongodb://127.0.0.1:27017/ShortURL")
    .then(() => console.log("MongoDB Connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRoute);
app.use("/url", urlRoute);

app.get("/:shortID", async (req, res) => {
    const shortid = req.params.shortID;

    const entry = await Url.findOneAndUpdate(
        { shortId: shortid },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectUrl);
});

app.listen(port, () => {
    console.log(`Server Started !! at Port ${port}`);
});