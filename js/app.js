'use strict';

var gState = {
    isUserTurn : false,
    seqNoteIndexes: [],
    currNoteIndexToClick: 0,
    level: 1,
    score:0
}
var gSounds = ['sound/pianoKey1.mp3', 'sound/pianoKey2.mp3', 'sound/pianoKey3.mp3'];
var gElComputerDataNote;
var gScore = 0;
var gIsBtnMuteOn = false;
var gAudio;
var gBtnClickCounter = 1;

var NOTES;

function playNote(addedNoteSound) {
        if (!gIsBtnMuteOn) {
            var gAudio = new Audio(addedNoteSound);
            console.log('addedNoteSound: ', addedNoteSound);
            gAudio.play();
        }
}  

function mute() {
    gBtnClickCounter++;
    if (gBtnClickCounter % 2 === 0) {
        gIsBtnMuteOn = true;
        var elBtnMute = document.querySelector('#btnMute');
        gAudio = null;
        // mute button icon toggle / untoggle
        var elBtnMuteSpan = document.querySelector('.muteSpan');
        elBtnMuteSpan.classList.remove('glyphicon-volume-up');
        elBtnMuteSpan.classList.add('glyphicon-volume-off');
    } else {
        gIsBtnMuteOn = false;
        // mute button toggle / untoggles
        var elBtnMuteSpan = document.querySelector('.muteSpan');
        elBtnMuteSpan.classList.remove('glyphicon-volume-off');
        elBtnMuteSpan.classList.add('glyphicon-volume-up');
    }
}

function init() {
    NOTES = createNotesModel(gSounds.length);
    renderNotes(NOTES);
    setTimeout(function() {
        computerTurn();
    }, 1000);
}

function createNotesModel(size) {
    var notes = [];
    for (var i = 0; i < size; i++) {
        var note = { sound: gSounds[i], color: getRandomColor() };
        notes.push(note);
    }
    return notes;
}

function renderNotes(notes) {
    // mapping notes to html tags
    var strHtmls = notes.map(function (note, i) {
        var strHtml =   '<div class="note" onclick="noteClicked(this)" data-note="' + i + '"' +
                        'style="background:'    + note.color + '"></div>';
                        'style="background:'    + note.color + '">'
                                                + note.sound +
                        '</div>';
        return strHtml;
    });
    var elPiano = document.querySelector('.piano');
    elPiano.innerHTML = strHtmls.join('');
}

function addRandomNote() {
    gState.seqNoteIndexes.push(getRandomIntInclusive(0, NOTES.length - 1));
}

function playSeq() {
    var elNotes = document.querySelectorAll('.note');
    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {
        setTimeout(function playNotes() {
            elNotes[seqNoteIndex].classList.add('playing');
            setTimeout(function donePlayingNote() {
                elNotes[seqNoteIndex].classList.remove('playing');
            }, 500);
            gElComputerDataNote = +elNotes[seqNoteIndex].getAttribute('data-note');
            if (gElComputerDataNote === 0) {
                var elKlid1 = document.querySelector('.note1');
                elKlid1.style.border = "5px solid lightgreen";
                setTimeout(function () {
                    elKlid1.style.border = "";
                }, 700);
            }
            if (gElComputerDataNote === 1) {
                var elKlid2 = document.querySelector('.note2');
                elKlid2.style.border = "5px solid lightgreen";
                setTimeout(function () {
                    elKlid2.style.border = "";
                }, 700);
            }
            if (gElComputerDataNote === 2) {
                var elKlid3 = document.querySelector('.note3');
                elKlid3.style.border = "5px solid lightgreen";
                setTimeout(function () {
                    elKlid3.style.border = "";
                }, 700);
            }
            // everytime a random key is picked play it's sound(computer side) 
            playNote(NOTES[seqNoteIndex].sound);
        }, 1000 * i);
    });
    setTimeout(function () {
        gState.isUserTurn = true;
    }, 1000 * gState.seqNoteIndexes.length);
}

function noteClicked(elNote) {
    if (!gState.isUserTurn) return;
    var noteIndex = +elNote.getAttribute('data-note');
    elNote.style.border = "5px solid lightgreen";
    setTimeout(function () {
        elNote.style.border = "";
    }, 700);  
    // user clicked right klid
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        playNote(elNote.innerText);
        gState.currNoteIndexToClick++;
        // added delay between user click --> to changing to computer turn and next sequence initialiizing.
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
            updateScore();
            setTimeout(function () {
                computerTurn();
            }, 1500);
        }
    } else {
        var elPiano = document.querySelector('.piano');
        elPiano.style.display = 'none';
        playNote(elNote.innerText);
        var elClickedDataNote = +elNote.getAttribute('data-note');
        elNote.style.border = "5px solid red";
        setTimeout(function () {
            elNote.style.border = "";
        }, 700);
        alert('Game Over');
    }
}

function computerTurn() {
     gState.isUserTurn = false;
     gState.currNoteIndexToClick  = 0;
     addRandomNote();
     playSeq();
     
}

function updateScore() {
    var elScore = document.querySelector('.scoreSpan');
    gState.score++;
    elScore.innerText= gState.score;
}