const express = require('express');
const router = express.Router();
const {
  getDraws,
  getDraw,
  createDraw,
  updateDraw,
  deleteDraw,
  joinDraw,
  getEntries,
  conductDraw,
  getMyEntries
} = require('../controllers/drawController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-entries', protect, getMyEntries);

router.route('/')
  .get(protect, getDraws)
  .post(protect, authorize('admin'), createDraw);

router.route('/:id')
  .get(protect, getDraw)
  .put(protect, authorize('admin'), updateDraw)
  .delete(protect, authorize('admin'), deleteDraw);

router.post('/:id/join', protect, joinDraw);
router.get('/:id/entries', protect, getEntries);
router.post('/:id/conduct', protect, authorize('admin'), conductDraw);

module.exports = router;