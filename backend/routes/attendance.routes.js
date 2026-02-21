const express = require('express');
const { checkIn, checkOut, startBreak, endBreak, getAttendance } = require('../controllers/attendance.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/checkin', authenticate, checkIn);
router.post('/checkout', authenticate, checkOut);
router.post('/break/start', authenticate, startBreak);
router.post('/break/end', authenticate, endBreak);
router.get('/records', authenticate, getAttendance);

module.exports = router;
