
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


function initDebugSchoolPopulation(nb) {

  var school;
  while (!school) {
    var b = Math.floor(Math.random()*buildings.length);
    if (buildings[b].type==BType.SCHOOL) {
      school=buildings[b];
    }
  }


  while (people.length<nb) {
    var b = Math.floor(Math.random()*buildings.length);
    if (buildings[b].type==BType.HOUSE) {
      new Person(buildings[b], 15).work=school;
    }
  }
}

function initDebugICU(nb) {

  while (people.length < nb) {
    var b = Math.floor(Math.random()*buildings.length);
    if (buildings[b].type==BType.HOUSE) {
      var p = new Person(buildings[b], 15);
      var v = new Virus(p);
      v.severeForm=true;
      v.step=[0,1,1];
    }
  }

}

function initPopulation(nbCases) {

  for (var idx=0; idx < buildings.length; idx++) {
    if (buildings[idx].type==BType.HOUSE) {

      //children
      var nb = Math.round(Math.random()*2.6);
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 5 + Math.floor(Math.random()*25));
      }
      //parents
      nb = Math.round(1+ Math.random()*1.4);
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 20 + Math.floor(Math.random()*45));
      }
      //gd parents
      nb = Math.round(Math.random()*1.55);
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 45 + Math.floor(Math.random()*55));
      }
    }
  }

  initPandemic(nbCases);
}
