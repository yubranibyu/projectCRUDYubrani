const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');

const { IsAuthenticated } = require('../middleware/authenticate'); 

router.get('/', productsController.getAll);
router.get('/:id', productsController.getSingle);

    
router.post('/', IsAuthenticated, productsController.createProduct);
router.put('/:id', IsAuthenticated, productsController.updateProduct);
router.delete('/:id', IsAuthenticated, productsController.deleteProduct);

module.exports = router;
