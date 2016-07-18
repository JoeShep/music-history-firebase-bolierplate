"use strict";
let firebase = require("firebase/app");
let currentUser = {
  user: null
};

currentUser.getUser = function() {
  return currentUser.user;
};

currentUser.setUser = function(user) {
  currentUser.user = user;
};

currentUser.checkUser = function() {
  return firebase.auth().currentUser;
};

currentUser.logOut = function() {
  firebase.auth().signOut().then(function() {
    console.log("logged out");
  }, function(error) {
    console.log("failed to log out");
  });
}

module.exports = currentUser;