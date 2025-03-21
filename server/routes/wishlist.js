const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist");
const { verify, verifyUser } = require("../middlewares/auth");

// 📌 Get user's wishlist
router.get("/", verify, verifyUser, wishlistController.getWishlist);

// 📌 Add product to wishlist
router.post("/:productId", verify, verifyUser, wishlistController.addToWishlist);

// 📌 Remove product from wishlist
router.delete("/:productId", verify, verifyUser, wishlistController.removeFromWishlist);

// 📌 Check if a product is in the wishlist
router.get("/:productId", verify, verifyUser, wishlistController.isProductInWishlist);

module.exports = router;
