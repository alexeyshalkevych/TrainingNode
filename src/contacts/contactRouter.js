const express = require("express");
const contactsRouter = express.Router();

contactsRouter.get("/contacts");
contactsRouter.get("/contacts/:contactId");
contactsRouter.post("/contacts");
contactsRouter.patch("/contacts/:contactId");
contactsRouter.delete("/contacts/:contactId");

module.exports = contactsRouter;
