const router = require("express").Router();
const User = require("../models/user.model");
// dashboard route
router.get("/", async(req, res) => {
    // let user = await User.findById(req.user.id, "-password")
    res.json({
        error: null,
        data: {
            title: "My dashboard",
            content: "dashboard content",

        },
    });
});

module.exports = router;
