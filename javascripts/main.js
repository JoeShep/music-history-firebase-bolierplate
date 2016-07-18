"use strict";

let $ = require("jquery"),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),   //parses and sticks into the DOM
    login = require("./user"),
    firebase = require("firebase/app"),
    currentUser = null;

firebase.auth().onAuthStateChanged(function(user) {
if (user){
  console.log("user logged in", user.uid);
  currentUser = user.uid;
  // db.getSongs(templates.makeSongList, currentUser);    // use this with Firebase SDK
  loadSongsToDOM();     // use this with Firebase REST API
  }else{
  console.log("not logged in");
  }
});

// // *******************************************************
// // Using the Firebase SDK and its auto update.          // Proprietary to FIREBASE!
// // Calling "getSongs" now sets up a listener when loading the DOM.
// // Pass it a callback that handles the incoming data and it will re-call that
// // function when anything changes in our data

// $(document).on("click", ".save_new_btn", function() {
//   let songObj = buildSongObj();
//   db.addSong(songObj)
//   .then(function(songData){
//     console.log("Song Saved",songData.key);
//   });
// });

// // Load and populate form for editing a song
// $(document).on("click", ".edit-btn", function () {
//   let songId = $(this).data("edit-id");
//   db.getSong(songId)
//   .then(function(song){
//     return templates.songForm(song.val(), songId);
//   })
//   .then(function(completeForm){
//     $(".uiContainer--wrapper").html(completeForm);
//   });
// });

// //Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {
//   let editedSong = buildSongObj();
//   let songId = $(this).attr("id");
//   db.editSong(editedSong, songId);
// });

// // Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function() {
//   db.deleteSong($(this).data("delete-id"));
// });


// // User login section. Should ideally be in its own module
// $("#auth-btn").click(function() {
//   console.log("clicked auth");
//   login.logInGoogle()
//   .then(function(result){
//     var user = result.user;
//     console.log("Logged in user",user.uid);
//     db.getSongs(templates.makeSongList);
//   }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
//   });
// });



// // Helper functions for forms stuff. Nothing related to Firebase
// // Build a song obj from form data.
// function buildSongObj() {
//     let songObj = {
//     title: $("#form--title").val(),
//     artist: $("#form--artist").val(),
//     album: $("#form--album").val(),
//     year: $("#form--year").val(),
//     uid: currentUser
//   };
//   return songObj;
// }

// // Load the new song form
// $("#add-song").click(function() {
//   console.log("clicked add song");
//   var songForm = templates.songForm()
//   .then(function(songForm) {
//     $(".uiContainer--wrapper").html(songForm);
//   });
// });





// Using the REST API
function loadSongsToDOM() {
  console.log("Hello");
  $(".uiContainer--wrapper").html("");  //empties out the prior data in wrapper
  db.getSongs(currentUser)
  .then(function(songData){
    templates.makeSongList(songData);  //since we didn't do /songs in db-interaction
  });
}
loadSongsToDOM();

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
  let songObj = buildSongObj();
  db.addSong(songObj)
  .then(function(songId){
    console.log("song saved",songId);
    loadSongsToDOM();
  });
});

// Load and populate form for editing a song
$(document).on("click", ".edit-btn", function () {
  let songId = $(this).data("edit-id");   //pull attribute off the element - (this).attr("name")
  db.getSong(songId)
  .then(function(song) {
    return templates.songForm(song, songId);
  })
  .then(function(finishedForm){
    $(".uiContainer--wrapper").html(finishedForm);
  });
});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
      songId = $(this).attr("id");
  db.editSong(songObj, songId)
  .then(function(data){
    console.log("Edited song saved", data);
    loadSongsToDOM();
  });
});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  db.deleteSong($(this).data("delete-id"))
  .then(function(){
    loadSongsToDOM();
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