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

    await promises.writeFile(contactsPath, JSON.stringify(newContacts));

    return contactWithId;
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
};
