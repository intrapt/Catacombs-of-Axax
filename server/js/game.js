//TODO: Optimise imports in game.js
const fs = require('fs'),
    n2w = require('numbers2words'),
    path = require('path'),
    util = require(path.join(__dirname, './utils.js')),
    data = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/data.json'))),
    items = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/items.json'))),
    inters = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/inters.json'))),
    locs = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/locs.json'))),
    t2w = new n2w('EN_US'),
    commands = data.commands;

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// TODO: Rewrite parseInput() to rely on player object
// TODO: Split parseInput() into several functions if possible
function parseInput(inputText) {
    let cmdList = [],
        input = inputText.toUpperCase().split(' ');
    if (input[0] != "") {
        for (let i = 0; i < input.length; i++) {
            for (let j in commands)
                for (let k in commands[j]) {
                    if (commands[j][k] == `${input[i]} ${input[i + 1]}`) {
                        if (cmdList.push(j), "travel" == j) {
                            if (!commands.travel.includes(j)) j = "";
                            cmdList.push(j);
                        }
                        delete input[i], delete input[i + 1];
                        break;
                    }
                    if (commands[j][k] == input[i]) {
                        cmdList.push(j), "travel" == j && cmdList.push(input[i]), delete input[i];
                        break;
                    }
                }
            for (let j in items) {
                if (items[j].name.toUpperCase() == `${input[i]} ${input[i + 1]}`) {
                    cmdList.push([j, "item"]), delete input[i], delete input[i + 1];
                    break;
                }
                if (items[j].name.toUpperCase() == input[i]) {
                    cmdList.push([j, "item"]), delete input[i];
                    break;
                }
            }
            for (let j in inters) {
                if (inters[j].name.toUpperCase() == `${input[i]} ${input[i + 1]}`) {
                    cmdList.push([j, "inter"]), delete input[i], delete input[i + 1];
                    break;
                }
                if (inters[j].name.toUpperCase() == input[i]) {
                    cmdList.push([j, "inter"]), delete input[i];
                    break;
                }
            }
        }
        return parseCommand(cmdList);
    }
}

function parseCommand(cmdList) {
    if (cmdList[0] == 'inv') return 'showInv';
    if (cmdList[0] == 'help') return 'help';
    if (cmdList[0] == 'travel') return cmdList;
    if (cmdList[0] == 'take' && cmdList[1][1] == 'item') return;
}

//TODO: Rewrite showInv() to rely on player object
function showInv(inventory) {
    let output = '',
        end = '';
    if (inventory.length != 0) {
        output += 'You are carrying:';
    } else {
        output += 'You are not carrying anything';
    }
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][1] != 1) {
            end = 's';
        }
        output += (`<br>${t2W.toWords(inventory[i][1]).capitalizeFirstLetter()} ${items[inventory[i][0]].name}${end}`);
    }
    return output;
}

function help() {
    let output = '';
    output += '<b>Commands</b>';
    for (let i = 0; i < data.help.commands.length; i++) output += `<br>${data.help.commands[i]}`;
    output += '<br><br><b>Command Abbreviations</b>';
    for (let i = 0; i < data.help.abbrevs.length; i++) output += `<br>${data.help.abbrevs[i]}`;
    output += '<br><br><b>Command Parser</b>';
    for (let i = 0; i < data.help.parser.length; i++) output += `<br>${data.help.parser[i]}`;
    return output;
}

//TODO: Replace takeItem() with player.addItem()
// Deprecated, now part of player object
function takeItem(socket, item) {
    let location = socket.location;
    let inInv = false;
    for (let i = 0; i < socket.locs[location].items.length; i++) {
        if (item == socket.locs[location].items[i].id) {
            socket.locs[location].items.splice(i, 1);
            for (let i = 0; i < inventory.length; i++) {
                if (item == inventory[i][0]) {
                    socket.inventory[i][1] += 1;
                    inInv = true;
                }
            } if (inInv == false) {
                socket.inventory.push([item, 1]);
            }
        }
    }
}

// TODO: Rewrite travel() to use player.changeLocation()
function travel(location, direction) {
    room = socket.locs[location];
    for (let i = 0; i < room.exits.length; i++) {
        if (room.exits[i].bearing.toUpperCase() == direction) {
            location = room.exits[i].id;
        }
    }
    return location;
}

// TODO: Rewrite roomDesc() to use player object instead of socket
// TODO: Rewrite roomDesc() to make sense
function roomDesc(socket) { // Generates a room description based on the objects in the room. It's not elegant (at all), but it works
    let desc = '',
        room = socket.locs[socket.location],
        interL = room.inters.length,
        itemL = room.items.length,
        locL = room.exits.length;

    if (socket.start == true) {
        desc += `You wake up in ${util.vowel(room.name.toLowerCase())} ${room.name.toLowerCase()}. `;
        socket.start = false;
    } else {
        desc += `You are in ${util.vowel(room.name.toLowerCase())} ${room.name.toLowerCase()}. `;
    }
    if (room.desc != '') { desc += `${room.desc}. `; }

    if (itemL >= 2) {
        desc += 'There is ';
        for (let i = 0; i < itemL; i++) {
            if (itemL - 1 != i) {
                desc += `${util.vowel(items[room.items[i].id].name)} ${util.green(items[room.items[i].id].name)} ${room.items[i].loc}, `
            } else {
                desc += `and ${util.vowel(items[room.items[i].id].name)} ${util.green(items[room.items[i].id].name)} ${room.items[i].loc}. `;
            }
        }
    } else if (itemL == 1) {
        desc += `There is ${util.vowel(items[room.items[0].id].name)} ${util.green(items[room.items[0].id].name)} ${room.items[0].loc}. `;
    }
    if (interL >= 2) {
        desc += 'There is ';
        for (let i = 0; i < interL; i++) {
            if (interL - 1 != i) {
                desc += `${util.vowel(inters[room.inters[i].id].name)} ${util.green(inters[room.inters[i].id].name)} ${room.inters[i].loc}, `
            } else {
                desc += `and ${util.vowel(inters[room.inters[i].id].name)} ${util.green(inters[room.inters[i].id].name)} ${room.inters[i].loc}. `;
            }
        }
    } else if (interL == 1) {
        desc += `There is ${util.vowel(inters[room.inters[0].id].name)} ${util.green(inters[room.inters[0].id].name)} ${room.inters[0].loc}. `;
    }
    if (locL >= 2) {
        desc += 'There is ';
        for (let i = 0; i < locL; i++) {
            if (locL - 1 != i) {
                desc += `${util.vowel(room.exits[i].name)} ${util.green(room.exits[i].name)} to the ${room.exits[i].bearing}, `
            } else {
                desc += `and ${util.vowel(room.exits[i].name)} ${util.green(room.exits[i].name)} to the ${room.exits[i].bearing}. `;
            }
        }
    } else if (locL == 1) {
        desc += `There is ${util.vowel(room.exits[0].name)} ${util.green(room.exits[0].name)} to the ${room.exits[0].bearing}. `;
    }
    return `<b>${room.name}</b><br>${desc}`;
}

module.exports = {
    parseInput,
    newPlayer,
    showInv,
    help,
    takeItem,
    travel,
    roomDesc,
    parseCommand
}