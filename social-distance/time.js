/******** Basic Time Counter ********/

var NB_H_PER_DAYS=18;

var TIME_SCALE=2;

var timeCounter=0;

function tick() {    
    timeCounter=timeCounter+ speedSlider.value();
}

function elaspsedHours(tRef) {
    if (!tRef) {
        tRef=0;
    }
    var h = Math.floor((timeCounter-tRef) /(fr*TIME_SCALE));
    return h;
}

function now(decal) {

    if (!decal) {
        decal=0;
    }
    var h = elaspsedHours(-decal);
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
        if (this.owner.needsICU()) {
            this._initICUSchedule();
        } else {
            if (this.owner.icu) {
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
            icu = findFreeBedInICU(this.owner.home.tile);
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
        return d+i;
    }

    _fillSlots(start, duration, location) {
        for (var i = start; i <= Math.min(start+duration, NB_H_PER_DAYS-1); i++)
        {
            this.slots[i]=location;
        }
    }

    _initChildScheldule() {        

        if (Policies.shelterInPlace.isActive()) {
            return;
        }

        var endSchool=7;
        // school
        if (canGoTo(this.owner, this.owner.work)) {
            endSchool = this.initMonoLocation(this.owner.work, 2.9);
        }
        
        // go to the park
        if (Math.random()<0.8) {
            var park = findInNeighborhood(this.owner.home.tile, BType.PARK, 8);
            if (park!=null && canGoTo(this.owner, park)) {
                this._fillSlots(endSchool+2, 3, park);
            }
        } else if (Math.random()<0.5) {
            var shop = findInNeighborhood(this.owner.home.tile, BType.SHOP, 3);
            if (shop!=null && canGoTo(this.owner, shop)) {
                this._fillSlots(endSchool+2, 2, shop);
            }
        }
    }

    _initAdultScheldule() {   

        var d = Math.round(Math.random()*1.6);     
        var endWork = 7+d;
        if (canGoTo(this.owner, this.owner.work)) {
            for (var i = 0; i < endWork; i++) {
                this.slots[i+d] = this.owner.work;
            }    
        }

        if (Math.random()<0.5) {
            var shop = findInNeighborhood(this.owner.home.tile, BType.SHOP, 4);
            if (shop!=null && canGoTo(this.owner, shop)) {
                this._fillSlots(endWork+2, 2, shop);
            }
        }
        else if (Math.random()<0.5) {
            var venue = findInNeighborhood(this.owner.home.tile, BType.VENUE, 7);
            if (venue!=null && canGoTo(this.owner, venue)) {
                this._fillSlots(endWork+3, 5, venue);
            }
        }
        else if (Math.random()<0.5) {
            var restaurant = findInNeighborhood(this.owner.home.tile, BType.RESTAURANT, 5);
            if (restaurant!=null && canGoTo(this.owner, restaurant)) {
                this._fillSlots(endWork+4, 3, restaurant);
            }
        }
    }

    getTargetLocation() {
        this._initIfNeeded();
        return this.slots[now(this.decal).h];
    }

}