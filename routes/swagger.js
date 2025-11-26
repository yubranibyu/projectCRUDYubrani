const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const { IsAuthenticated } = require('../middleware/authenticate');
router.use('/api-docs', IsAuthenticated);

module.exports = router;

