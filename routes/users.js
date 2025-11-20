const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const {IsAuthenticated} = require('../middleware/authenticate');


router.get('/', usersController.getAll);

router.get('/:id', usersController.getSingle);

router.post('/', IsAuthenticated, usersController.createUser);

router.put('/:id', IsAuthenticated, usersController.updateUser);

router.delete('/:id', IsAuthenticated, usersController.deleteUser);
module.exports = router;