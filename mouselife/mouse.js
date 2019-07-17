
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

var LIFE_COST = 0.01;

var MAX_GESTATION=20;
var MIN_GESTATION=5;

var GESTATION = 8;

var MAX_NRJ=10000;
var MIN_NRJ=5000;

var MAX_POPULATION=1000;
var MAX_FOOD=1000;

var RECYCLING_RATIO=4;
var FOOD_GROWTH = 0.01;

var TIME_INC = 0.1;

var TRACKING_RATIO = 0.25;

function dnaExpress() {
    return 0.3 + Math.random(1);
}

class Space {

    constructor(x,y, mouses, food) {        
        
        this.w = x;
        this.h = y;

        this.mouses =[];
        for (var i = 0; i < mouses; i++ ) {
            this.mouses.push(new Mouse(this));
        }

        this.food = [];
        for (var i = 0; i < food; i++ ) {
            this.food.push(new Food(this));
        }

    }

    dead() {
        return this.mouses.length==0;
    }

    click(pos) {

        console.log(pos);
        for (var i = 0; i < this.mouses.length; i++) {
            this.mouses[i].toggleSelect(pos);
        }

    }

    updateAndDraw(paused) {

        var toRemove=[];

        var generation=0;

        this.mouses.forEach( function (mouse, index) {

            if (!paused) {
                mouse.live();    
            }            
            if (!paused && mouse.decomposed()) {
                toRemove.push(index);                
            } else {
                mouse.draw();    
                if (mouse.gnome.generation > generation) {
                    generation = mouse.gnome.generation;
                }
            }
            
        });

        toRemove.sort();
        toRemove.reverse();
        for (var i = 0; i < toRemove.length; i++) {
            this.mouses.splice(toRemove[i],1);
        }


        var foodToRemove=[];
        var totalFood=0;
        this.food.forEach( function (food, index) {
            food.draw();
            if (food.eaten) {
                foodToRemove.push(index);
            } else {
                totalFood+=food.size;
            }                
        });

        foodToRemove.sort();
        foodToRemove.reverse();
        for (var i = 0; i < foodToRemove.length; i++) {
            this.food.splice(foodToRemove[i],1);
        }        

        fill(0, 0, 0);
        textSize(24);
        text('population:', 10, 30);
        text(this.mouses.length, 130, 30);

        text('food:', 10, 60);
        text(this.food.length, 130, 60);

        text('generation:', 10, 90);
        text(generation, 130, 90);

        if (this.food.length < MAX_FOOD && !paused) {
            var newFoodVolume = totalFood*FOOD_GROWTH;
            while (newFoodVolume > 0) {
                var f = new Food(this);
                newFoodVolume-=f.size;
                this.food.push(f);
            }        
        }
    }
}

class DNA {

    constructor(father, mother) {            

        if (father != undefined && mother != undefined) {
            this.speed = Math.round((father.speed + mother.speed)/2);
            this.size = Math.round((father.size + mother.size)/2);
            this.lifeSpan = Math.round((father.lifeSpan + mother.lifeSpan)/2);
            this.maturity = Math.round((father.maturity + mother.maturity)/2);
            this.gestation = Math.round((father.gestation + mother.gestation)/2);
            this.reproductionBoost = Math.round((father.reproductionBoost + mother.reproductionBoost)/2);
            this.startEnergy = Math.round((father.startEnergy + mother.startEnergy)/2);
            this.generation = Math.max(father.generation, mother.generation)+1;
        } else {
            this.speed = Math.round(MIN_SPEED + Math.random() * (MAX_SPEED- MIN_SPEED));
            this.size = Math.round(MIN_SIZE + Math.random() * (MAX_SIZE- MIN_SIZE));
            this.lifeSpan = Math.round(MIN_AGE + Math.random() * (MAX_AGE- MIN_AGE));
            this.startEnergy = Math.round(MIN_NRJ + Math.random() * (MAX_NRJ- MIN_NRJ));
            this.maturity = Math.round(MIN_MATURITY + Math.random() * (MAX_MATURITY- MIN_MATURITY));
            this.gestation = Math.round(MIN_GESTATION + Math.random() * (MAX_GESTATION- MIN_GESTATION));
            this.reproductionBoost = Math.round(MIN_REPRO + Math.random() * (MAX_REPRO- MIN_REPRO));
            this.generation = 1;        
        }

    }

