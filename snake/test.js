class Snake {

    constructor(init) {
        this.a = init;
        console.log('constructor!!');
    }

    methodA() {
        return this.a;
    }

    methodB(param) {
        console.log("methodB" + param);
    }

}


var s = new Snake(2);

console.log(s.methodA())

s.methodB("yo");