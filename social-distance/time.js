/******** Basic Time Counter ********/

var NB_H_PER_DAYS=18;

var TIME_SCALE=2;

var timeCounter=0;

function tick() {    
    timeCounter=timeCounter+ speedSlider.value();
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


// Each individual is assigned a schedule 
// that defines where to go during each time slots
class Schedule {

    constructor(person) {
        this.slots = [];
        this.owner = person;        
        this.currentDay=0;
        this.decal=Math.round(Math.random()*5*fr);
        this.frozen=false;
    }

    initialize() {
        this.slots = [];
        for (var h=0; h < NB_H_PER_DAYS; h++) {
            this.slots.push(this.owner.home);
        }
    }

    updateTarget(oldLoc, newLoc) {
        for (var h=0; h < NB_H_PER_DAYS; h++) {
            if (this.slots[h]._id==oldLoc._id) {
                this.slots[h]=newLoc;
            }
        }
    }
    _initIfNeeded() {
        if (now().weekDay==this.currentDay || this.frozen ) {
            return;
        }
        
        this.initialize();

        if (this.owner.virus && this.owner.needsICU()) {
            this._initICUSchedule();
        } else {
            if (this.owner.icu) {
                this.owner.icu.icubeds++;
                this.owner.icu=null;
            }
            if (this.owner.age < 20) {
                this._initChildScheldule();
            } else if (this.owner.work!=null) {
                this._initAdultScheldule();
            }
        }
        this.currentDay=now().weekDay;
    }

    _initICUSchedule(){
        var icu = this.owner.icu;
        if (!icu) {
            icu = findFreeBedInICU(this.home.tile);
        }
        if (icu) {
            for (var h=0; h < NB_H_PER_DAYS; h++) {
                this.slots[h]=icu;
            }   
            this.owner.icu = icu; 
        } else {
            console.log("Unable to find ICO Bed");
        }
    }

    initMonoLocation(loc, delay) {
        var d = Math.round(Math.random()*delay);     
        for (var i = 0; i < 5+d; i++) {
            this.slots[d+i] = loc;
        }
    }

    _initChildScheldule() {        
        this.initMonoLocation(this.owner.work, 2.9);
    }

    _initAdultScheldule() {   
        var d = Math.round(Math.random()*1.6);     
        var endWork = 7+d;
        for (var i = 0; i < endWork; i++) {
            this.slots[i+d] = this.owner.work;
        }

        if (Math.random()<0.5) {
            var shop = findInNeighborhood(this.owner.home.tile, BType.SHOP, 2);
            if (shop!=null) {
                this.slots[endWork+2]=shop;
                this.slots[endWork+3]=shop;
            }
        }
        else if (Math.random()<0.4) {
            var venue = findInNeighborhood(this.owner.home.tile, BType.VENUE, 4);
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