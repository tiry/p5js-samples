



  
class Virus {
  
    constructor(host) {

        host.virus = this;

        var age = host.age;
        
        this.host = host;

        // Virus lifecycle
        this.steps=[];        
        // incubation
        this.steps.push( Math.round(1*NB_H_PER_DAYS*Math.random()));
        // infectiousNotSick
        this.steps.push(1 + Math.round(1*NB_H_PER_DAYS*Math.random()));
        // sickness
        this.steps.push(1 + Math.round(2*NB_H_PER_DAYS*Math.random()*(1+age/100)));

        // define if host will die
        this.kill = Math.random() < 1.5*this.getFatalityRate(age);

        // severe form will require ICU
        this.severeForm = Math.random() < 4*this.getFatalityRate(age);

        // counter for lifespan inside host
        this.start = now().t;

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

    _getStageDuration(n) {
        var duration=0;
        for (var i = 0; i <=n; i++) {
            duration+=this.steps[i];
        }
        return duration;
    }

    // return for how long current host was infected
    _getDuration() {
        return elaspsedHours(this.start);
    }

    getStage() {
        var d = this._getDuration();
        if (d < this._getStageDuration(0)) {
            return HealthState.INCUBATION;
        }
        else if (d >= this._getStageDuration(0) && d < this._getStageDuration(1)) {
            return HealthState.INFECTIOUS;
        }
        else if (d >= this._getStageDuration(1) && d < this._getStageDuration(2)) {
            return HealthState.SICK;
        }    
        return HealthState.RECOVERED;
    }

    isFatal() {
        return this.kill;
    }

    isSevereForm() {
        return this.severeForm;
    }

    wasInfectious() {
        var d = this._getDuration();
        if (d >= this._getStageDuration(0)) {
            return true;
        }
        return false;
    }

}
