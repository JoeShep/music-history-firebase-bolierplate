"use strict";

let firebase = require("./firebaseConfig"), // "./"" if in same folder,  "../"" if in outer
    currentUser = null;

function getUser(){
  return currentUser;
}

function setUser(user){
  currentUser = user;
}

module.exports = {getUser, setUser};