    summary() {

    }
}


var mousePolulation=0;

function incMousePolulation() {
    return mousePolulation++;
}

class Mouse {

    constructor(space, gnome, x, y) {        

        if (gnome===undefined) {
            this.gnome = new DNA();
        } else {
            this.gnome = Object.assign({}, gnome);    
        }

        // speed
        var dx = Math.round(Math.random()) * 2 - 1;
        var dy = Math.round(Math.random()) * 2 - 1;
        this.speed = createVector(dx*this.gnome.speed * dnaExpress(),dy * this.gnome.speed * dnaExpress());

        // start size        
        this.size = Math.round(this.gnome.size * dnaExpress());
                
        this.age = Math.round(1 + Math.random()*5);

        this.lifeSpan = Math.round(this.gnome.lifeSpan * dnaExpress());

        this.reproductionBoost = Math.round(this.gnome.reproductionBoost * dnaExpress());

        this.energy = Math.round(this.gnome.startEnergy * dnaExpress());

        this.alive = true;
        this.gestation=0;

        this.dbg={'target':null, 'targetLabel':null, 'old_speed':null, 'delta': null};

        if (x === undefined || y == undefined) {
            this.pos = createVector(space.w * Math.random(),space.h*Math.random());
        } else {
            this.pos = createVector(x,y);
        }

        this.space = space;

        this.sex = Math.round(Math.random());

        this.uuid= incMousePolulation();
        this.selected=false;
    }
    

    toggleSelect(v) {

        if (v.dist(this.pos) < this.size/2) {
            this.selected=!this.selected;
        }
        
    }

    _chooseFoodOverReproduction(foodScore, reproductionScore) {

        // reproduction need increases with age as a sinusiod
        reproductionScore = (1+this.reproductionBoost/100) * reproductionScore * Math.sin(Math.PI* this.age / this.lifeSpan);
        
        // food is more important if low energy
        foodScore = foodScore * (this.gnome.startEnergy/this.energy)

        // if there is a lot of food, no need to look for it 
        if (this.space.food.length > this.space.mouses.length) {
            reproductionScore=reproductionScore*2;
        }

        return foodScore>reproductionScore;

    }

    _lookAround() {

        // look for partners ?
        var maxAttraction=0;
        var targetPartner=-1;

        if (this.gestation>0) {
            this.gestation--;
        } else {
            for (var i = 0; i < this.space.mouses.length; i++) {
                var att = this._computeAttraction(this.space.mouses[i]);
                if (att > maxAttraction) {
                    maxAttraction = att;
                    targetPartner=i;
                }
            }
        }

        // look for food ?
        var maxFood=0;
        var targetFood=-1;
        for (var i = 0; i < this.space.food.length; i++) {
            var att = this._computeFoodAttraction(this.space.food[i]);
            if (att > maxFood) {
                maxFood = att;
                targetFood=i;
            }
        }

        this.dbg.old_speed = this.speed.copy();

        var target;
        if (this._chooseFoodOverReproduction(maxFood,maxAttraction)) {
                // let's go eat!
                target = this.space.food[targetFood];
                this.dbg.targetLabel = "food => (" + target.pos.x + "," + target.pos.y + ")";

        } else {
                // let's mate
            if (targetPartner>=0) {
                target = this.space.mouses[targetPartner];
                this.dbg.targetLabel = "mate => (" + target.pos.x + "," + target.pos.y + ")";

            }
        }

        if (target) {
                //compute resulting speed

                var delta = createVector(target.pos.x-this.pos.x, target.pos.y - this.pos.y);
                this.dbg.delta = delta.copy();

                var newV = p5.Vector.mult(this.speed, 1-TRACKING_RATIO).add(delta.mult(TRACKING_RATIO));

                //normalize
                var v = this.speed.mag();
                newV.mult(v/newV.mag());

                this.dbg.old_speed = this.speed.copy();
                this.speed = newV;
                this.dbg.target = target;
        }                

        // cap on size 

        if (this.energy> 2* MAX_NRJ) {
            this.energy = 2* MAX_NRJ;
        }
        if (this.size> 2* MAX_SIZE) {
            this.size = 2* MAX_SIZE;
        }
    }


