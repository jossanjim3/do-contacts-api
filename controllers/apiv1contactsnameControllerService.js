'use strict'

var db = require('../db');

module.exports.findContactByname = function findContactByname(req, res, next) {
  var name = req.name.value;
  if (!name) {
    console.warn("New GET request to /contacts/:name without name, sending 400...");
    res.sendStatus(400); // bad request
  } else {
    console.info("New GET request to /contacts/" + name);
    db.find({ "name": name }, function (err, filteredContacts) {
      if (err) {
        console.error('Error getting data from DB');
        res.sendStatus(500); // internal server error
      } else {
        if (filteredContacts.length > 0) {
          var contact = filteredContacts[0]; //since we expect to have exactly ONE contact with this name
          console.info("Sending contact: " + JSON.stringify(contact, 2, null));
          res.send(contact);
        } else {
          console.warn("There are no contacts with name " + name);
          res.sendStatus(404); // not found
        }
      }
    });
  }
};

module.exports.deleteContact = function deleteContact(req, res, next) {
  var name = req.name.value;
  if (!name) {
    console.warn("New DELETE request to /contacts/:name without name, sending 400...");
    res.sendStatus(400); // bad request
  } else {
    console.info("New DELETE request to /contacts/" + name);
    db.remove({ "name": name }, function (err, numRemoved) {
      if (err) {
        console.error('Error removing data from DB');
        res.sendStatus(500); // internal server error
      } else {
        console.info("Contacts removed: " + numRemoved);
        if (numRemoved === 1) {
          console.info("The contact with name " + name + " has been succesfully deleted, sending 204...");
          res.sendStatus(204); // no content
        } else {
          console.warn("There are no contacts to delete");
          res.sendStatus(404); // not found
        }
      }
    });
  }
};

module.exports.updateContact = function updateContact(req, res, next) {
  var updatedContact = req.contact.value;
  var name = req.name.value;
  if (!updatedContact) {
    console.warn("New PUT request to /contacts/ without contact, sending 400...");
    res.sendStatus(400); // bad request
  } else {
    console.info("New PUT request to /contacts/" + name + " with data " + JSON.stringify(updatedContact, 2, null));
    if (!updatedContact.name || !updatedContact.phone || !updatedContact.email) {
      console.warn("The contact " + JSON.stringify(updatedContact, 2, null) + " is not well-formed, sending 422...");
      res.sendStatus(422); // unprocessable entity
    } else {
      db.find({ "name": updatedContact.name }, function (err, contacts) {
        if (err) {
          console.error('Error getting data from DB');
          res.sendStatus(500); // internal server error
        } else {
          if (contacts.length > 0) {
            db.update({ name: name }, updatedContact);
            console.info("Modifying contact with name " + name + " with data " + JSON.stringify(updatedContact, 2, null));
            res.send(updatedContact); // return the updated contact
          } else {
            console.warn("There are not any contact with name " + name);
            res.sendStatus(404); // not found
          }
        }
      });
    }
  }
};