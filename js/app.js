// Tasks:
    // playNote as reusable function
    // -. when note is played play sounds
    // -. sound when loosing
    // -. sound when correct seq
// Score
// BONUS:
// support mute 
// visual
// keep max score in localStorage
// levels
 

'use strict';
var NOTES;
//The Score of the user
var gScore = 0;
// This is my State:
var gState = {
    isUserTurn : false,
    seqNoteIndexes: [],
    currNoteIndexToClick: 0,
    level: 1,
    score:0
}
//3 must vars for mute() to work - by this point .  
    //1.// this var is responsable to check if mute btn is on 
var gIsBtnMuteOn = false;
    //2.//
var gAudio;
    //3.//this var is responsable to check if the mute is on or off by getting odd number or not 
var gBtnClickCounter = 1;

// we created a 3 sound array!
var gSounds = ['sound/pianoKey1.mp3', 'sound/pianoKey2.mp3', 'sound/pianoKey3.mp3'];

// guidelines:
// add function playNote() --> reuseable function 
//    1.1 --> play sound of note when clicked (both computer and user).
//             1.1.1 --> upon loose --> play a sound of loosing.
//              1.1.2 --> upon Winning --> play a sound of victory!!!


function playNote(addedNoteSound) {
    // console.log('elNote: ', elNote);
    //checking if the mute btn is off --> play note sound 
    if (!gIsBtnMuteOn) {
        console.log('gBtnClickCounter: ',gBtnClickCounter);
        console.log('Mute btn is on :', gIsBtnMuteOn);

        var gAudio = new Audio(addedNoteSound);
        console.log('addedNoteSound: ', addedNoteSound);
        gAudio.play();
    //checking if the mute btn is on --> Do NOT play note sound! 
    }if (gIsBtnMuteOn) {
         console.log('gBtnClickCounter: ',gBtnClickCounter);
         console.log('Mute btn is on :', gIsBtnMuteOn);
    }
        
}  

function mute() {
    gBtnClickCounter++;
    if(gBtnClickCounter % 2 === 0) {
         gIsBtnMuteOn = true;
         var elBtnMute = document.querySelector('#btnMute');
         elBtnMute.style.background = 'red';
         gAudio = null;
    }else {
         gIsBtnMuteOn = false;
         var elBtnMute = document.querySelector('#btnMute');
         elBtnMute.style.background = 'white';
    }
}

function init() {
    // upgrades this createNotesModel to work with every size of sounds array.
    // inserting gSounds.length --> adjustable, if tmrw we want to add a new sound & key on the piano, to the array the comp chooses from.
    NOTES = createNotesModel(gSounds.length);
    renderNotes(NOTES); 
    computerTurn();
}

// creates the piano with three CONST sounds.
function createNotesModel(size){
    var notes = [];
    
    for (var i = 0; i < size; i++) {
       // upon creating the piano --> detirmine sounds for key1 key2 key3
       var note = {sound : gSounds[i], color: getRandomColor()};
       notes.push(note);
    }
    console.log('notes: ', notes);
    
    return notes;
}

function renderNotes(notes) {
    // mapping notes to html tags
    var strHtmls = notes.map(function(note, i){
        var strHtml =  '<div class="note" onclick="noteClicked(this)" data-note="'+i+'"' + 
                             'style="background:'+ note.color +'">'
                            //   +'<audio src="'+ note.sound +'"></audio>' 
                               + note.sound +
                        '</div>';
        return strHtml;
    });
    
    
    var elPiano = document.querySelector('.piano');
    elPiano.innerHTML = strHtmls.join('');
}

function addRandomNote() {
    gState.seqNoteIndexes.push(getRandomIntInclusive(0,NOTES.length-1));
}

function playSeq() {
    var elNotes = document.querySelectorAll('.note');
    
    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {
        
        setTimeout(function playNotes() {
            elNotes[seqNoteIndex].classList.add('playing');
            
            setTimeout(function donePlayingNote() {
                elNotes[seqNoteIndex].classList.remove('playing');
            }, 500);
            
            console.log('Playing: ', NOTES[seqNoteIndex].sound);
            
            // everytime a random key is picked -->(seqNoteIndex) is random key --> play it's sound(NOTES[seqNoteIndex].sound) --> (computer side) 
            playNote(NOTES[seqNoteIndex].sound);
        }, 1000 * i);
        
    });
    
    setTimeout(function () {
        console.log('Done Playing Sequence!!');
        gState.isUserTurn = true;
    }, 1000 * gState.seqNoteIndexes.length);
   
}

function noteClicked(elNote) {
    if (!gState.isUserTurn) return;
    var noteIndex = +elNote.getAttribute('data-note');
    console.log('noteIndex is: ', noteIndex);
    // User clicked the right note
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        // Clicked el sound (user side)
        console.log('elNote.innerText: ', elNote.innerText);
        // plays the clicked el sound:
        playNote(elNote.innerText);
        console.log('User OK!');
        gState.currNoteIndexToClick++;
        
        // added delay between user click --> to changing to computer turn and next sequence initialiizing.
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
        updateScore()
            setTimeout(function(){
                computerTurn();
            }, 1500);
        }
        
        
    } else {
        console.log('User Wrong!');
        var elPiano = document.querySelector('.piano');
        elPiano.style.display = 'none';
        playNote(elNote.innerText);
        
    }
    console.log('Note', NOTES[noteIndex]);
   
    
}

function computerTurn() {
     gState.isUserTurn = false;
     gState.currNoteIndexToClick  = 0;
     //alert('User Turn is Over');
     addRandomNote();
     playSeq();
}

function updateScore() {
    //The element of the span -Score that is rendering from gScore
    var elScore = document.querySelector('.scoreSpan');
    gState.score++;
    elScore.innerText= gState.score;
}
