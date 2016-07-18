"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./firebaseConfig"),
    fb = require("./fb-getter"),
    fbData = fb();

// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// function getSongs() {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: "https://musichistory-firebase.firebaseio.com/.json"
// 		}).done(function(songData){
// 			resolve(songData);
// 		});
// 	});
// }

// function addSong(songFormObj) {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: "https://musichistory-firebase.firebaseio.com/songs.json",
// 			type: "POST",
// 			data: JSON.stringify(songFormObj),
// 			dataType: "json"
// 		}).done(function(songId){
// 			resolve(songId);
// 		});
// 	});
// }

// function deleteSong(songId) {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `https://musichistory-firebase.firebaseio.com/songs/${songId}.json`,
// 			method: "DELETE",
// 		}).done(function(){
// 			resolve();
// 		});
// 	});
// }

// function getSong(songId) {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `https://musichistory-firebase.firebaseio.com/songs/${songId}.json`
// 		}).done(function(songData){
// 			resolve(songData);
// 		});
// 	});
// }

// function editSong(songFormObj, songId) {
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `https://musichistory-firebase.firebaseio.com/songs/${songId}.json`,
// 			type: "PUT",
// 			data: JSON.stringify(songFormObj)
// 			// dataType: "json"
// 		}).done(function(data){
// 			resolve(data);
// 		});
// 	});
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

function getSongs(callback, userId) {
	let songs = firebase.database().ref('songs');
	songs.orderByChild("uid").equalTo(userId).on('value', function(songData){ //looks at ref of 'songs' and listens for any changes to the ref
		callback(songData.val());
	});
}

function addSong(newSong) {
	return firebase.database().ref("songs").push(newSong);
}

function deleteSong(songId) {
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