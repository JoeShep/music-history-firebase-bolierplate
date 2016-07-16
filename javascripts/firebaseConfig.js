"use strict";

let firebase = require("firebase/app"),
    fb = require("./fb-getter"),
    fbData = fb();

require("firebase/auth");
require("firebase/database");

var config = {
  apiKey: fbData.key,
  databaseURL: fbData.url,
  authDomain: fbData.authUrl,
  storageBucket: fbData.bucketUrl
};

firebase.initializeApp(config);

module.exports = firebase;