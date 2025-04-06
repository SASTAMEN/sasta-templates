const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (read-only)
router.get('/', componentController.getAll);
router.get('/category/:category', componentController.getByCategory);
router.get('/:id', componentController.getById);

// Protected routes (require admin authentication)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, componentController.create);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, componentController.update);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, componentController.delete);

module.exports = router; 