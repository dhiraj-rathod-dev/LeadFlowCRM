const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
};

const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateLead = [
  body('name').trim().notEmpty().withMessage('Lead name is required').isLength({ max: 200 }),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('status').optional().isIn(['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost', 'archived']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('source').optional().isIn(['website', 'referral', 'social_media', 'advertisement', 'cold_call', 'email', 'other']),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  handleValidationErrors
];

const validateNote = [
  body('leadId').notEmpty().withMessage('Lead ID is required').isMongoId().withMessage('Invalid Lead ID'),
  body('message').trim().notEmpty().withMessage('Note message is required'),
  handleValidationErrors
];

const validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'member']),
  handleValidationErrors
];

module.exports = { validateRegistration, validateLogin, validateLead, validateNote, validateUser, handleValidationErrors };
