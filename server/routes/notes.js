const router = require('express').Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const { validateNote } = require('../validators');

router.use(protect);
router.get('/', getNotes);
router.post('/', validateNote, createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
