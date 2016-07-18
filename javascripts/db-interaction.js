"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./firebaseConfig"),
    fb = require("./fb-getter"),
    fbData = fb();

// ****************************************
// DB interaction using Firebase SDK        // Proprietary to FIREBASE!
// ****************************************

function getSongs(callback, userId) {
  console.log("userId", userId );
  let songs = firebase.database().ref("songs");
  songs.orderByChild("uid").equalTo(userId).on("value", function(songData){
    console.log("Sumthin happen");
    callback(songData.val());
  });
}

function addSong(newSong) {
  return firebase.database().ref("songs").push(newSong); //push here is returning promise
}

// remove once update
function deleteSong(songId) {
  console.log("Remove succeeded.");
  return firebase.database().ref(`songs/${songId}`).remove();
}

function getSong(songId) {
  return firebase.database().ref(`songs/${songId}`).once('value');
}

function editSong(songFormObj, songId) {
  return firebase.database().ref(`songs/${songId}`).update(songFormObj);
}

module.exports = {
  getSongs,
  addSong,
  getSong,
  deleteSong,
  editSong
};






// // ****************************************
// // DB interaction using Firebase REST API
// // ****************************************

// function getSongs() {
//   return new Promise(function(resolve, reject){
//     $.ajax({
//       url: "https://musichistory-803d5.firebaseio.com/.json" 
//       // or use - "let fb = require("./fb-getter");"  //from above (lines 7,8)
//         // WITH - "   fbData = fb();",    //along with the following line
//       // url: `${fbData.url}/.json`    //can do url: `${fbData.url}/songs/.json`  later on...
//     }).done(function(songData){
//       resolve(songData);
//     });
//   });
// }

// function addSong(songFormObj) {
//   return new Promise(function(resolve, reject){
//     $.ajax({
//       url: "https://musichistory-803d5.firebaseio.com/songs.json",
//       type: "POST",
//       data: JSON.stringify(songFormObj),
//       dataType: "json"
//     }).done(function(songId){
//       resolve(songId);
//     });
//   });
// }

// function deleteSong(songId) {
//   return new Promise(function(resolve, reject){
//     $.ajax({
//       url: `https://musichistory-803d5.firebaseio.com/songs/${songId}.json`,
//       type: "DELETE"
//     }).done(function(){
//       resolve();
//     });
//   });
// }

// function getSong(songId) {
//   return new Promise(function(resolve, reject){
//     $.ajax({
//       url: `https://musichistory-803d5.firebaseio.com/songs/${songId}.json`
//     }).done(function(songData){
//       resolve(songData);
//     });
//   });
// }

// function editSong(songFormObj, songId) {
//   return new Promise(function(resolve, reject){
//     $.ajax({
//       url: `https://musichistory-803d5.firebaseio.com/songs/${songId}.json`,
//       type: "PUT",
//       data: JSON.stringify(songFormObj)
//     }).done(function(data){
//       resolve(data);
//     });
//   });
// }

// module.exports = {
//   getSongs,
//   addSong,
//   getSong,
//   deleteSong,
//   editSong
// };

