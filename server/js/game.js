const fs = require('fs'),
    n2w = require('numbers2words'),
    path = require('path'),
    util = require(path.join(__dirname, './utils.js')),
    t2w = new n2w('EN_US');

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function parseInputText(player, inputText) {
    const commandList = inputText.toUpperCase().split(' ');
    let parsedCommand = [];

    if (commandList[0] != '') {
        for (let i = 0; i < commandList.length; i++) {
            const commandWords = parseCommandWords(commandList, i),
                itemsAndInters = parseItemsAndInters(player, commandList, i);

            parsedCommand.push(commandWords[0]);
            if (commandWords[1] != null) {
                parsedCommand.push(commandWords[1]);
            }

            if (itemsAndInters != null) {
                parsedCommand.push(itemsAndInters[0])
                delete commandList[i];
                if (item[1] == 0) {
                    delete commandList[i + 1];
                }
            }
        }
    }
    // Removes falsy values
    return parsedCommand.filter(x => x);
    
}

function parseItemsAndInters(player, commandList, index) {
    let object = player.itemList,
        type = 'item';

    for (let i = 0; i < 2; i++) {
        if (i == 1) {
            object = player.interList;
            type = 'inter';
        }
        for (let j in object) {
            if (object[j].name.toUpperCase() == `${commandList[index]} ${commandList[index + 1]}`) {
                return [[j, type], 0];
            } else if (object[j].name.toUpperCase() == commandList[index]) {
                return [[j, type], 1];
            }
        }
    }
}

function parseCommandWords(commandList, index) {
    const commands = util.parseJSON(__dirname, '../json/data.json').commands;
    let output = [null, null];

    for (let i in commands) {
        for (let j in commands[i]) {
            if (commands[i][j] == commandList[index]) {
                output[0] = i;
                if (i == 'travel') {
                    output[1] = commandList[index];
                }
            }
        }
    }
    return output;
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
    let data = util.parseJSON(__dirname, '../json/data.json'),
        output = '';
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
    showInv,
    help,
    takeItem,
    travel,
    roomDesc,
    parseInputText
}