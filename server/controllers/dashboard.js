const Order = require('../Models/order');
const User = require('../Models/User');

module.exports.getDashboardSummary = async (req, res) => {
    try {
        const { filterType, date, month, year } = req.query;
        let startDate, endDate;

        const now = new Date();

        // Validate query parameters
        if (filterType === "daily") {
            if (!date) return res.status(400).json({ message: "Date is required for daily filtering." });
            startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
        } 
        else if (filterType === "monthly") {
            if (!year || !month) return res.status(400).json({ message: "Year and month are required for monthly filtering." });

            const adjustedMonth = parseInt(month) - 1; // Convert 1-based month to 0-based for JavaScript
            startDate = new Date(year, adjustedMonth, 1, 0, 0, 0, 0); 
            endDate = new Date(year, adjustedMonth + 1, 0, 23, 59, 59, 999); // Last day of the month
        } 
        else if (filterType === "yearly") {
            if (!year) return res.status(400).json({ message: "Year is required for yearly filtering." });
            startDate = new Date(year, 0, 1, 0, 0, 0, 0); 
            endDate = new Date(year, 11, 31, 23, 59, 59, 999); // Last day of the year
        } 
        else {
            return res.status(400).json({ message: "Invalid filter type. Use daily, monthly, or yearly." });
        }

        console.log(`Filtering orders from ${startDate} to ${endDate}`); // ✅ Debugging log

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
            // ✅ Total Sales
            Order.aggregate([
                { $match: { status: "Completed", orderedOn: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]).catch(err => {
                console.error("Error in Total Sales:", err);
                return [];
            }),

            // ✅ Total Orders
            Order.countDocuments({ orderedOn: { $gte: startDate, $lte: endDate } }).catch(err => {
                console.error("Error in Total Orders:", err);
                return 0;
            }),

            // ✅ Total Customers
            User.countDocuments({ _id: { $in: await Order.distinct("userId", { orderedOn: { $gte: startDate, $lte: endDate } }) } })
                .catch(err => {
                    console.error("Error in Total Customers:", err);
                    return 0;
                }),

            // ✅ Order Summary (Processing, Completed, Canceled)
            Order.aggregate([
                { $match: { orderedOn: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]).catch(err => {
                console.error("Error in Order Summary:", err);
                return [];
            }),

            // ✅ Best Sellers
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
            ]).catch(err => {
                console.error("Error in Best Sellers:", err);
                return [];
            })
        ]);

        // ✅ Send Response
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
