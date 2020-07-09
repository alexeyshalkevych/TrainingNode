const express = require("express");
const contactsRouter = express.Router();
const {
  getContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} = require("./contactController");
const {
  contactIdValidation,
  contactCreateValidation,
  contactUpdateValidation,
} = require("../middlewares/contactMiddlewares");

contactsRouter.get("/contacts", getContacts);
contactsRouter.get("/contacts/:contactId", contactIdValidation, getContactById);
contactsRouter.post("/contacts", contactCreateValidation, createContact);
contactsRouter.patch(
  "/contacts/:contactId",
  contactIdValidation,
  contactUpdateValidation,
  updateContactById
);
contactsRouter.delete(
  "/contacts/:contactId",
  contactIdValidation,
  deleteContactById
);

module.exports = contactsRouter;
