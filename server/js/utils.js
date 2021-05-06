const fs = require('fs'),
    path = require('path'),
    moment = require('moment'),
    n2w = require('numbers2words'),
    t2w = new n2w('EN_US');

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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
    return `<span class="greenText"> ${word} </span>`;
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

function parseJSON(dir, pathName) {
    return JSON.parse(fs.readFileSync(path.join(dir, pathName)));
}

function numToStr(number) {
    return t2W.toWords(number).capitalizeFirstLetter();
}

module.exports = {
    green,
    vowel,
    uuidv4,
    numToStr,
    resetLog,
    writeLog,
    parseJSON,
}
