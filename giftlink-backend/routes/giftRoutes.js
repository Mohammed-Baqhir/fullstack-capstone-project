const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../models/db');

const router = express.Router();

// GET /api/gifts - fetch all gifts
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const gifts = await collection.find({}).toArray();
    res.status(200).json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({ message: 'Error fetching gifts' });
  }
});

// GET /api/gifts/:id - fetch gift by MongoDB ObjectId or custom id field
router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');
    const { id } = req.params;

    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id };
    }

    const gift = await collection.findOne(query);

    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }

    res.status(200).json(gift);
  } catch (error) {
    console.error('Error fetching gift:', error);
    res.status(500).json({ message: 'Error fetching gift' });
  }
});

module.exports = router;
