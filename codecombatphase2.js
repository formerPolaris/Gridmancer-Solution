var grid = this.getNavGrid().grid;
var tileSize = 4;
var xRangeHash = {};

for(var y = 0; y + tileSize < grid.length; y += tileSize) {

  xRangeHash[y] = {};
  var currentXRange = [];

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

var potentialRanges = [];
for(var y in xRangeHash) {

  for(var start in xRangeHash[y]) {
    var finish = xRangeHash[y][start].finish;

    var indexOfOldRange = false;
    var rangeArray = [start, finish];

    for(var i = 0; i < potentialRanges.length; i++) {
      if (potentialRanges[i][0] == rangeArray[0] && potentialRanges[i][1] == rangeArray[1]) {
        indexOfOldRange = i;
        break;
      }
    }

    if (indexOfOldRange !== false) {
      potentialRanges[indexOfOldRange][2] += tileSize;
      potentialRanges[indexOfOldRange][3] = y;
    } else {
      potentialRanges.push([start, finish, tileSize, y]);
    }
  }

  for(var i = potentialRanges.length - 1; i > -1; i--){
    if (potentialRanges[i][3] != y) {

      var xCenter = potentialRanges[i][0]/2 + potentialRanges[i][1]/2;
      var yCenter = y - potentialRanges[i][2]/2;
      var xSpan = (potentialRanges[i][1] - potentialRanges[i][0]);
      var ySpan = potentialRanges[i][2];

      this.addRect(xCenter, yCenter, xSpan, ySpan);
      this.wait();

      potentialRanges.splice(i, 1);
    }
  }
}