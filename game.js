function Battleship(ocean,targeting) {

  // Set up our basic grids
  var ocean = document.querySelector(ocean);
  var targeting = document.querySelector(targeting);

  // Set up a record of each ship and its position coordinates, a-i on the x; 0-9 on the y
  // Using the 1990 MB ship namees and sizes
  //   (https://www.hasbro.com/common/instruct/battleship.pdf)
  var ships = {
    carrier: {
      length: 5,
      position: [],
      horizontal: false,
      damage: []
    },
    battleship: {
      length: 4,
      position: [],
      horizontal: false,
      damage: []
    },
    cruiser: {
      length: 3,
      position: [],
      horizontal: false,
      damage: []
    },
    submarine: {
      length: 3,
      position: [],
      horizontal: false,
      damage: []
    },
    destroyer: {
      length: 2,
      position: [],
      horizontal: false,
      damage: [],
    }
  };

  // Array to hold all coordinates occupied by ships
  var targets = [];

  // Utility function to generate a random [x,y] origin array
  function random_origin() {
    var origin = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    console.log("Random origin:", origin);
    return origin;
  }
  // Utility function to set orientation (horizontal/true; vertical/false)
  function random_orientation() {
    var orientation = false;
    if (Math.round(Math.random() * 10) % 2 === 0) {
      orientation = true;
    };
    return orientation;
  }
  // Function to set the position property (an array of coordinates) for a ship
  function set_position_coordinates(origin,ship) {
    var axis = (ship.horizontal) ? 0 : 1;
    console.log('Axis value:', axis);
    var x_coordinates = 'abcdefghij'.split('');
    for (var i = 0; i < ship.length; i++) {
      console.log('Coordinates:',x_coordinates[origin[0]], origin[1]);
      ship.position.push(x_coordinates[origin[0]] + origin[1]);
      origin[axis]++;
    }
  }
  // Function to place each individual ship
  function place_ship(ship) {
    // Strikes (collisions with other ships)
    var strikes = 0;
    // Set and track a random origin for the ship
    var origin = random_origin();
    // Reset the position to an empty array, in case the function is called recursively
    ship.position = [];
    // Determine orientation;
    ship.horizontal = random_orientation();

    // Test origin with length; does it fit the board?
    // TODO: Make this some kind of simpler utilty function? or at least DRY the logic
    if (ship.horizontal) {
      if (origin[0] + ship.length > 9) {
        // It won't fit on the board; set x coordinate minus the ship length
        origin[0] = origin[0] - ship.length;
      }
    } else {
      if (origin[1] + ship.length > 9) {
        // It won't fit on the board; set y coordinate minus the ship length
        origin[1] = origin[1] - ship.length;
      }
    }
    // Now that we now the origin + length fit the board,
    // set up the array of game coordinates on ship.position
    set_position_coordinates(origin,ship);

    // Next, test whether they collide with any other ships that have already been positioned
    for (var coordinate of ship.position) {
      if (targets.indexOf(coordinate) > -1) {
        strikes++;
      }
    }
    if (strikes > 0) {
      // If there are any collisions (strikes), recursively call place_ship
      console.log('There was a collision');
      place_ship(ship);
    } else {
      // Append the new coordinates to the targets array
      targets.push(ship.position);
      // Flatten the array of targets
      targets = targets.flat();
      // Finally, sort the array of targets
      targets = targets.sort();
    }
  }

  // Track damage to ships
  function track_damage(ships,coordinates) {
    for (var ship in ships) {
      if (ships[ship].position.indexOf(coordinates) !== -1) {
        // Add the damage of coordinate
        ships[ship].damage.push(coordinates);
        ships[ship].damage.sort();
        console.log(ships[ship]);

        // TODO: handle a ship being sunk (damage and position coordinates match)
        // Could possibly even leverage the return statement to return a sunk message
        // to add to the 'report' payload.

        // Get out as soon as there's a match
        return;
      }
    }
  }

  // Wrapper function to place all of the ships in the ships object
  function place_ships(ships) {
    for (var ship in ships) {
      place_ship(ships[ship]);
    }
  }

  // DOM function to append each ship as a list item to the .ocean grid
  function display_ships(ocean,ships) {
    for (var ship in ships) {
      var orientation = (ships[ship].horizontal) ? 'h' : 'v';
      var li = document.createElement('li');
      li.className = 'ship-' + ship + ' ' + orientation;
      li.dataset.coordinates = ships[ship].position[0];
      // li.innerText = ship;
      console.log('Attempting to append a child');
      ocean.appendChild(li);
      // With the child appended, we can now figure out where to end it
      if (ships[ship].horizontal) {
        var start = window.getComputedStyle(ocean.querySelector('.ship-' + ship)).gridRowStart;
        li.style.gridRowEnd = parseInt(start) + parseInt(ships[ship].length);
      } else {
        var start = window.getComputedStyle(ocean.querySelector('.ship-' + ship)).gridColumnStart;
        li.style.gridColumnEnd = parseInt(start) + parseInt(ships[ship].length);
      }
    }
  }

  // Go ahead and place the shapes
  place_ships(ships);
  console.log('Targets:', targets);
  console.log('Ships:', ships);
  // And display them on the ocean grid
  display_ships(ocean, ships);

  // Events and event listeners
  // Clicking on the targeting grid triggers a fire event
  targeting.addEventListener('click', function(e) {
    var coordinates = e.target.dataset.coordinates;
    // TODO: Disallow firing on a coordinate that's already been fired upon
    var event = new CustomEvent('fire', { detail: { action: 'fire', coordinates: coordinates } });
    console.log("Clicked on coordinates", );
    ocean.dispatchEvent(event);
  });
  // Ocean listens for 'fire' events
  ocean.addEventListener('fire', function(e) {
    var coordinates = e.detail.coordinates;
    var result = 'miss';
    console.log('Heard a fire event at coordinates', coordinates);
    // Display the hit or miss on the ocean
    var li = document.createElement('li');
    if (targets.indexOf(coordinates) !== -1) {
      result = 'hit';
      // If there's a hit, we need to track the damage
      track_damage(ships,coordinates);
    }
    li.className = result;
    li.dataset.coordinates = coordinates;
    ocean.appendChild(li);
    var event = new CustomEvent('report', { detail: { action: result, coordinates: coordinates } });
    targeting.dispatchEvent(event);
  });
  // Targeting grid listens for 'report' events
  targeting.addEventListener('report', function(e) {
    var result = e.detail.action;
    var coordinates = e.detail.coordinates;
    var li = document.createElement('li');
    li.className = result;
    li.dataset.coordinates = coordinates;
    targeting.appendChild(li);
  });

};

var g = new Battleship('#player-one .ocean','#player-one .targeting');




/*

// JavaScript to generate a bunch of list items with coordinates

var coords = document.querySelector('#coords');

var x_coordinates = 'abcdefghij'.split('');
var lis = '';

x_coordinates.forEach((c, i) => {
  for (var y=0; y<10; y++) {
    lis += `<li data-coordinates="${c}${y}"></li>`;
  }
});

coords.innerText = lis;
*/
