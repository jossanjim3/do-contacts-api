'use strict'

var db = require('../db');

module.exports.getContacts = function getContacts(req, res, next) {
  console.info("New GET request to /contacts");
  db.find({}, function (err, contacts) {
    if (err) {
      console.error('Error getting data from DB');
      res.sendStatus(500); // internal server error
    } else {
      console.info("Sending contacts: " + JSON.stringify(contacts, 2, null));
      res.send(contacts);
    }
  });
};

module.exports.addContact = function addContact(req, res, next) {
  var newContact = req.contact.value;
  if (!newContact) {
    console.warn("New POST request to /contacts/ without contact, sending 400...");
    res.sendStatus(400); // bad request
  } else {
    console.info("New POST request to /contacts with body: " + JSON.stringify(newContact, 2, null));
    if (!newContact.name || !newContact.phone || !newContact.email) {
      console.warn("The contact " + JSON.stringify(newContact, 2, null) + " is not well-formed, sending 422...");
      res.sendStatus(422); // unprocessable entity
    } else {
      db.find({ "name": newContact.name }, function (err, contacts) {
        if (err) {
          console.error('Error getting data from DB');
          res.sendStatus(500); // internal server error
        } else {
          if (contacts.length > 0) {
            console.warn("The contact " + JSON.stringify(newContact, 2, null) + " already extis, sending 409...");
            res.sendStatus(409); // conflict
          } else {
            console.info("Adding contact " + JSON.stringify(newContact, 2, null));
            db.insert(newContact);
            res.sendStatus(201); // created
          }
        }
      });
    }
  }
};