const fs = require('fs/promises');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', '..', 'data', 'contacts.json');

async function ensureDataFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, '[]', 'utf8');
  }
}

async function readAllContacts() {
  await ensureDataFileExists();
  const raw = await fs.readFile(dataFilePath, 'utf8');
  const parsed = JSON.parse(raw || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAllContacts(contacts) {
  await fs.writeFile(dataFilePath, JSON.stringify(contacts, null, 2), 'utf8');
}

async function getAllContacts() {
  return readAllContacts();
}

async function getContactById(id) {
  const contacts = await readAllContacts();
  return contacts.find((c) => c.id === id) || null;
}

async function createContact(contact) {
  const contacts = await readAllContacts();
  contacts.push(contact);
  await writeAllContacts(contacts);
  return contact;
}

async function updateContact(id, contactData) {
  const contacts = await readAllContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const updated = { id, ...contactData };
  contacts[index] = updated;
  await writeAllContacts(contacts);
  return updated;
}

async function patchContact(id, partialData) {
  const contacts = await readAllContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const updated = { ...contacts[index], ...partialData, id };
  contacts[index] = updated;
  await writeAllContacts(contacts);
  return updated;
}

async function removeContact(id) {
  const contacts = await readAllContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return false;
  contacts.splice(index, 1);
  await writeAllContacts(contacts);
  return true;
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  patchContact,
  removeContact,
};