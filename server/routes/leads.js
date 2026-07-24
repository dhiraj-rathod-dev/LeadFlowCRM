const router = require('express').Router();
const { getLeads, getLead, createLead, updateLead, deleteLead, updateStatus, assignLead, archiveLead, pipeline } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');
const { validateLead } = require('../validators');

router.use(protect);
router.get('/pipeline', pipeline);
router.get('/', getLeads);
router.post('/', validateLead, createLead);
router.get('/:id', getLead);
router.put('/:id', validateLead, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);
router.patch('/status', updateStatus);
router.patch('/assign', authorize('admin'), assignLead);
router.patch('/:id/archive', archiveLead);

module.exports = router;
