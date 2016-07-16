"use strict";
let firebase = require("./firebaseConfig"),
    provider = new firebase.auth.GoogleAuthProvider();

function logInGoogle() {
  return firebase.auth().signInWithPopup(provider);
}

module.exports = logInGoogle;