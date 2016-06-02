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

// This is my State:
var gState = {
    isUserTurn : false,
    seqNoteIndexes: [],
    currNoteIndexToClick: 0,
    level: 1
}

// we created a 3 sound array!
var gSounds = ['sound/pianoKey1.mp3', 'sound/pianoKey2.mp3', 'sound/pianoKey3.mp3'];



// add function playNote() --> reuseable function 
//    1.1 --> play sound of note when clicked (both computer and user).
//             1.1.1 --> upon loose --> play a sound of loosing.
//              1.1.2 --> upon Winning --> play a sound of victory!!!


function playNote(addedNoteSound) {
    // console.log('elNote: ', elNote);
    var audio = new Audio(addedNoteSound);
    console.log('addedNoteSound: ', addedNoteSound);
    
    audio.play();
    
    }  




















function init() {
    NOTES = createNotesModel(3);
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
                             'style="background:'+ note.color +'">' + 
                            note.sound + 
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
            
            // everytime a random key is picked --> play it's sound.(compute side.) WORKS now trying with function.
            // var audio = new Audio(NOTES[seqNoteIndex].sound);
            // audio.play();
            
            // Works from function!! just need to put the right random sound elected by compute in argument.
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
    // console.log('noteIndex: ', noteIndex, 'gState.seqNoteIndexes[gState.currNoteIndexToClick]:', gState.seqNoteIndexes[gState.currNoteIndexToClick]);
    
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        // goood this log is the clicked sound. now play it
        console.log('elNote.innerText: ', elNote.innerText);
        
        // this should work but fix bug first
        playNote(elNote.innerText);
        
        console.log('User OK!');
        gState.currNoteIndexToClick++;
        // console.log('gState.currNoteIndexToClick: ', gState.currNoteIndexToClick);
        
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
            computerTurn();
        }
        
        
    } else {
        console.log('User Wrong!');
        var elPiano = document.querySelector('.piano');
        elPiano.style.display = 'none';
        // playNote(gState.seqNoteIndexes.sound);
        
    }
    
    // console.log('elNote', elNote);
    console.log('Note', NOTES[noteIndex]);
   
    
}

function computerTurn() {
     gState.isUserTurn = false;
     gState.currNoteIndexToClick  = 0;
     //alert('User Turn is Over');
     addRandomNote();

     playSeq();
}


