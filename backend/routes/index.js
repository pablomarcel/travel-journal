const { Router } = require("express");
const router = Router();

router.use("/api/users", require("./users"));
router.use("/api/posts", require("./posts"));
router.use("/api/favoriteposts", require("./favoriteposts"));
router.use("/api/comments", require("./comments"));

module.exports = router;