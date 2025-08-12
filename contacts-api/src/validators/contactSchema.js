const { z } = require('zod');

const contactBaseSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('invalid email'),
  phone: z.string().min(3).optional(),
  address: z.string().optional(),
});

const createContactSchema = contactBaseSchema;
const updateContactSchema = contactBaseSchema;
const patchContactSchema = contactBaseSchema.partial();

function buildValidator(schema) {
  return function validator(req, res, next) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    req.validatedBody = parsed.data;
    next();
  };
}

const validateCreateContact = buildValidator(createContactSchema);
const validateUpdateContact = buildValidator(updateContactSchema);
const validatePatchContact = buildValidator(patchContactSchema);

module.exports = {
  validateCreateContact,
  validateUpdateContact,
  validatePatchContact,
};