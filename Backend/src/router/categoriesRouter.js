const express = require('express');
const categoriesController = require('../controller/categoriesController');

const router = express.Router();

router.get('/:userId', categoriesController.getUserCategories);
router.post('/:userId', categoriesController.addUserCategory);

module.exports = router;