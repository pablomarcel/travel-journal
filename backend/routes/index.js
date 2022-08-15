const { Router } = require("express");
const router = Router();

router.use("/api/users", require("./users"));
router.use("/api/posts", require("./posts"));

// router.use("/", (req, res) => res.status(404).send("Route not found. Maybe you meant /movies"))
// router.use("/weather", require("./weather"));

module.exports = router;