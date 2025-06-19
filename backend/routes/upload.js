const express = require('express');
const router = express.Router();
const { showUpload, handleUpload } = require('../controllers/uploadController');

router.get('/', showUpload);
router.post('/', handleUpload);

module.exports = router;
