'use strict'

var varapiv1contactsController = require('./apiv1contactsControllerService');

module.exports.getContacts = function getContacts(req, res, next) {
  varapiv1contactsController.getContacts(req.swagger.params, res, next);
};

module.exports.addContact = function addContact(req, res, next) {
  varapiv1contactsController.addContact(req.swagger.params, res, next);
};