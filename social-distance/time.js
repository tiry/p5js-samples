/******** Basic Time Counter ********/

var NB_H_PER_DAYS=18;
var TIME_SCALE=2;

var timeCounter=0;

function tick() {    
    timeCounter++;
}

function now(decal) {

    if (!decal) {
        decal=0;
    }
    var h = Math.floor((timeCounter+decal) /(fr*TIME_SCALE));
    var d =  Math.floor(h/NB_H_PER_DAYS);
    var wd = d % 7 +1

    return { h: (h%NB_H_PER_DAYS), d:d, weekDay:wd, t:timeCounter}
}

/******** Schedule Management ********/

function findInNeighborhood(person, type, range) {
    var candidates = person.home.tile.getNeighborhood(range);
    for (var i = 0; i < candidates.length; i++ ) {
        for (var j = 0; j < candidates[i].children.length; j++ ) {
            if (candidates[i].children[j].type==type) {
                return candidates[i].children[j];
            }
        }
    }
    return null;
}

// Each individual is assigned a schedule 
// that defines where to go during each time slots
class Schedule {

    constructor(person) {
        this.slots = [];
        this.owner = person;        
        this.currentDay=0;
        this.decal=Math.round(Math.random()*10*fr);
    }

    _initIfNeeded() {
        if (now().weekDay==this.currentDay) {
            return;
        }
        this.slots = [];
        for (var h=0; h < NB_H_PER_DAYS; h++) {
            this.slots.push(this.owner.home);
        }

        if (this.owner.age < 20) {
            this._initChildScheldule();
        } else if (this.owner.work!=null) {
            this._initAdultScheldule();
        }
        this.currentDay=now().weekDay;
    }

    _initChildScheldule() {        
        var d = Math.round(Math.random()*1.9);     
        for (var i = 0; i < 5+d; i++) {
            this.slots[d+i] = this.owner.work;
        }
    }

    _initAdultScheldule() {   
        var d = Math.round(Math.random()*1.6);     
        var endWork = 7+d;
        for (var i = 0; i < endWork; i++) {
            this.slots[i+d] = this.owner.work;
        }

        if (Math.random()<0.5) {
            var shop = findInNeighborhood(this.owner, BType.SHOP, 2);
            if (shop!=null) {
                this.slots[endWork+2]=shop;
                this.slots[endWork+3]=shop;
            }
        }
        else if (Math.random()<0.4) {
            var venue = findInNeighborhood(this.owner, BType.VENUE, 4);
            if (venue!=null) {
                this.slots[endWork+3]=venue
                this.slots[endWork+4]=venue;
                this.slots[endWork+5]=venue;
            }
        }
    }

    getTargetLocation() {
        this._initIfNeeded();
        return this.slots[now(this.decal).h];
    }

}