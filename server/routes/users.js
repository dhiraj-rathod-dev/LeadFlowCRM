const router = require('express').Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, updateProfile, changePassword } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateUser } = require('../validators');

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.post('/', authorize('admin'), validateUser, createUser);
router.get('/profile', (req, res) => { res.json({ user: req.user }); });
router.put('/profile', updateProfile);
router.put('/profile/password', changePassword);
router.get('/:id', getUser);
router.put('/:id', authorize('admin'), validateUser, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
