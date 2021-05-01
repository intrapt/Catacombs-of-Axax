"use-strict";

const socket = io();

$(document).ready(function() {
    scrollToBottom();
});

$(window).on('beforeunload', function(){
    socket.close();
});

socket.on('newText', function(data) {
    addText(data);
});

socket.on('disconnect', function() {
    addText('<span class=redText>Disconnected from server</span>');
});

document.getElementById('mainInput').addEventListener('keydown',
   function(event) {
        if (event.keyCode == 13){   
            event.preventDefault();
            sendInput(document.getElementById('mainInput').value);
            document.getElementById('mainInput').value = '';
        }
    }, false
);

document.getElementById('invButton').onclick = function() {
    sendInput('inv');
}

function sendInput(text) {
    socket.emit('input', {
        value: text
    });
}

function scrollToBottom() {
    let box = document.getElementById('textBoxOuter');
    box.scrollTop = box.scrollHeight - box.clientHeight;
}

function addText(text) {
    let p = document.createElement('p'),
        box = document.getElementById('textBoxInner');
    p.innerHTML = text;
    box.appendChild(p);
    scrollToBottom();
}
