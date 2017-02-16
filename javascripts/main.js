"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user");

// Using the REST API
function loadSongsToDOM() {
  console.log("Need to load some songs, Buddy");
  let currentUser = user.getUser(); //add once we have login
  console.log("currentUser in loadSongs", currentUser);
  db.getSongs(currentUser)
  // db.getSongs()
  .then(function(songData){
    console.log("got data", songData);
    //with users, this is already happening...?
    //add the id to each song and then build the song list
    // var idArray = Object.keys(songData);
    // idArray.forEach(function(key){
    //   songData[key].id = key;
    // });
    // console.log("song object with id", songData);
    //now make the list with songData
    templates.makeSongList(songData);
  });
}


// Version 1 - without user login //////////////////////////
// function loadSongsToDOM() {
//   console.log("Need to load some songs, Buddy");
//   db.getSongs()
//   .then(function(songData){
//     console.log("got data", songData);
//     //add the id to each song and then build the song list
//     var idArray = Object.keys(songData);
//     idArray.forEach(function(key){
//       songData[key].id = key;
//     });
//     console.log("song object with id", songData);
//     //now make the list with songData
//     templates.makeSongList(songData);
//   });
// }
// loadSongsToDOM();




// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
  console.log("click save new song");
  let songObj = buildSongObj();
  db.addSong(songObj)
  .then(function(songID){
    loadSongsToDOM();
  });
});


// go get the song from database and then populate the form for editing.
//used with fat arrows, this is not the same as below. Use event.target instead.
$(document).on("click", ".edit-btn", function () {
  console.log("click edit song");
  let songID = $(this).data("edit-id");
  db.getSong(songID)
  .then(function(song){
    return templates.songForm(song, songID);
  })
  .then(function(finishedForm){
    $(".uiContainer--wrapper").html(finishedForm);
  });
});


//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
    songID = $(this).attr("id");
    console.log("songID", songID);
    db.editSong(songObj, songID)
    .then(function(data){
      loadSongsToDOM();
    });
});


// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  console.log("clicked delete song", $(this).data("delete-id"));
  let songID = $(this).data("delete-id");
  db.deleteSong(songID)
  .then(function(){
     loadSongsToDOM();
  });
});


//make the view button work.
$("#view-songs").click(function() {
    $(".uiContainer--wrapper").html("");
    loadSongsToDOM();
});


//***************************************************************
// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
  console.log("clicked auth");
  user.logInGoogle()
  .then(function(result){
    console.log("result from login", result.user.uid);
    // user = result.user.uid;
    user.setUser(result.user.uid);
    $("#auth-btn").addClass("is-hidden");
    $("#logout").removeClass("is-hidden");
    loadSongsToDOM();
  });
});

$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});

//****************************************************************

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: user.getUser() // include uid to the object only if a user is logged in.
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
