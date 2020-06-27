const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../contacts");

router.get("/api/contacts", async (req, res) => {
  const contacts = await listContacts();

  return res.status(200).send(contacts);
});

router.get("/api/contacts/:contactId", async (req, res) => {
  const id = parseInt(req.params.contactId);

  const contactWithId = await getContactById(id);

  if (!contactWithId) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send(contactWithId);
});

router.post("/api/contacts", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send({ message: "missing required name field" });
  }

  const contact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  const result = await addContact(contact);

  return res.status(201).send(result);
});

router.delete("/api/contacts/:contactId", async (req, res) => {
  const id = parseInt(req.params.contactId);

  const contact = await removeContact(id);

  if (!contact) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ message: "contact deleted" });
});

router.patch("/api/contacts/:contactId", async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({ message: "missing fields" });
  }

  const id = parseInt(req.params.contactId);

  const contact = await updateContact(id, req.body);

  if (!contact) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send(contact);
});

module.exports = router;
