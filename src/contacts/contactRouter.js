const express = require("express");
const contactsRouter = express.Router();
const {
  getContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} = require("./contactController");

contactsRouter.get("/contacts", getContacts);
contactsRouter.get("/contacts/:contactId", getContactById);
contactsRouter.post("/contacts", createContact);
contactsRouter.patch("/contacts/:contactId", updateContactById);
contactsRouter.delete("/contacts/:contactId", deleteContactById);

module.exports = contactsRouter;
