// routes/linkRoutes.js
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', linkController.getAllLinks);
router.post('/', authMiddleware, linkController.createLink);
router.post('/:id/rate', authMiddleware, linkController.rateLink);
router.post('/:id/hide', authMiddleware, linkController.hideLink);

module.exports = router;

