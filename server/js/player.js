const utils = require('./utils.js');

class Player {
    constructor() {
        this.room = utils.parseJSON(__dirname, '../json/locs.json')[1];
        this.itemList = utils.parseJSON(__dirname, '../json/items.json');
        this.interList = utils.parseJSON(__dirname, '../json/inters.json');
        this.locationList = utils.parseJSON(__dirname, '../json/locs.json');

        this.location = 1;
        this.start = true;
        this.inventory = [];
        
    }

    takeItem(item) {
        for (i = 0; i < this.locationList[this.location].items.length; i++) {
            if (item == this.locationList[this.location].items[i].id) {
                this.locationList[this.location].items.splice(i, 1);
                for (let j = 0; j < this.inventory.length; i++) {
                    if (item == this.inventory[j][0]) {
                        this.inventory[j][1]++;
                        inInv = true;
                    }
                } if (inInv == false) {
                    this.inventory.push([item, 1]);
                }
            }
        }
    /**
    * Check if an item in the room has the same ID as the given item
    * Then remove it from the room
    * If same type of item is in inventory then increment counter for it by 1
    * Else push item to inventory
    */
    }
    
    dropItem(item) {
        const itemObject = {
            id: item.id,
            loc: 'on the floor',
        };
        for (i = 0; i < this.inventory.length; i++) {
            if (item.id == this.inventory[i].id) {
                this.inventory.splice(i, 1);
                this.locationList[this.location].items.push(itemObject);
            }
        }
    /**
     * Create item object
     * Check inventory for item
     * If it exists then remove it from inventory then push item
     * object to room
     * TODO: Make dropItem() only drop one item if there are multiple in inventory
     */
    }

    travel(direction) {
        for (let i = 0; i < this.room.exits.length; i++) {
            if (this.room.exits[i].bearing.toUpperCase() == direction) {
                this.location = this.room.exits[i].id;
                this.room = this.locationList[this.location];
            }
        }
    }

}

module.exports = Player;