//

/*

// Phase 0: Original code

var grid = this.getNavGrid().grid;
var tileSize = 4;
for(var y = 0; y + tileSize < grid.length; y += tileSize) {
    for(var x = 0; x + tileSize < grid[0].length; x += tileSize) {
        var occupied = grid[y][x].length > 0;
        if(!occupied) {
            this.addRect(x + tileSize / 2, y + tileSize / 2, tileSize, tileSize);
            this.wait();  // Hover over the timeline to help debug!
        }
    }
}

// Phase 1: Generate horizontal rectangles only

var grid = this.getNavGrid().grid;
var tileSize = 4;
var xRangeHash = {}; // format = xRangeHash[y][(start value)] == {'finish': value}

for(var y = 0; y + tileSize < grid.length; y += tileSize) {

  xRangeHash[y] = {}; // format = {(start value): {'finish':value}}
  var currentXRange = []; // Array 

  for(var x = 0; x + tileSize < grid.length; x += tileSize) {

    var occupied = grid[y][x].length > 0;

    if (!occupied) {
      currentXRange.push(x);
    } else if (currentXRange.length > 0) {
      currentXRange.push(x);
      var terminus = currentXRange.length - 1;
      xRangeHash[y][currentXRange[0]] = {"finish": currentXRange[terminus]};
      currentXRange = [];
    } else {
      currentXRange = [];
    }
  }

  for(var start in xRangeHash[y]) {
    var finish = xRangeHash[y][start].finish;

    var xCenter = (start + finish)/2;
    var yCenter = y + 2;
    var xSpan = finish - start;
    var ySpan = tileSize;
    
    this.addRect(xCenter, yCenter, xSpan, ySpan);
    this.wait();
  }
}

*/
// Phase 2: After completing x-chunk, generate rectangles from fused identical x-chunks in adjacent y ranges.

var grid = this.getNavGrid().grid;
var tileSize = 4;
var xRangeHash = {}; // format = xRangeHash[y][(start value)] == {'finish': value}

for(var y = 0; y + tileSize < grid.length; y += tileSize) {

  xRangeHash[y] = {}; // format = {(start value): {'finish':value}}
  var currentXRange = []; // Array 

  for(var x = 0; x + tileSize < grid.length; x += tileSize) {

    var occupied = grid[y][x].length > 0;

    if (!occupied) {
      currentXRange.push(x);
    } else if (currentXRange.length > 0) {
      currentXRange.push(x);
      var terminus = currentXRange.length - 1;
      xRangeHash[y][currentXRange[0]] = {"finish": currentXRange[terminus]};
      currentXRange = [];
    } else {
      currentXRange = [];
    }
  }
}

// Look at each y level.
// Take each range, attach to any identicals above;
// if no identicals, create rectangle.

var potentialRanges = []; // To be a list of ranges from previous y-levels.
// Format of each range: [xStart, xEnd, height accumulated, last Y level recorded]
for(var y in xRangeHash) { // Look through every y.

  for(var start in xRangeHash[y]) { // Start value of each x-range at this y-level
    var finish = xRangeHash[y][start].finish; // End value

    var indexOfOldRange = false;
    var rangeArray = [start, finish];

    for(var i = 0; i < potentialRanges.length; i++) {
      if (potentialRanges[i][0] == rangeArray[0] && potentialRanges[i][1] == rangeArray[1]) {
        indexOfOldRange = i;
        break;
      }
    }

    if (indexOfOldRange !== false) { // If there's an index of a matching previous range,
      potentialRanges[indexOfOldRange][2] += tileSize; // Increase its height by a tile and
      potentialRanges[indexOfOldRange][3] = y; // update its position.
    } else { // Otherwise, add the range to the list of ranges to process.
      potentialRanges.push([start, finish, tileSize, y]);
    }
  }

  // This should leave some ranges that have no matches for the current y.
  // These will have rectangles generated for them; the rest will be dropped.

  for(var i = potentialRanges.length - 1; i > -1; i--){ // Start from the end of the list.
    if (potentialRanges[i][3] != y) { // If the last y-position is lower than this one,

      var xCenter = potentialRanges[i][0]/2 + potentialRanges[i][1]/2;
      var yCenter = y - potentialRanges[i][2]/2;
      var xSpan = (potentialRanges[i][1] - potentialRanges[i][0]);
      var ySpan = potentialRanges[i][2];

      this.addRect(xCenter, yCenter, xSpan, ySpan); // Generate a rectangle from its attributes...
      this.wait();

      potentialRanges.splice(i, 1); // And remove it from the processing list.
    }
  }
}