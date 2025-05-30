const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const linkRoutes = require('./linkRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);
router.use('/users', userRoutes); 

module.exports = router;
