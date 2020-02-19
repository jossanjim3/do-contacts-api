'use strict'

var varapiv1contactsnameController = require('./apiv1contactsnameControllerService');

module.exports.findContactByname = function findContactByname(req, res, next) {
  varapiv1contactsnameController.findContactByname(req.swagger.params, res, next);
};

module.exports.deleteContact = function deleteContact(req, res, next) {
  varapiv1contactsnameController.deleteContact(req.swagger.params, res, next);
};

module.exports.updateContact = function updateContact(req, res, next) {
  varapiv1contactsnameController.updateContact(req.swagger.params, res, next);
};