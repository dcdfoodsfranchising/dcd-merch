const mongoose = require("mongoose");
const Order = require("../Models/Order");
const User = require("../Models/User");

module.exports.getDashboardSummary = async (req, res) => {
    try {
        const { filterType } = req.query; // Get filter type from query parameter (daily, weekly, monthly, etc.)
        let startDate, endDate;

        // Get start and end date based on filterType
        const now = new Date();
        if (filterType === "daily") {
            startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
            endDate = new Date(now.setHours(23, 59, 59, 999)); // End of today
        } else if (filterType === "weekly") {
            const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of week (Sunday)
            startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
            endDate = new Date(now.setDate(startDate.getDate() + 6)); // End of week
        } else if (filterType === "monthly") {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of month
        } else if (filterType === "quarterly") {
            const quarter = Math.floor(now.getMonth() / 3); // Get current quarter
            startDate = new Date(now.getFullYear(), quarter * 3, 1); // Start of quarter
            endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0); // End of quarter
        } else if (filterType === "yearly") {
            startDate = new Date(now.getFullYear(), 0, 1); // Start of year
            endDate = new Date(now.getFullYear(), 11, 31); // End of year
        } else {
            return res.status(400).json({ message: "Invalid filter type. Use daily, weekly, monthly, quarterly, or yearly." });
        }

        // Convert dates to ISO format for MongoDB queries
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        // Queries using date filtering
        const [
            totalSalesResult,
            totalOrders,
            totalCustomers,
            orderSummary,
            bestSellers
        ] = await Promise.all([
            // Total Sales for the selected period
            Order.aggregate([
                { $match: { status: "Completed", orderedOn: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]).catch(err => console.error("Error in Total Sales:", err) || []),

            // Total Orders for the selected period
            Order.countDocuments({ orderedOn: { $gte: startDate, $lte: endDate } }).catch(err => console.error("Error in Total Orders:", err) || 0),

            // Total Customers who placed orders in the selected period
            User.countDocuments({ _id: { $in: await Order.distinct("userId", { orderedOn: { $gte: startDate, $lte: endDate } }) } })
                .catch(err => console.error("Error in Total Customers:", err) || 0),

            // Order Summary (Processing, Completed, Canceled) for the selected period
            Order.aggregate([
                { $match: { orderedOn: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]).catch(err => console.error("Error in Order Summary:", err) || []),

            // Best Sellers based on orders in the selected period
            Order.aggregate([
                { $match: { orderedOn: { $gte: startDate, $lte: endDate } } },
                { $unwind: "$productsOrdered" },
                {
                    $group: {
                        _id: "$productsOrdered.productId",
                        totalQuantitySold: { $sum: "$productsOrdered.quantity" },
                        totalRevenue: { $sum: "$productsOrdered.subtotal" }
                    }
                },
                { $sort: { totalQuantitySold: -1 } },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                { $unwind: "$productDetails" },
                {
                    $project: {
                        name: "$productDetails.name",
                        totalQuantitySold: 1,
                        totalRevenue: 1
                    }
                }
            ]).catch(err => console.error("Error in Best Sellers:", err) || [])
        ]);

        // Prepare response, ensuring undefined values are set to defaults
        res.status(200).json({
            filterType,
            dateRange: { startDate, endDate },
            totalSales: totalSalesResult[0]?.total || 0,
            totalOrders: totalOrders || 0,
            totalCustomers: totalCustomers || 0,
            orderSummary: orderSummary || [],
            bestSellers: bestSellers || []
        });

    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
