const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const validateProduct = (product) =>
  product.productName && product.price && product.color && product.size;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDB();
    console.log("📌 DB connection test ->", db.namespace || "Connected");

    const products = await db.collection('products').find().toArray();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error inside getAll:", err);
    res.status(500).json({ error: 'Failed obtaining products' });
  }
};


const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid product ID' });

    const product = await mongodb.getDB().collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed obtaining product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (!validateProduct(product)) return res.status(400).json({ error: 'Missing product data' });

    const response = await mongodb.getDB().collection('products').insertOne(product);
    res.status(201).json({ success: true, id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid product ID' });

    const product = req.body;
    if (!validateProduct(product)) return res.status(400).json({ error: 'Missing product data' });

    const response = await mongodb.getDB().collection('products').replaceOne({ _id: new ObjectId(req.params.id) }, product);
    if (response.modifiedCount === 0) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid product ID' });

    const response = await mongodb.getDB().collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.deletedCount === 0) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

module.exports = { getAll, getSingle, createProduct, updateProduct, deleteProduct };
