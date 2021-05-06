const parseJSON = require('./utils.js').parseJSON;

function newPlayer() {
    let player = {
        locationList: parseJSON(__dirname, '../json/locs.json'),
        itemList: parseJSON(__dirname, '../json/items.json'),
        interList: parseJSON(__dirname, '../json/inters.json'),
        start: true,
        inventory: [],
        location: 1,
        room: parseJSON(__dirname, '../json/locs.json')[1],
        takeItem: (item) => {
            let inInv = false;
            for (i = 0; i < locationList[location].items.length; i++) {
                if (item == locationList[location].items[i].id) {
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
    /**
    * Check if an item in the room has the same ID as the given item
    * Then remove it from the room
    * If same type of item is in inventory then increment counter for it by 1
    * Else push item to inventory
    */
        },
        dropItem: (item) => {
            const itemObject = {
                id: item.id,
                loc: 'on the floor',
            };
            for (i = 0; i < inventory.length; i++) {
                if (item.id == inventory[i].id) {
                    inventory.splice(i, 1);
                    locationList[location].items.push(itemObject);
                }
            }
    /**
     * Create item object
     * Check inventory for item
     * If it exists then remove it from inventory then push item
     * object to room
     * TODO: Make dropItem() only drop one item if there are multiple in inventory
     */
        },
    };

    return player;
}

module.exports = {
    newPlayer
}
