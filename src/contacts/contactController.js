const contactModel = require("./contactModel");

const getContacts = async (req, res, next) => {
  try {
    const { page, limit, sub } = req.query;

    if (page && limit) {
      const options = {
        page,
        limit,
      };

      const contacts = await contactModel.paginate({}, options);

      return res.status(200).json(contacts.docs);
    }

    if (sub) {
      const options = {
        subscription: sub,
      };

      const contacts = await contactModel.find(options);

      return res.status(200).json(contacts);
    }

    const contacts = await contactModel.find({});

    return res.status(200).json(contacts);
  } catch (error) {
    return next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    const contact = await contactModel.findById(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found!" });
    }

    return res.status(200).json(contact);
  } catch (error) {
    return next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const newContact = await contactModel.create(req.body);

    return res.status(201).json(newContact);
  } catch (error) {
    return next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    const contactToUpdate = await contactModel.findByIdAndUpdate(
      contactId,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!contactToUpdate) {
      return res.status(404).send({ message: "Contact not found!" });
    }

    return res.status(200).json(contactToUpdate);
  } catch (error) {
    return next(error);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    const contactToDelete = await contactModel.findByIdAndDelete(contactId);

    if (!contactToDelete) {
      return res.status(404).send({ message: "Contact not found!" });
    }

    return res.status(200).send({ message: "Contact successfully deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
};
