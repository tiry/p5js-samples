
var NB_H_PER_DAYS=18;
var TIME_SCALE=10;

function now() {

    var m = Math.floor(frameCount/(fr*TIME_SCALE));
    var h = Math.floor(m/60);
    var d =  Math.floor(h/NB_H_PER_DAYS) % 7 +1;

    return { h: (6 + m%NB_H_PER_DAYS), d:d}

}