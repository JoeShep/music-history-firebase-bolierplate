"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
  firebase = require("./firebaseConfig"),
  fb = require('./fb-getter'),
  fbData = fb(),
  currentUser = require('./currentUser');

// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// function getSongs() {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `${fbData.url}/.json`
//     }).done(function(songData) {
//       resolve(songData);
//     });
//   });
// }

// function addSong(songFormObj) {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `${fbData.url}/songs.json`,
//       method: "POST",
//       data: JSON.stringify(songFormObj),
//       dataType: 'json'
//     }).done(function(songId) {
//       resolve(songId);
//     });
//   });
// }

// function deleteSong(songId) {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `${fbData.url}/songs/${songId}.json`,
//       method: 'DELETE',
//     }).done(function(songData) {
//       resolve(songData);
//     });
//   });
// }

// function getSong(songId) {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `${fbData.url}/songs/${songId}.json`
//     }).done(function(songData) {
//       resolve(songData);
//     });
//   });
// }

// function editSong(songFormObj, songId) {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `${fbData.url}/songs/${songId}.json`,
//       method: 'PUT',
//       data: JSON.stringify(songFormObj)
//     }).done(function() {
//       resolve();
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

// ****************************************
// DB interaction using Firebase SDK
// ****************************************

function getSongs(callback) {
  let user = currentUser.getUser();
  firebase.database().ref('songs/user-songs/' + user).on('value', function(songData) {
    callback(songData.val());
  });
}

function addSong(newSong) {
  let user = currentUser.getUser();
  let newPostKey = firebase.database().ref().child('songs').push().key;
  let updates = {};
  updates['/songs/' + newPostKey] = newSong;
  updates['/user-songs/' + user + '/' + newPostKey] = newSong;
  return firebase.database().ref(`songs/`).update(updates);
}

function deleteSong(songId) {
  let user = currentUser.getUser();
  return firebase.database().ref('songs/user-songs/' + user + '/' + songId).remove();
}

function getSong(songId) {
  let user = currentUser.getUser();
  return firebase.database().ref('songs/user-songs/' + user + '/' + songId).once('value');
}

function editSong(songFormObj, songId) {
  let user = currentUser.getUser();
  let updates = {};
  updates['/songs/' + songId] = songFormObj;
  updates['/user-songs/' + user + '/' + songId] = songFormObj;
  return firebase.database().ref('songs/').update(updates);
}

function editFavorites(songFormObj, songId) {
  console.log("test", songFormObj);
  let user = currentUser.getUser();
  return firebase.database().ref('songs/user-songs/' + user + '/' + songId).update(songFormObj)
}

function viewFavorites(callback) {
  let user = currentUser.getUser();
  return firebase.database().ref('songs/user-songs/' + user).orderByChild('favorite').equalTo(true).once('value');
}

function profileSongs(callback) {
  let user = currentUser.getUser();
  return firebase.database().ref('songs/user-songs/' + user).once('value');
}

function viewMusic() {
  let user = currentUser.getUser();
  return firebase.database().ref('songs/songs/').once('value')
}

module.exports = {
  getSongs,
  addSong,
  getSong,
  deleteSong,
  editSong,
  editFavorites,
  viewFavorites,
  viewMusic,
  profileSongs
};