    _reproduce(other) {

        if (this.space.mouses.length> MAX_POPULATION) {
            return;
        }

        var cloningEnergy = (this.energy + other.energy)/2 + (this.size+other.size)/3;
        var availableEnergy = cloningEnergy;

        var nbChildren=0;
        while (availableEnergy>0 && nbChildren < 5 ) {

            var nrj = Math.round((this.gnome.startEnergy + other.gnome.startEnergy)/2);

            if (nrj > availableEnergy) {
                nrj = availableEnergy;
                availableEnergy=0;
            } else {
                availableEnergy = availableEnergy-nrj;
            }

            var newDNA = new DNA(this.gnome, other.gnome);
            newDNA.startEnergy = nrj;
            this.space.mouses.push(new Mouse(this.space, newDNA , this.pos.x, this.pos.y));
            nbChildren++;

        }

        this.gestation = Math.round(this.gnome.gestation * nbChildren/2);
        other.gestation = Math.round(other.gnome.gestation * nbChildren/2);

        this.energy=Math.round(this.energy /2);
        other.energy=Math.round(other.energy /2);

        this.size=Math.round(this.size*(1-1/3));
        other.size=Math.round(other.size*(1-1/3));

    }

    mature() {
        return this.age > this.gnome.maturity;
    }

    _computeAttraction(other) {

        if (other.uuid==this.uuid) {
            return 0;
        }

        if (this.space.mouses.length> MAX_POPULATION) {
            return 0;
        }

        //check collision
        if (other.pos.dist(this.pos) < (other.size/2+this.size/2+2)) {

            // elastic collision                            
            var v1 = p5.Vector.add(p5.Vector.mult(other.speed,(other.size-this.size)/(other.size+this.size)), p5.Vector.mult(this.speed,(2*this.size)/(other.size+this.size)));
            var v2 = p5.Vector.add(p5.Vector.mult(this.speed,(this.size-other.size)/(other.size+this.size)), p5.Vector.mult(other.speed,(2*other.size)/(other.size+this.size)));
            other.speed=v1;
            this.speed=v2;
            var moveAway=10;
            while(other.pos.dist(this.pos) < (other.size+this.size) && moveAway>0) {
                other.pos.add(p5.Vector.mult(other.speed,0.1));
                this.pos.add(p5.Vector.mult(this.speed,0.1));
                moveAway--;
            }

            if (other.mature() && other.sex != this.sex && other.gestation==0) {
                this._reproduce(other);
                return 0;
            }
            return 0;

        }

        if (!other.mature() || other.sex == this.sex) {
            return 0;
        }

        return (other.size + other.energy) / Math.pow(other.pos.dist(this.pos), 2);
    }

    _computeFoodAttraction(food) {

        // eat is within reach
        if (food.pos.dist(this.pos) < (food.size/2+this.size/2+2)) {
            this.energy+=Math.round(food.size*0.7);
            this.size+=Math.round(food.size*0.25);
            food.eat();
            return 0;
        }

        return food.size  / Math.pow(food.pos.dist(this.pos), 2);
    }

    live() {

        if (!this.alive) {            
            return false;
        }

        this.age+=TIME_INC;

        // update direction ?
        this._lookAround();

        // move
        this.pos.add(this.speed);
        
        // consume energy 
        this.energy -= Math.round(LIFE_COST * (this.size * 0.5*this.speed.magSq()));

        if (this.energy<0 || this.age > this.lifeSpan) {
            this.alive=false;
            this.countDown = Math.round(MIN_AGE /5);
            return false;
        }

        // loop boundaries
        if (this.pos.x > this.space.w) {
            this.pos.x= 0;
        } else if (this.pos.x < 0) {
            this.pos.x = this.space.w;
        }
        if (this.pos.y > this.space.h) {
            this.pos.y= 0;
        } else if (this.pos.y < 0) {
            this.pos.y = this.space.h;
        }
                        
        return true;
    }

