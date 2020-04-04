function findInNeighborhood(tile, type, range, checkFull) {
    var candidates = tile.getNeighborhood(range);
    var options = [];
    for (var i = 0; i < candidates.length; i++ ) {
        for (var j = 0; j < candidates[i].children.length; j++ ) {
            if (candidates[i].children[j].type==type) {
                if (checkFull) {
                    if (!candidates[i].children[j].isFull()) {
                        options.push(candidates[i].children[j]);
                    }
                } else {
                        options.push(candidates[i].children[j]);
                }
            }
        }
    }

    if (options.length>0) {
        var idx = Math.round(Math.random()*(options.length-1));
        return options[idx];
    } else {
        return null;
    }    
}

function findClosest(tile, type, checkFull,maxRange) {

    if (!maxRange) {
        maxRange=10;
    }
    var found=null;
    var range=1;
    while (found==null && range < 10) {
        found = findInNeighborhood(tile, type, range, checkFull);
        if (found) {
           return found;
        }
        range++;
    }
    return null;
}

function findFreeBedInICU(tile) {
    return findClosest(tile, BType.HOSPITAL, true, 15);
}
