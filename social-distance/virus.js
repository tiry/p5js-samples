
var VStats = function() {

    // statistics computed by visiting population
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
        if (p.virus.wasInfectious()) {
            vCount++;
            replicateCount+=p.virus.replicats;    
        }
        if (p.isDead()) {
          r.dead+=1;
        } else {
          if (p.virus.isRecovered()) {
            r.recovered++;
          } else {
            r.infected++;
            if (p.isInfectious()) {
              r.infectious+=1;
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

function initPandemic(nbInitialCases) {

    var infected=0;

    while (infected < nbInitialCases) {
        var target = Math.floor(Math.random()*people.length);
        if (!target.virus) {
            new Virus(people[target]);
            infected++;
        }
    }

}

class Virus {
  
    constructor(host) {

        host.virus = this;

        var age = host.age;
        
        // Virus lifecycle
        this.steps=[];        
        // incubation
        this.steps.push( Math.round(1*Math.random()));
        // infectiousNotSick
        this.steps.push(1 + Math.round(1*Math.random()));
        // sickness
        this.steps.push(1 + Math.round(2*Math.random()*(1+age/100)));

        // define if host will die
        this.kill = Math.random() < 1.5*this.getFatalityRate(age);
        if (this.kill) {
            console.log("Fatality!!!");
        }
        
        this.decal = Math.round(Math.random()*5*fr);

        // counter for lifespan inside host
        this.start = now().d;

        // counter for other hosts infected from current one
        // used to compute the resulting R0
        this.replicats=0;
    }

    infect(otherHost) {
        new Virus(otherHost);
        this.replicats++;
    }

    // return fatality rate based on age
    getFatalityRate(age) {
        if (age>85) {
            return 0.25;
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

    // return for how long current host was infected
    getDuration() {
        return (now(this.decal).d-this.start);
    }

    wasInfectious() {
        var d = this.getDuration();
        if (d >= this.steps[0]) {
            return true;
        }
        return false;
    }

    // lifecycle: is host currently infectious
    isInfectious() {
        var d = this.getDuration();
        if ((d >= this.steps[0]) && (d < (this.steps[0]+this.steps[1]+this.steps[2]))) {
            return true;
        }
        return false;
    }

    // lifecycle: is host currently sympthomatic
    isSick() {
        var d = this.getDuration();
        if ((d >= this.steps[0]+this.steps[1]) && (d < (this.steps[0]+this.steps[1]+this.steps[2]))) {
            return true;
        }
        return false;
    }

    // lifecycle: has host recovered
    isRecovered() {
      var d = this.getDuration();
      if (d >= (this.steps[0]+this.steps[1]+this.steps[2])) {
          return ! this.kill;
      }
    }

    isDead() {
        var d = this.getDuration();
        if (d >= (this.steps[0]+this.steps[1]+this.steps[2])) {
            return this.kill;
        }
    }
  


}
