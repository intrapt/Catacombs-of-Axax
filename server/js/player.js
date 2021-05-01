const fs = require('fs'),
    path = require('path'),
    util = require(path.join(__dirname, './utils.js'));

function newPlayer(socket) {
    let player = {
        locationList = util.parseJSON(__dirname, '../json/locs.json'),
        itemList = util.parseJSON(__dirname, '../json/items.json'),
        interList = util.parseJSON(__dirname, '../json/inters.json'),
        start = true,
        inventory = [],
        location = 1,
        changeLocation = (newLocation) => {
            location = newLocation;
        },
        takeItem = (item) => {
            let inInv = false;
            for (i = 0; i < locationList[location].items.length; i++) {
                if (item = locationList[location].items[i].id) {
                    locationList[location].items.splice(i, 1);
                    for (let j = 0; j < inventory.length; i++) {
                        if (item == inventory[j][0]) {
                            inventory[j][1]++;
                            inInv = true;
                        }
                    } if (inInv == false) {
                        inventory.push([item, 1]);
                    }
                }
            }
        },
    };

    socket.emit('newText', roomDesc(socket));
    return player;
}

module.exports = {
    newPlayer
}