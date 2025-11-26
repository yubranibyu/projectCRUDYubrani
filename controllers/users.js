const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const validateUser = (user) =>
  user.FirstName && user.LastName && user.email && user.favoriteColor && user.birthday;

const getAll = async (req, res) => {
  try {
    const users = await mongodb.getDB().collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed obtaining users' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid user ID' });

    const user = await mongodb.getDB().collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed obtaining user' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = req.body;
    if (!validateUser(user)) return res.status(400).json({ error: 'Missing user data' });

    const response = await mongodb.getDB().collection('users').insertOne(user);
    res.status(201).json({ success: true, id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid user ID' });

    const user = req.body;
    if (!validateUser(user)) return res.status(400).json({ error: 'Missing user data' });

    const response = await mongodb.getDB().collection('users').replaceOne({ _id: new ObjectId(req.params.id) }, user);
    if (response.modifiedCount === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid user ID' });

    const response = await mongodb.getDB().collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.deletedCount === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };
