const express = require("express");
const router = express.Router();

const Url = require("../models/url");
const shortid = require("shortid");

router.get("/", async (req, res) => {
    const allUrls = await Url.find({});

    return res.render("script", {
        urls: allUrls,
        id:shortid,
    });
});

module.exports = router;