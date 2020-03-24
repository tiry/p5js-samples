
var NB_H_PER_DAYS=18;
var TIME_SCALE=5;

function now() {

    var m = Math.floor(frameCount/(fr*TIME_SCALE));
    var h = Math.floor(m/60);
    var d =  Math.floor(h/NB_H_PER_DAYS) % 7 +1;

    return { h: (m%NB_H_PER_DAYS), d:d}

}

class Schedule {

    constructor(person) {
        this.slots = [];
        this.owner = person;        
        this.currentDay=0;
    }

    _initIfNeeded() {
        if (now().d==this.currentDay) {
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
        this.currentDay=now().d;
    }

    _initChildScheldule() {        
        for (var i = 0; i < 6; i++) {
            this.slots[1+i] = this.owner.work;
        }
    }

    _initAdultScheldule() {        
        for (var i = 0; i < 6; i++) {
            this.slots[1+i] = this.owner.work;
        }
    }

    getTargetLocation() {
        this._initIfNeeded();
        return this.slots[now().h];
    }

}