const { Router } = require("express");
const router = Router();

router.use("/api/users", require("./users"));
router.use("/api/posts", require("./posts"));
router.use("/api/myFavoritePosts", require("./myFavoritePosts"));

module.exports = router;