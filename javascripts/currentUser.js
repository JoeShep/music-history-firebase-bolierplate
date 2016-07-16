"use strict";
let firebase = require("firebase/app");
let currentUser = {
  user: null
};


currentUser.getUser = function() {
  return currentUser.user;
};

currentUser.setUser = function() {
  currentUser.user = firebase.auth().currentUser.uid;
};

module.exports = currentUser;