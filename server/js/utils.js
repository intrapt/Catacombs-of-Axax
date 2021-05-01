const fs = require('fs'),
    path = require('path'),
    moment = require('moment');;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function vowel(word) { // Returns preposition based on first letter of word
    const regex = new RegExp('^[aeiou].*', 'i');
    let regexOutput = regex.test(word);
    if (regexOutput == true) {
        return 'an';
    } else {
        return 'a';
    }
}

function green(word) {
    return `<span class="greenText">${word}</span>`;
}

function now() {
    return moment().format('YYYY/MM/DD-HH:mm:ss');
}

function writeLog(text) {
    fs.appendFile(
        path.join(__dirname, '../log.txt'),
        `<${now()}> ${text}\n`,
        function() {
            return;
        }
    );
}

function resetLog() {
    fs.unlink(
        path.join(__dirname, '../log.txt'),
        function() {
            return;
        }
    );
    fs.writeFile(
        path.join(__dirname, '../log.txt'),
        '',
        function() {
            return;
        }
    );
}

function parseJSON(dirname, path) {
    return JSON.parse(
        fs.readFileSync(path.join(dir, path))
    );
}

module.exports = {
    uuidv4,
    vowel,
    green,
    writeLog,
    resetLog,
    parseJSON
}