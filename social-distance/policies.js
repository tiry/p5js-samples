
var Policies={
    all: []}


class Policy {

    constructor(label) {
        this.label=label;
        this.active=false;
        this._id = Policies.all.length;
        Policies.all.push(this);   
    }

    isActive() {
        return this.active;
    }

    toggleActive() {
        this.active=!this.active;
        return this.isActive();
    }
    canGoTo (person, loc) {
        return true;
    }
}

Policies.quarantineSicks=new Policy("Quarantine Sicks");
Policies.quarantineSicks.canGoTo = function (person, loc) {

    if (person.isSick()) {
        if (person.home._id==loc._id) {
            return true;
        }
        if (loc.type==BType.HOSPITAL) {
            return true;
        }
        return false;
    
    } else {
        return true;
    }
}

Policies.closeSchools = new Policy("Close Schools");
Policies.closeSchools.canGoTo = function (person, loc) {

    if (person.work._id==loc._id) {        
        if (person.work.type==BType.SCHOOL) {
            return false;
        }
    }
    return true;
}


Policies.closeBarsAndRestaurants = new Policy("Close Restaurants and Bars");
Policies.closeBarsAndRestaurants.canGoTo = function (person, loc) {
    if (loc.type==BType.RESTAURANT) {
        return false;
    }
    return true;
}


Policies.closeVenues = new Policy("Close All Venues");
Policies.closeVenues.canGoTo = function (person, loc) {
    if (loc.type==BType.VENUE) {
        return false;
    }
    return true;
}

Policies.closeParks= new Policy("Close Parks");
Policies.closeParks.canGoTo = function (person, loc) {
    if (loc.type==BType.PARK) {
        return false;
    }
    return true;
}

Policies.workFromHome=new Policy("Work From Home");
Policies.workFromHome.canGoTo = function (person, loc) {

    if (person.work._id==loc._id) {        
        if (person.work.type==BType.COMPANY) {
            // can work from home !
            return false;
        }
    }
    return true;
}


Policies.shelterInPlace=new Policy("Shelter In Place");
Policies.shelterInPlace.canGoTo = function (person, loc) {

    if (person.home._id==loc._id) {
        return true;
    }

    if (person.work._id==loc._id) {
        return person.work.critical;
    }

    if (loc.critical) {
        return true;
    }
    return false;
}


function setupPolicyUI() {

    for (var i = 0 ; i < Policies.all.length; i++) {
        var policy = Policies.all[i];

        var cb = createCheckbox(policy.label, policy.isActive());

        // pff!
        var closure = function(p) {
            return function (e) {
                p.toggleActive();
            }
        }
        cb.changed(closure(policy));

        cb.position(w +10, 200+20*i);
        policy.cb = cb;
    }
}

function canGoTo(person, loc) {

    for (var i = 0 ; i < Policies.all.length; i++) {
        var policy = Policies.all[i];
        if (policy.isActive()) {
            if (!policy.canGoTo(person, loc)) {         
                return false;
            }
        }
    }
    return true;
}