# Polaris's Gridmancer Solution

[Gridmancer]: http://codecombat.com/play/level/gridmancer
[CodeCombat]: http://codecombat.com/

[Gridmancer] is a coding challenge offered by the people at [CodeCombat]. The challenge is to design an iterative program capable of filling in a set of oddly-placed empty areas in a grid layout using 40 rectangles or fewer. My solution solves this challenge with 30 rectangles, just one above the optimal solution of 29.

My solution works by scanning each horizontal row from bottom to top for coordinate ranges that describe hollow areas. It adds each empty area to a queue. Once the entire row is scanned for empty areas, the scanner moves to the next row up and repeats the queueing process. It then compares each new hollow area from the second row to those collected from the first.

Any areas from the first row that don't match any from the second are removed from the queue. The program then fills these areas in with appropriately-sized rectangles. Areas remaining from the first row that match areas in the second row have attributes (like height and the last row number at which the row was observed) set for them.

The second part of the process results in the queueing of larger rectangle ranges. It is repeated, with height and y-index increased, until a non-identical x-range is encountered in future rows. At this point, the new, larger rectangle is constructed.

The process of checking, matching, setting, filling, and disposal is repeated for every row, filling the entire board.

## Try it out

[code]: https://github.com/formerPolaris/Gridmancer-Solution/blob/master/codecombatphase2.js

The [code] can be tested at http://codecombat.com/play/level/gridmancer. Simply replace the default code with the code provided in the first link.
