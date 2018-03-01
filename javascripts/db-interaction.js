"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./fb-config");

// ****************************************
// DB interaction using Firebase REST API
// ****************************************
//check on crossDomain: true

function getSongs(user) {
   console.log("url", firebase.getFBsettings().databaseURL);
	return $.ajax({
		url: `${firebase.getFBsettings().databaseURL}/songs.json?orderBy="uid"&equalTo="${user}"`
		// url: `https://musichistory-d16.firebaseio.com/songs.json?orderBy="uid"&equalTo="${user}"`
	}).done((songData) => {
		console.log("songData in promise", songData);
		return songData;
   });
}

//version 1 - without user id /////////////////////////////////
// function getSongs() {
// 	return $.ajax({
// 		url: `${firebase.getFBsettings().databaseURL}/songs.json`
// 	}).done((songData) => {
// 		return songData;
// 	});
// }



function addSong(songFormObj) {
	console.log("addSong", songFormObj);
	return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/songs.json`,
      type: 'POST',
      data: JSON.stringify(songFormObj),
      dataType: 'json'
   }).done((songID) => {
      return songID;
   });
}
// POST - Submits data to be processed to a specified resource.


function deleteSong(songId) {
	return $.ajax({
      	url: `${firebase.getFBsettings().databaseURL}/songs/${songId}.json`,
      	method: "DELETE"
	}).done((data) => {
		return data;
	});
}

function getSong(songId) {
   return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/songs/${songId}.json`
   }).done((songData) => {
      return songData;
   }).fail((error) => {
      return error;
   });
}

// GET - Requests/read data from a specified resource
// PUT - Update data to a specified resource.
function editSong(songFormObj, songId) {
   return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/songs/${songId}.json`,
      type: 'PUT',
      data: JSON.stringify(songFormObj)
   }).done((data) => {
      return data;
   });
}

module.exports = {
  getSongs,
  addSong,
  getSong,
  deleteSong,
  editSong
};
