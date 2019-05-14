var wx= 800 ;
var wy= 600;

var rebound=0.92;


class Ball {

    constructor(x,y,m) {

        this.position=createVector(x,y);
        this.m=m;
        this.speed = createVector(0,0);        
        this.forceField=[];
        this.forces=[];
        this.r=m;
        this.color= color(55+200*Math.random(),55+200*Math.random(),55+200*Math.random());
        this.frame=0;
    }

    setForceField(forces) {
        this.forceField=forces;
    }


    applyForce(force) {
        this.forces.push(force);
    }

    _computeAcceleration() {

        var a = createVector(0,0);

        var f=[];
        f.push(...this.forceField);
        f.push(...this.forces);

        for (var i=0; i <f.length; i++) {
            a.add(f[i]);
        }
        a.div(this.m);
        
        return a;
    }

    _checkCollisions() {

        if (this.position.y<this.r/2 && this.speed.y <0) {
            this.speed.y= -rebound * this.speed.y;
            this.speed.x= rebound * this.speed.x;
            this.position.y=this.r/2;
        } 
        
        if (this.position.x<this.r/2 && this.speed.x <0) {
            this.speed.x= -rebound * this.speed.x;
            this.speed.y= rebound * this.speed.y;
        } else if (this.position.x>wx-this.r/2 && this.speed.x >0) {
            this.speed.x= -rebound   * this.speed.x;
            this.speed.y= rebound * this.speed.y;
        }   
        


    }

    _checkStopped(){
        var v = Math.sqrt(this.speed.x**2+this.speed.y**2);
        if (v<0.2 && this.frame>500) {
            this.speed = createVector(0,0);   
            this.color=color(0,255,0);     
        }
    }

    update(){
        this.frame++;
        var a = this._computeAcceleration();        
        this.speed.add(a);
        this.position.add(this.speed);
        this.forces=[];
        this._checkCollisions();
        //this._checkStopped();
    }

    draw(){
        //console.log(this.position.x,this.position.y,this.r)
        fill(this.color);
        ellipse(this.position.x,-this.position.y,this.r);
    }

}


var balls=[];


function createBall() {
    b = new Ball(Math.random()*wx,Math.random()*(wy-100)+100,Math.random()*35+5);
    b.setForceField([createVector(0,-9.8)]);
    b.applyForce(createVector(Math.random()*80,Math.random()*20));

    return b;
}

function setup (){
    createCanvas(wx,wy);
}

var frame=0;

function dotp(v1,v2) {
    return v1.x*v2.x + v1.y*v2.y;
}

function subv(v1,v2) {
    return createVector(v1.x-v2.x,v1.y-v2.y);
}

function _checkCollision(b1,b2){

    var min = b1.r/2 + b2.r/2;

    var dx = Math.abs(b1.position.x-b2.position.x);
    var dy = Math.abs(b1.position.y-b2.position.y);    
    var dist = Math.sqrt(dx**2+dy**2);

    if (dist < min+1) {

        var cr1 = (b1.color.levels[0]+(b2.m/b1.m)*b2.color.levels[0])*(1/(1+b2.m/b1.m));
        var cg1 = (b1.color.levels[1]+(b2.m/b1.m)*b2.color.levels[1])*(1/(1+b2.m/b1.m));
        var cb1 = (b1.color.levels[2]+(b2.m/b1.m)*b2.color.levels[2])*(1/(1+b2.m/b1.m));
        
        var cr2 = (b2.color.levels[0]+(b1.m/b2.m)*b1.color.levels[0])*(1/(1+b1.m/b2.m));
        var cg2 = (b2.color.levels[1]+(b1.m/b2.m)*b1.color.levels[1])*(1/(1+b1.m/b2.m));
        var cb2 = (b2.color.levels[2]+(b1.m/b2.m)*b1.color.levels[2])*(1/(1+b1.m/b2.m));
        
        b1.color= color(cr1,cg1,cb1);
        b2.color= color(cr2,cg2,cb2);

        // https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
        var mratio = 2*b2.m/(b1.m+b2.m);
        var deltav = subv(b1.position, b2.position);
        var vratio = dotp(subv(b1.speed, b2.speed), deltav);
        var d = deltav.x**2 + deltav.y**2;
        var bv1=subv(b1.speed, deltav.mult(mratio*(vratio/d)));

        mratio = 2*b1.m/(b1.m+b2.m);
        deltav = subv(b2.position, b1.position);
        vratio = dotp(subv(b2.speed, b1.speed), deltav);
        d = deltav.x**2 + deltav.y**2;
        var bv2=subv(b2.speed, deltav.mult(mratio*(vratio/d)));

        // update new speeds
        b1.speed=bv1;
        b2.speed=bv2;

        // energy loss
        b1.speed.mult(rebound);
        b2.speed.mult(rebound);

        // adjust positions
        var nbadjust=0;
        while (dist < min && nbadjust<10) {

            nbadjust++;
            var miss = Math.abs(min-dist);
            var ratio = miss/ Math.sqrt(b1.speed.x**2+b1.speed.y**2);
            if (ratio < 0.0001) {
                ratio = 0.0001;
            } else if (ratio >2) {
                ratio=2;
            }
            b1.position.x += b1.speed.x*ratio;
            b1.position.y += b1.speed.y*ratio;

            ratio = miss/ Math.sqrt(b2.speed.x**2+b2.speed.y**2);
            if (ratio < 0.0001) {
                ratio = 0.0001;
            } else if (ratio >0.2) {
                ratio=0.2;
            }

            b2.position.x += b2.speed.x*ratio;
            b2.position.y += b2.speed.y*ratio;

            dx = Math.abs(b1.position.x-b2.position.x);
            dy = Math.abs(b1.position.y-b2.position.y);    
            dist = Math.sqrt(dx**2+dy**2);
        }
    }

}
function checkCollisions(){

    for (var i=0;i < balls.length; i++) {
        var b1 = balls[i];
        for (var j=i+1;j < balls.length; j++) {
            var b2 = balls[j];
            _checkCollision(b1,b2);
        }
    }
}

function draw(){
    //Background
    background(200, 200, 220);

    translate(0,wy);

    for (var i=0;i < balls.length; i++) {
        balls[i].update();
        balls[i].draw();    
    }

    checkCollisions();

    frame++;
    if (frame%15==0 && balls.length<200) {
        balls.push(createBall());
    }

    
}

