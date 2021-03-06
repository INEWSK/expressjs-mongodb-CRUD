var express = require("express");
var router = express.Router();
var itemController = require("../controllers/items");

const imgService = require("../config/multer");
const upload = imgService.upload;

// list all inventory
router.get("/index", itemController.list);

router.get("/details/:id", itemController.details);

// insert data
router.get("/create", (req, res) => {
  res.render("create", { currentUser: req.session.user });
});

router.post("/create", upload.single("image"), itemController.insert);

// show text field data
router.get("/edit/:id", itemController.edit);

// edit and update data
router.post("/update/:id", upload.single("image"), itemController.update);

// delete data
router.get("/delete/:id", itemController.delete);

// show coords marker on map
router.get("/map/", itemController.map);

// TODO: filter item with the item name and show in JSON format
router.get("/api/inventory/name/:name", itemController.search);

// TODO: filter item with item type
router.get("/api/inventory/type/:type", itemController.search);

module.exports = router;
