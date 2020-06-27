const { promises } = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const data = await promises.readFile(contactsPath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  if (!contactId) return;

  try {
    const data = await promises.readFile(contactsPath, "utf-8");
    const contactWithId = searchContactWithId(contactId, data);

    return contactWithId;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  if (!contactId) return;

  try {
    const data = await promises.readFile(contactsPath, "utf-8");
    const contactWithId = searchContactWithId(contactId, data);
    const newContacts = filteredContacts(data, contactId);

    if (contactWithId) {
      await promises.writeFile(contactsPath, JSON.stringify(newContacts));
    }

    return contactWithId;
  } catch (error) {
    console.log(error);
  }
}

async function updateContact(contactId, body) {
  if (!contactId || !body) return;

  try {
    const data = await promises.readFile(contactsPath, "utf-8");
    const contactWithId = searchContactWithId(contactId, data);

    if (!contactWithId) return null;

    const newContacts = updateContacts(data, contactId, body);

    await promises.writeFile(contactsPath, JSON.stringify(newContacts));

    const newData = await promises.readFile(contactsPath, "utf-8");
    const updateContactWithId = searchContactWithId(contactId, newData);

    return updateContactWithId;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(contact) {
  if (!contact) return;

  try {
    const data = await promises.readFile(contactsPath, "utf-8");
    const dataWithNewContact = [...JSON.parse(data), contact];

    await promises.writeFile(contactsPath, JSON.stringify(dataWithNewContact));

    const newData = await promises.readFile(contactsPath, "utf-8");

    return findContact(newData, contact.id);
  } catch (error) {
    console.log(error);
  }
}

function updateContacts(contacts, contactId, body) {
  return JSON.parse(contacts).map((contact) =>
    contact.id === contactId ? { ...contact, ...body } : contact
  );
}

function searchContactWithId(contactId, data) {
  const contactWithId = findContact(data, contactId);

  if (!contactWithId) {
    console.log(`Contact with id ${contactId} not found`);
    return;
  }

  return contactWithId;
}

function findContact(contacts, contactId) {
  return JSON.parse(contacts).find((contact) => contact.id === contactId);
}

function filteredContacts(contacts, contactId) {
  return JSON.parse(contacts).filter((contact) => contact.id !== contactId);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
