const fs = require('fs'),
    path = require('path'),
    util = require(path.join(__dirname, './utils.js'));

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
    let output = [];

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

function showInv(player) {
    let output = 'You are carrying:',
        inventory = player.inventory,
        items = player.itemList,
        end = '';
    
    if (inventory.length == 0) {
        return 'You are not carrying anything';
    }
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i][1] != 1) {
            end = 's';
        }
        output += '<br>' + util.numToStr(inventory[i][1]);
        output += ' ' + items[inventory[i][0]].name;
        output += end + '</br>';
    }
    return output;
}

function help() {
    let data = util.parseJSON(__dirname, '../json/data.json'),
        output = '<b>Commands</b>';
    
    for (let i = 0; i < data.help.commands.length; i++) {
        output += `<br>${data.help.commands[i]}`;
    }
    output += '<br><br><b>Command Abbreviations</b>';
    for (let i = 0; i < data.help.abbrevs.length; i++) {
        output += `<br>${data.help.abbrevs[i]}`;
    }
    output += '<br><br><b>Command Parser</b>';
    for (let i = 0; i < data.help.parser.length; i++) {
        output += `<br>${data.help.parser[i]}`;
    }
    return output;
}

function travel(player, direction) {
    for (let i = 0; i < player.room.exits.length; i++) {
        if (player.room.exits[i].bearing.toUpperCase() == direction) {
            player.location = player.room.exits[i].id;
            player.room = player.locationList[player.location];
        }
    }
}

function generateRoomDescription(player) {
    let output = '';
    if (player.start) {
        output += 'You wake up in ';
        player.start = false;
    } else {
        output += 'You are in ';
    }
    output += util.vowel(player.room.name.toLowerCase()) + ' ';
    output += player.room.name.toLowerCase() + '. ';
    output += player.room.desc;
    output += generateItemsIntersLocs(player.room.items, player.itemList);
    output += generateItemsIntersLocs(player.room.inters, player.interList);
    output += generateExitLocations(player);

    return output;
}

function generateItemsIntersLocs(object, objectList) { 
    let output = '';
    if (object.length >= 2) {
        output += 'There is ';
        for (let i = 0; i < object.length; i++) {
            if (object.length - 1 != i) {
                output += 'and';
            }
            output += util.vowel(objectList[object[i].id].name);
            output += util.green(objectList[object[i].id].name);
            output += object[i].loc + '. ';
        }
    } else if (object.length == 1) {
        output += 'There is ';
        output += util.vowel(objectList[object[0].id].name);
        output += util.green(objectList[object[0].id].name);
        output += object[0].loc + '. ';
    }
    return output;
}

function generateExitLocations(player) {
    let output = '';
    if (player.room.exits.length >= 2) {
        output += 'There is ';
        for (let i = 0; i < player.room.exits.length; i++) {
            if (player.room.exits.length - 1 != i) {
                output += 'and';
            }
            output += util.vowel(player.room.exits[i].name);
            output += util.green(player.room.exits[i].name);
            output += 'to the ';
            output += player.room.exits[i].bearing + '. ';
        }
    } else if (player.room.exits.length == 1) {
        output += 'There is ';
        output += util.vowel(player.room.exits[0].name);
        output += util.green(player.room.exits[0].name);
        output += 'to the ';
        output += player.room.exits[0].bearing + '. ';
    }
    return output;
}

module.exports = {
    showInv,
    help,
    travel,
    parseInputText,
    generateRoomDescription
}
