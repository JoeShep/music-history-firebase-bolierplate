"use strict";

console.log("Is this bundling?");

let $ = require("jquery"),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    login = require("./user"),
    firebase = require("firebase/app"),
    currentUser = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User logged in, Dude", user.uid);
    currentUser = user.uid;
    // Call this when using the REST API
    loadSongsToDOM();
    // Call this when using Firebase SDK
    // db.getSongs(templates.makeSongList, currentUser);
  } else {
    console.log("User not logged in");
  }
});

// Using the REST API
function loadSongsToDOM() {
  $(".uiContainer--wrapper").html("");
  db.getSongs(currentUser)
  .then(function(songData) {
    templates.makeSongList(songData);
  });
}

// // Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
  let songObj = buildSongObj();
  db.addSong(songObj)
  .then(function(songId) {
    console.log("song saved", songId );
    loadSongsToDOM();
  });
});

// // Load and populate form for editing a song
$(document).on("click", ".edit-btn", function () {
  let songId = $(this).data("edit-id");
  db.getSong(songId)
  .then(function(song) {
    return templates.songForm(song, songId);
  })
  .then(function(finishedForm) {
    $(".uiContainer--wrapper").html(finishedForm);
  });
});

// //Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
      songId = $(this).attr("id");
  db.editSong(songObj, songId)
  .then(function(data) {
    console.log("edited song saved", data);
    loadSongsToDOM();
  });
});

// // Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  db.deleteSong($(this).data("delete-id"))
  .then(function () {
    loadSongsToDOM();
  });
});


// *******************************************************
// Using the Firebase SDK and its auto update.
// Calling "getSongs" now sets up a listener when loading the DOM.
// Pass it a callback that handles the incoming data and it will re-call that
// function when anything changes in our data

// Use before adding Oauth, then move to Oauth callback
// db.getSongs(templates.makeSongList);

// No need to reload the DOM in the ".then"
// $(document).on("click", ".save_new_btn", function() {
//   let songObj = buildSongObj();
//   console.log("SongObj", songObj );
//   db.addSong(songObj)
//   .then(function(data){
//     // The .key property of a push() reference contains the value of the auto-generated key.
//     // Don't really need a ".then" here, but wanted to show that you can
//     // get back the new ID of the added song and do something with it
//     console.log("song saved", data.key);
//   });
// });

// Load and populate form for editing a song
// $(document).on("click", ".edit-btn", function () {
//   let songId = $(this).data("edit-id");
//   db.getSong(songId)
//   .then(function(song) {
//     // .val() gives us the actual returned song object
//     return templates.songForm(song.val(), songId)
//   .then(function(finishedForm) {
//       $(".uiContainer--wrapper").html(finishedForm);
//     });
//   });
// });

//Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {
//   let songObj = buildSongObj(),
//       songId = $(this).attr("id");
//   db.editSong(songObj, songId)
//   .then(function(data) {
//     // Need to dig deeper to see what this promise returns. Currently undefined
//     console.log("edited song", data );
//   });
// });

// Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function () {
//   console.log("btn clicked", $(this).data("delete-id"));
//   db.deleteSong($(this).data("delete-id"))
//   .then(function(data) {
//     console.log("Song all gone", data);
//   });
// });

// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
  console.log("clicked auth");
  login()
  .then(function(result) {
    var user = result.user.uid;
    console.log("logged in user with ID", user);
    loadSongsToDOM();
    // db.getSongs(templates.makeSongList, user);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
});

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: currentUser
  };
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});
