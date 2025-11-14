const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //  #swagger.tags=['Users']
  try {
    const db = mongodb.getDB();
    const users = await db.collection('users').find().toArray();

    res.status(200).json(users);
  } catch (err) {
    console.error('Failed obtaining users:', err);
    res.status(500).json({ error: 'Failed obtaining users' });
  }
};

const getSingle = async (req, res) => {
  //  #swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const db = mongodb.getDB();
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Failed obtaining user:', err);
    res.status(500).json({ error: 'Failed obtaining user' });
  }
};

const createUser = async (req, res) => {
  //  #swagger.tags=['Users']
  
  const user = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDB().collection('users').insertOne(user);
  if(response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
}
const updateUser = async (req, res) => {
  //  #swagger.tags=['Users']
  const userId = new ObjectId(req.params.id);
  const user = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDB().collection('users').replaceOne({ _id: userId }, user);
  if(response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};

const deleteUser = async (req, res) => {
  //  #swagger.tags=['Users']
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDB().collection('users').deleteOne({ _id: userId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
