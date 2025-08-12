const express = require('express');
const { nanoid } = require('nanoid');
const store = require('../store/contactsStore');
const {
  validateCreateContact,
  validateUpdateContact,
  validatePatchContact,
} = require('../validators/contactSchema');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await store.getAllContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const contact = await store.getContactById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateCreateContact, async (req, res, next) => {
  try {
    const id = nanoid();
    const created = await store.createContact({ id, ...req.validatedBody });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateUpdateContact, async (req, res, next) => {
  try {
    const updated = await store.updateContact(req.params.id, req.validatedBody);
    if (!updated) return res.status(404).json({ error: 'Contact not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validatePatchContact, async (req, res, next) => {
  try {
    const updated = await store.patchContact(req.params.id, req.validatedBody);
    if (!updated) return res.status(404).json({ error: 'Contact not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const removed = await store.removeContact(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Contact not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;