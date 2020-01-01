

var CST = {
    SPEED: [1,5],
    SIZE: [4,10],
    AGE: [80,200],
    MATURITY: [10,20],
    REPRO: [40,70],
    GESTATION: [40,70],
    NRJ:[5000,10000]
}

var MAX_SPEED=5;
var MIN_SPEED=1;

var MAX_SIZE=10;
var MIN_SIZE=4;

var MAX_AGE=200;
var MIN_AGE=80;

var MAX_MATURITY=20;
var MIN_MATURITY=10;

var MAX_REPRO=70;
var MIN_REPRO=40;

var MAX_GESTATION=20;
var MIN_GESTATION=5;

var MAX_NRJ=10000;
var MIN_NRJ=5000;

class DNA {



    constructor(father, mother) {            

        function avg(v1,v2) {
            return Math.round((v1+v2)/2);
        }

        function rnd_avg(v1,v2) {
            var ratio = Math.random();
            return Math.round(v1*ratio+v2*(1-ratio));   
        }

        function rnd_value(min, max) {
            return Math.round(min + Math.random() * (max- min));
        }

        function pick_one(v1,v2) {
            var ratio = Math.round(Math.random());
            return Math.round(v1*ratio+v2*(1-ratio));   
        }


        var mixMode=1;

        if (father != undefined && mother != undefined) {
            // mixing DNAs
            if (mixMode==0) {
                // random split
                this.speed = rnd_avg(father.speed, mother.speed);
                this.size = rnd_avg(father.size, mother.size);
                this.lifeSpan = rnd_avg(father.lifeSpan, mother.lifeSpan);
                this.maturity = rnd_avg(father.maturity, mother.maturity);
                this.gestation = rnd_avg(father.gestation ,mother.gestation);
                this.reproductionBoost = rnd_avg(father.reproductionBoost, mother.reproductionBoost);
                this.startEnergy = rnd_avg(father.startEnergy, mother.startEnergy);
            }
            else if (mixMode==1) {
                // pick one
                this.speed = pick_one(father.speed, mother.speed);
                this.size = pick_one(father.size, mother.size);
                this.lifeSpan = pick_one(father.lifeSpan, mother.lifeSpan);
                this.maturity = pick_one(father.maturity, mother.maturity);
                this.gestation = pick_one(father.gestation ,mother.gestation);
                this.reproductionBoost = pick_one(father.reproductionBoost, mother.reproductionBoost);
                this.startEnergy = pick_one(father.startEnergy, mother.startEnergy);
            }
            else {
                // default to 50% / 50%
                this.speed = avg(father.speed, mother.speed);
                this.size = avg(father.size, mother.size);
                this.lifeSpan = avg(father.lifeSpan, mother.lifeSpan);
                this.maturity = avg(father.maturity, mother.maturity);
                this.gestation = avg(father.gestation ,mother.gestation);
                this.reproductionBoost = avg(father.reproductionBoost, mother.reproductionBoost);
                this.startEnergy = avg(father.startEnergy, mother.startEnergy);
            }

            this.generation = Math.max(father.generation, mother.generation)+1;

        } else {
            
            // create random DNA
            this.speed = rnd_value(MIN_SPEED,MAX_SPEED);
            this.size = rnd_value(MIN_SIZE,MAX_SIZE);
            this.lifeSpan = rnd_value(MIN_AGE,MAX_AGE);
            this.startEnergy = rnd_value(MIN_NRJ,MAX_NRJ);
            this.maturity = rnd_value(MIN_MATURITY,MAX_MATURITY);
            this.gestation = rnd_value(MIN_GESTATION, MAX_GESTATION);
            this.reproductionBoost = rnd_value(MIN_REPRO,MAX_REPRO);

            this.generation = 1;        
        }

    }

    summary() {

    }
}

