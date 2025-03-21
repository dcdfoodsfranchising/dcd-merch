const User = require("../Models/User");
const Product = require("../Models/Product");

module.exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.productId);

        if (!product) return res.status(404).json({ error: "Product not found" });

        if (!user.wishlist.includes(req.params.productId)) {
            user.wishlist.push(req.params.productId);
            await user.save();
        }

        res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
        await user.save();

        res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.isProductInWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const isInWishlist = user.wishlist.includes(req.params.productId);

        res.status(200).json({ isInWishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
