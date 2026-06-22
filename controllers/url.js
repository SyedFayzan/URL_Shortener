const shortID = require("shortid");
const Url = require("../models/url");

async function handleGenerateShortUrl(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).send("URL is required");
    }

    const shortid = shortID.generate();

    await Url.create({
        shortId: shortid,
        redirectUrl: body.url,
        visitHistory: [],
    });

const allUrls = await Url.find({});

return res.render("script", {
    urls: allUrls,
    id: shortid,
});}

async function handleAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await Url.findOne({
        shortId,
    });

    if (!result) {
        return res.status(404).json({
            error: "URL not found",
        });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateShortUrl,
    handleAnalytics,
};