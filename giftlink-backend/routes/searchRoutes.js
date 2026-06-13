const express = require('express');
const { connectToDatabase } = require('../models/db');

const router = express.Router();

// GET /api/search?name=&category=&condition=&age=
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    const { name, category, condition, age } = req.query;
    const query = {};

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { title: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (condition) {
      query.condition = { $regex: condition, $options: 'i' };
    }

    if (age) {
      const numericAge = Number(age);
      query.age = Number.isNaN(numericAge) ? age : numericAge;
    }

    const gifts = await collection.find(query).toArray();
    res.status(200).json(gifts);
  } catch (error) {
    console.error('Error searching gifts:', error);
    res.status(500).json({ message: 'Error searching gifts' });
  }
});

module.exports = router;
