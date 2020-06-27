const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
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

module.exports = router;
