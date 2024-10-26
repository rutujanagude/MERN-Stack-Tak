const express = require('express');
const Product = require('../models/Product');
const axios = require('axios');
const router = express.Router();

// Seed Data API
router.get('/seed-data', async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Product.insertMany(data);
        res.status(200).json({ message: "Database initialized" });
    } catch (err) {
        console.error('Error seeding data:', err.message);
        res.status(500).json({ message: "Error seeding data", error: err.message });
    }
});

// Transactions API with search and pagination
router.get('/transactions', async (req, res) => {
    const { month, page = 1, perPage = 10, search = '' } = req.query;
    const query = {
        dateOfSale: { $regex: month, $options: 'i' },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };
    try {
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err.message);
        res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
});

// Statistics API
router.get('/statistics', async (req, res) => {
    const { month } = req.query;
    try {
        const soldItems = await Product.countDocuments({ dateOfSale: { $regex: month, $options: 'i' }, sold: true });
        const unsoldItems = await Product.countDocuments({ dateOfSale: { $regex: month, $options: 'i' }, sold: false });
        const totalSaleAmount = await Product.aggregate([
            { $match: { dateOfSale: { $regex: month, $options: 'i' }, sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            soldItems,
            unsoldItems
        });
    } catch (err) {
        console.error('Error fetching statistics:', err.message);
        res.status(500).json({ message: "Error fetching statistics", error: err.message });
    }
});

// Bar Chart API
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const priceRanges = [
        [0, 100], [101, 200], [201, 300], [301, 400],
        [401, 500], [501, 600], [601, 700], [701, 800],
        [801, 900], [901, Infinity]
    ];
    try {
        const priceRangeCounts = await Promise.all(priceRanges.map(async ([min, max]) => {
            const count = await Product.countDocuments({ dateOfSale: { $regex: month, $options: 'i' }, price: { $gte: min, $lt: max } });
            return { range: `${min}-${max}`, count };
        }));
        res.status(200).json(priceRangeCounts);
    } catch (err) {
        console.error('Error fetching bar chart data:', err.message);
        res.status(500).json({ message: "Error fetching bar chart data", error: err.message });
    }
});

// Pie Chart API
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    try {
        const categoryCounts = await Product.aggregate([
            { $match: { dateOfSale: { $regex: month, $options: 'i' } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.status(200).json(categoryCounts);
    } catch (err) {
        console.error('Error fetching pie chart data:', err.message);
        res.status(500).json({ message: "Error fetching pie chart data", error: err.message });
    }
});

// Combined API with detailed error logging
router.get('/api/combined', async (req, res) => {
    const { month } = req.query;
    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:5000/api/transactions`, { params: { month } }),
            axios.get(`http://localhost:5000/api/statistics`, { params: { month } }),
            axios.get(`http://localhost:5000/api/bar-chart`, { params: { month } }),
            axios.get(`http://localhost:5000/api/pie-chart`, { params: { month } })
        ]);
        res.status(200).json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data,
        });
    } catch (err) {
        console.error('Error in /api/combined:', err.message);  // Log error details
        res.status(500).json({ message: "Error fetching combined data", error: err.message });
    }
});

module.exports = router;
