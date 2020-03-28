
var VStats = function() {

    var r = {
      sain: 0,
      infected: 0,
      infectious: 0,
      sick: 0,
      recovered: 0,
      dead: 0
    }

    var vCount=0;
    var replicateCount=0;

    for (var i=0; i < people.length; i++) {

      var p = people[i];
      if (p.virus) {
        vCount++;
        replicateCount+=p.virus.replicats;
        if (p.dead) {
          r.dead+=1;
        } else {
          if (p.virus.isRecovered()) {
            r.recovered++;
          } else {
            r.infected++;
            if (p.isInfectious()) {
              r.infected+=1;
            }
            if (p.isSick()) {
              r.sick+=1;
            }  
          }
        }
      } else {
        r.sain+=1;
      }
    }

    // compute actual R0
    r.r0=replicateCount/vCount;

    return r;

}

class Virus {
  
    constructor(host) {
        
        var age = host.age;
        
        this.targetVictims = Math.round(r0*2*Math.random());

        this.steps=[];
        
        // incubation
        this.steps.push(1 + Math.round(2*Math.random()));
        // infectiousNotSick
        this.steps.push(2 + Math.round(3*Math.random()));
        // sickness
        this.steps.push(3 + Math.round(3*Math.random()*(1+age/100)));

        this.kill = Math.random() < this.getFatalityRate(age);
        
        this.days=0;

        this.start = now().t;
        this.replicats=0;
    }

    infect(otherHost) {
        otherHost.virus = new Virus(otherHost.age);
        this.replicats++;
    }

    getFatalityRate(age) {
        if (age>85) {
            return 0.25;
        } else if (age>75) {
            return 0.10;
        } else if (age>75) {
            return 0.10;
        } else if (age>65) {
            return 0.05;
        } else if (age>55) {
            return 0.025;
        } else if (age>45) {
            return 0.008;
        } else if (age>20) {
            return 0.002;
        } 
        return 0;
    }

    getDuration() {
        (now().t-this.start)/NB_H_PER_DAYS;
    }

    isInfectious() {
        var d = this.getDuration();
        if ((d >= this.steps[0]) && (d < (this.steps[0]+this.steps[1]+this.steps[2]))) {
            return true;
        }
        return false;
    }

    isSick() {
        var d = this.getDuration();
        if ((d >= this.steps[0]+this.steps[1]) && (d < (this.steps[0]+this.steps[1]+this.steps[2]))) {
            return true;
        }
        return false;
    }

    isRecovered() {
      var d = this.getDuration();
      if ((d >= (this.steps[0]+this.steps[1]+this.steps[2]))) {
          return ! this.kill;
      }
    }

}
