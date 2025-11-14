const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //  #swagger.tags=['Products']
  try {
    const db = mongodb.getDB();
    const products = await db.collection('products').find().toArray();

    res.status(200).json(products);
  } catch (err) {
    console.error('Failed obtaining products:', err);
    res.status(500).json({ error: 'Failed obtaining products' });
  }
};

const getSingle = async (req, res) => {
  //  #swagger.tags=['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const db = mongodb.getDB();
    const product = await db.collection('products').findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Failed obtaining product:', err);
    res.status(500).json({ error: 'Failed obtaining product' });
  }
};

const createProduct = async (req, res) => {
  //  #swagger.tags=['Products']

  const product = {
    productName: req.body.productName,
    price: req.body.price,
    color: req.body.color,
    size: req.body.size,
  };
  const response = await mongodb.getDB().collection('products').insertOne(product);
  if(response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the product.');
  }
}
const updateProduct = async (req, res) => {
  //  #swagger.tags=['Products']
  const productId = new ObjectId(req.params.id);
  const product = {
    productName: req.body.productName,
    price: req.body.price,
    color: req.body.color,
    size: req.body.size,
  };
  const response = await mongodb.getDB().collection('products').replaceOne({ _id: productId }, product);
  if(response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the product.');
  }
};

const deleteProduct = async (req, res) => {
  //  #swagger.tags=['Products']
  const productId = new ObjectId(req.params.id);
  const response = await mongodb.getDB().collection('products').deleteOne({ _id: productId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the product.');
  }
};
module.exports = {
  getAll,
  getSingle,    
  createProduct,
  updateProduct,
  deleteProduct
};