/*
var coords = document.querySelector('#coords');

var x_coordinates = 'abcdefghij'.split('');
var lis = '';

x_coordinates.forEach((c, i) => {
  for (var y=1; y<11; y++) {
    lis += `<li data-coordinates="${c}${y}"></li>`;
  }
});

coords.innerText = lis;
*/

function Battleship(ocean,targeting) {

  var ocean = document.querySelector(ocean);
  var targeting = document.querySelector(targeting);

  targeting.addEventListener('click', function(e) {
    console.log(`Clicked on ${e.target.dataset.coordinates}`);
  });

};

var g = new Battleship('#player-one .ocean','#player-one .targeting');

// A record of each ship and its coordinates, a-i on the x; 0-9 on the y
var ships = {
  submarine: {
    position: ['a1','a2','a3'],
    damage: []
  },
  destroyer: {
    position: ['c1','d1','e1'],
    damage: []
  },
  patrol: {
    position: ['g0','h0']
  }
};

function build_targets_list(ships) {
  var targets = [];
  for (var ship in ships) {
    console.log(JSON.stringify(ships[ship].position));
    targets.push(ships[ship].position);
  }
  targets = targets.flat();
  targets = targets.sort();
  return targets;
}

var t = build_targets_list(ships);

// A record of all target points, regardless of ship type
// var targets = [11,12,13,32,33,34];
/*
// A function to
function damage(coordinates) {
  // See if there's a hit
  if (coordinates of targets) {
    // If so, go deeper and find out exactly which ship got hit
    for (ship in ships) {
      if (coordinates of ship) {

      }
    }
  }
}
*/