    decomposed() {

        if (this.alive) {
            return false;
        }
        if (this.countDown-- < 0) {

            this.space.food.push(new Food(this.space,this.size/RECYCLING_RATIO, this.pos.x, this.pos.y));
            return true;
        }
        return false;
    }

    draw() {

        var mouseColor;

        if (!this.alive) {
            mouseColor=color(100,100,100);                    
        } else {

            if (!this.mature()) {
                if (this.sex==0) {                
                    mouseColor=color(0,200,0);                    
                } else {
                    mouseColor=color(0,255,0);                    
                }
            } else if (this.gestation>0) {
                if (this.sex==0) {                
                    mouseColor=color(150,0,200);                    
                } else {
                    mouseColor=color(255,0,200);                    
                }
            } else {
                if (this.sex==0) {                
                    mouseColor=color(0,0,200);                    
                } else {
                    mouseColor=color(255,182,193);                    
                }
            }
        }

        if (this.selected) {
            this.displayDetails();
        } else {
            noStroke();    
        }  
        fill(mouseColor);
        //circle(this.pos.x, this.pos.y, this.size);
        this.drawBody(mouseColor);

   }

   drawBody(mouseColor) {

    push();

    fill(mouseColor);
    translate(this.pos.x,this.pos.y);

    var x1 = 0;
    var y1 = this.size;

    var x2 = this.size /1.4;
    var y2 = -this.size;

    var x3 = -this.size /1.4;
    var y3 = -this.size;

    
    if (this.speed.x!=0) {
        var alpha = -Math.sign(this.speed.x)* PI/2;
        alpha = alpha - Math.atan(-this.speed.y/this.speed.x);
        rotate(alpha);
    }

    triangle(x1,y1,x2,y2,x3,y3);

    fill(color(255,255,255));
    stroke(mouseColor);

    var xe2 = this.size /4  + (this.size /1.4)*0.15;
    var ye =  - this.size * (0.15/2);
    circle(xe2,ye,this.size /4);
    
    var xe3 = -this.size /4  - (this.size /1.4)*0.15;
    circle(xe3,ye,this.size /4);

    pop();

   }


   displayDetails() {

        var x = this.pos.x;
        var y = this.pos.y;

        stroke("#999999");
        fill(color(225,225,225))
        rect(x, y, 100, 200);

        x+=5;
        y+=15;
        noStroke();    
        fill(0, 0, 0);
        textSize(10);
        text("id   : " + this.uuid, x,y);
        y+=10;
        text("nrj   : " + this.energy, x,y);
        y+=10;
        text("age   : " + Math.round(this.age) + " / " + this.lifeSpan, x,y);
        y+=10;
        text("size  : " + this.size, x,y);
        y+=10;
        text("speed : " + this.speed.mag().toFixed(1), x,y); 
        y+=10;
        text("target: " + this.dbg.targetLabel,x,y);


        stroke('#DDDDDD');
        if (this.dbg.old_speed) {
            line(this.pos.x, this.pos.y, this.pos.x + 5*this.dbg.old_speed.x, this.pos.y + 5*this.dbg.old_speed.y);
        }
 
        stroke('green');
        if (this.dbg.delta) {
            line(this.pos.x, this.pos.y, this.pos.x + this.dbg.delta.x, this.pos.y + this.dbg.delta.y);
            fill("#DDDDDD");
            circle(this.dbg.target.pos.x, this.dbg.target.pos.y, 3);
        }

        stroke('red');
        line(this.pos.x, this.pos.y, this.pos.x + 10*this.speed.x, this.pos.y + 10*this.speed.y);



   }
}