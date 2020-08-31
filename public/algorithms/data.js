var canvas;
var ctx;

var tileH = 20;
var tileW = 20;
var border = 2;

var tileColCount = 9;
var tileRowCount = 9;

var startX = 1;
var startY = 1;

var FPS = 10;

var xloc = startX;
var yloc = startY;

var finalX = tileColCount - 2;
var finalY = tileRowCount - 2;

var visitfinal = [];

var reqanimate;

var algorithm_used = "";
var can_run = false;

function init(tileColCount = 9, tileRowCount = 9) {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = (tileW + border) * tileColCount;
  canvas.height = (tileH + border) * tileRowCount;
}

var boundX = startX;
var boundY = startY;

var time = 0;

var tiles = [];
var walls = [];
var store_path = [];

for (c = 0; c < tileColCount; c++) {
  tiles[c] = [];
  walls[c] = [];
  for (r = 0; r < tileRowCount; r++) {
    tiles[c][r] = {
      x: c * (tileW + border),
      y: r * (tileH + border),
      state: 'e'
    };

    walls[c][r] = false;
  }
}

tiles[startX][startY].state = 's';
tiles[finalX][finalY].state = 'f';

CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, rounded) {
  const radiansInCircle = Math.PI * 2;
  const halfRadian = Math.PI;
  const quarterRadian = Math.PI / 2;

  this.arc(rounded + x, rounded + y, rounded, -quarterRadian, halfRadian, true);
  this.lineTo(x, y + height - rounded);
  this.arc(rounded + x, height - rounded + y, rounded, halfRadian, quarterRadian, true);
  this.lineTo(x + width - rounded, y + height);
  this.arc(x + width - rounded, y + height - rounded, rounded, quarterRadian, 0, true);
  this.lineTo(x + width, y + rounded);
  this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadian, true);
  this.lineTo(x + rounded, y);
}

function rect(x, y, w, h, state) {
  if (state == 's')
    ctx.fillStyle = '#00FA9A';
  else if (state == 'f')
    ctx.fillStyle = '#EE204D';
  else if (state == 'w')
    ctx.fillStyle = '#333333';
  else if (state == 'e')
    ctx.fillStyle = '#FFFFFF';
  else if (state == 'x')
    ctx.fillStyle = '#EE82EE';
  else
    ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}

function draw(tileColCount = 9, tileRowCount = 9) {
  clear();
  for (c = 0; c < tileColCount; c++)
    for (r = 0; r < tileRowCount; r++) {
      rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state);
    }
}

function reset() {


  cancelAnimationFrame(reqanimate);
  store_path = [];

  algorithm_used = "";

  document.getElementById('RunBtn')
    .innerHTML = 'RUN!';

  document.getElementById('catch')
    .innerHTML = 'PICK SOMETHING!';

  tiles = [];
  walls = [];

  startX = 1;
  startY = 1;

  finalX = tileColCount - 2;
  finalY = tileRowCount - 2;

  for (c = 0; c < tileColCount; c++) {
    tiles[c] = [];
    walls[c] = [];
    for (r = 0; r < tileRowCount; r++)
      tiles[c][r] = {
        x: c * (tileW + border),
        y: r * (tileH + border),
        state: 'e'
      };
    walls[c][r] = false;
  }
  tiles[startX][startY].state = 's';
  tiles[finalX][finalY].state = 'f';

  canvas.width = (tileW + border) * tileColCount;
  canvas.height = (tileH + border) * tileRowCount;
  draw(tileColCount, tileRowCount);
}


init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
draw();

var rows = document.getElementById("rowRange");
var rowout = document.getElementById("rowshow");
rowout.innerHTML = rows.value;

rows.oninput = function() {
  rowout.innerHTML = this.value;
}

var cols = document.getElementById("colRange");
var colout = document.getElementById("colshow");
colout.innerHTML = cols.value;

cols.oninput = function() {
  colout.innerHTML = this.value;
}

rows.onchange = function() {

  clear();

  tileRowCount = this.value;
  tileColCount = cols.value;

  reset();
}

cols.onchange = function() {

  clear();

  tileRowCount = rows.value;
  tileColCount = this.value;

  reset();
}


function resetpathonly() {

  cancelAnimationFrame(reqanimate);
  store_path = [];

  document.getElementById('RunBtn')
    .innerHTML = "RUN!";

  for (c = 0; c < tileColCount; c++) {
    for (r = 0; r < tileRowCount; r++) {
      if (tiles[c][r].state == 's' || tiles[c][r].state == 'f')
        continue;
      else if (walls[c][r]) {
        tiles[c][r].state = 'w';
      } else if (!walls[c][r]) {
        tiles[c][r].state = 'e';
      }
    }
  }
  tiles[startX][startY].state = 's';
  tiles[finalX][finalY].state = 'f';
  draw(tileColCount, tileRowCount);
}

function resetwallsonly() {

  for (c = 0; c < tileColCount; c++) {
    for (r = 0; r < tileRowCount; r++) {
      if (tiles[c][r].state == 'w') {
        tiles[c][r].state = 'e';
        walls[c][r] = false;
      }
    }
  }
  draw(tileColCount, tileRowCount);
}

/*-------------------------------------------------------------------------------------------------------------------------
                                    Tutorial
--------------------------------------------------------------------------------------------------------------------------*/

var tutorial_counter = 0;
var total_counter = 8;

var title = ["Welcome To The Maze", "What exactly is The Maze?", "The Menu", 'Change <strong>Start</strong> and <strong>End</strong> Point', 'Create walls throught mouse', 'Create walls with a given algorithm', 'Pick an Algorithm', "reset it all!"];
var subtitle = ["The Maze Is A Visualization Tool That Will Help You Understand Some Common Graph Algorithms.", "Well! It's A Simple Implementation Of Graph Algorithm To Find The Path Between Two Points", "", "Yes You Can Change Them", "Create Maze Of Your Own Choice", "Well The Previous Method For Creating Maze Seems Tedious Huh?", "Final Tasks Is To Pick An Algorithm", "You Reset Everything Or Just Clear Out The Path Or Walls"];
var t_content = ["This is a short tutorial to show you how the site works. If you want feel free to <strong>Skip</strong> or press <strong>Next</strong>.", "It does this by using Graphs. Consider every block in this Maze as a node in the Graph. Each node or block is connected it's adjacent nodes and nodes above and below it. It uses algorithm such as <a href = \"https://en.wikipedia.org/wiki/Breadth-first_search\"><strong>Breadth-First-Search</strong></a>, <a href = \"https://en.wikipedia.org/wiki/Depth-first_search\"><strong>Depth-First-Search</strong></a>, <a href ='https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm'><strong>Dijkstra</strong></a>, <a href ='https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower'><strong>Wall-Follwer-Algorithm</strong></a> and <a href='https://en.wikipedia.org/wiki/A*_search_algorithm#:~:text=A%2A%20%28pronounced%20%22A-star%22%29%20is%20a%20graph%20traversal%20and,as%20it%20stores%20all%20generated%20nodes%20in%20memory.'><strong>A-star</strong></a> to find a path through the Maze. It will give you an idea of concepts such as <strong>Recursion</strong>, <strong>Heuristics</strong> and etc.", "This is the place where you'll find whatever is required. You can change number of Rows and Columns of the Maze pick an algorithm or Create a Maze by itself isn't that neat.", "Just drag either one of them and drop it where ever you want", "Click anywhere on the maze with your mouse and drag it alround to create a maze.", "Pick an algorithm of your choice they garrenty to create a perfect maze", "There are total of 6 algorithm you can use find out the path with. Few of them will find the shortest path will other simply a path", ""];
var img_content = ['public/styling/The-Maze.gif', '', 'public/styling/open-menu.gif', 'public/styling/move-start-target.gif', 'public/styling/create-wall.gif', 'public/styling/Pick-MAZE.gif', 'public/styling/Pick-Algo.gif', 'public/styling/nav-bar.gif'];

function opentutorial() {
  document.getElementById('dialog')
    .style.display = 'block';
}

function closetutorial() {
  tutorial_counter = 0;
  document.getElementById('dialog')
    .style.display = "none";
}

function nexttutorial() {
  if (tutorial_counter < total_counter - 1)
    tutorial_counter++;
  document.getElementById('title')
    .innerHTML = title[tutorial_counter % total_counter];
  document.getElementById('subtitle')
    .innerHTML = subtitle[tutorial_counter % total_counter];
  document.getElementById('t_content')
    .innerHTML = t_content[tutorial_counter % total_counter];
  document.getElementById('img_content')
    .src = img_content[tutorial_counter % total_counter];
  if (img_content[tutorial_counter % total_counter] == "" && tutorial_counter % total_counter != 7) {
    document.getElementById('img_content')
      .style.border = "none";
  } else if (tutorial_counter % total_counter == 7) {
    document.getElementById('img_content')
      .style.width = "60%";
    document.getElementById('img_content')
      .style.height = "20%";
    document.getElementById("img_content")
      .style.left = '22%';
  } else {
    document.getElementById('img_content')
      .style.width = "25%";
    document.getElementById('img_content')
      .style.height = "34%";
    document.getElementById("img_content")
      .style.left = '37%';
    document.getElementById('img_content')
      .style.border = "2px solid #5f65d3";
  }
  document.getElementById('counter')
    .innerHTML = (tutorial_counter % total_counter + 1) + "/" + total_counter;
}

function prevtutorial() {
  if (tutorial_counter > 0)
    tutorial_counter--;
  document.getElementById('title')
    .innerHTML = title[tutorial_counter % total_counter];
  document.getElementById('subtitle')
    .innerHTML = subtitle[tutorial_counter % total_counter];
  document.getElementById('t_content')
    .innerHTML = t_content[tutorial_counter % total_counter];
  document.getElementById('img_content')
    .src = img_content[tutorial_counter % total_counter];
  if (img_content[tutorial_counter % total_counter] == "" && tutorial_counter % total_counter != 7) {
    document.getElementById('img_content')
      .style.border = "none";
  } else if (tutorial_counter % total_counter == 7) {
    document.getElementById('img_content')
      .style.width = "60%";
    document.getElementById('img_content')
      .style.height = "20%";
    document.getElementById("img_content")
      .style.left = '22%';
  } else {
    document.getElementById('img_content')
      .style.width = "25%";
    document.getElementById('img_content')
      .style.height = "34%";
    document.getElementById("img_content")
      .style.left = '37%';
    document.getElementById('img_content')
      .style.border = "2px solid #5f65d3";
  }
  document.getElementById('counter')
    .innerHTML = (tutorial_counter % total_counter + 1) + "/" + total_counter;
}

/*-------------------------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------------------------------
                                    WRITE MAZE ALGORITHMS HERE
--------------------------------------------------------------------------------------------------------------------------*/
function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mazeBT() {
  for (c = 1; c < tileColCount - 1; c += 2) {
    for (r = 1; r < tileRowCount - 1; r += 2) {
      walls[c][r] = false;
      var n = false;
      var e = false;
      if (c - 1 > 0)
        n = true;
      if (r + 1 < tileRowCount - 1)
        e = true;
      if (n && e) {
        var pick = randint(0, 1);
        if (pick == 0) {
          walls[c][r + 1] = false;
        } else
          walls[c - 1][r] = false;
      } else if (n) {
        walls[c - 1][r] = false;
      } else if (e)
        walls[c][r + 1] = false;
    }
  }
}

function makemazeBT() {

  cancelAnimationFrame(reqanimate);
  resetpathonly();
  resetwallsonly();

  document.getElementById('catch')
    .style.fontSize = "1.1em";
  document.getElementById('catch')
    .innerHTML = 'THIS MAZE WAS FORMED USING <strong><strong>BINARY TREE!</strong></strong>';

  for (c = 0; c < tileColCount; c++) {
    walls[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      walls[c][r] = true;
      if (tiles[c][r].state == 's' || tiles[c][r].state == 'f')
        walls[c][r] = false;
    }
  }
  mazeBT();
  for (c = 0; c < tileColCount; c++) {
    for (r = 0; r < tileRowCount; r++) {
      if (walls[c][r])
        tiles[c][r].state = 'w';
    }
  }
  draw(tileColCount, tileRowCount);
}

function shuffle(arra1) {
  var ctr = arra1.length,
    temp, index;

  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

function countvisitednode(walls, i, j) {

  var count = 0;

  var dir = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1]
  ];

  for (k = 0; k < 4; k++) {
    var ni = i + dir[k][0];
    var nj = j + dir[k][1];

    if (ni < 0 || nj < 0 || ni >= tileColCount || nj >= tileRowCount)
      continue;
    if (walls[ni][nj] == false)
      count++;
  }

  return count;

}

function mazeDFS(c, r) {
  var visitorder = [1, 2, 3, 4];

  shuffle(visitorder);
  for (x of visitorder) {
    switch (x) {
      case 1:
        if (r - 2 < 0) {
          continue;
        }
        if (walls[c][r - 2]) {
          walls[c][r - 2] = false;
          walls[c][r - 1] = false;
          mazeDFS(c, r - 2);
        }
        break;
      case 2:
        if (c + 2 > tileColCount - 1)
          continue;
        if (walls[c + 2][r]) {
          walls[c + 2][r] = false;
          walls[c + 1][r] = false;
          mazeDFS(c + 2, r);
        }
        break;
      case 3:
        if (r + 2 > tileRowCount - 1)
          break;
        if (walls[c][r + 2]) {
          walls[c][r + 2] = false;
          walls[c][r + 1] = false;
          mazeDFS(c, r + 2);
        }
        break;
      case 4:
        if (c - 2 < 0)
          break;
        if (walls[c - 2][r]) {
          walls[c - 2][r] = false;
          walls[c - 1][r] = false;
          mazeDFS(c - 2, r);
        }
        default:
          break;
    }
  }
}

function makeDFSMAZE() {

  cancelAnimationFrame(reqanimate);
  resetwallsonly();
  resetpathonly();

  document.getElementById('catch')
    .style.fontSize = "1.1em";
  document.getElementById('catch')
    .innerHTML = 'THIS MAZE WAS FORMED USING <strong><strong>DEPTH-FIRST-SEARCH!</strong></strong>';
  walls = [];
  for (c = 0; c < tileColCount; c++) {
    walls[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      walls[c][r] = true;
    }
  }
  walls[startX][startY] = false;
  mazeDFS(startX, startY);
  walls[finalX][finalY] = false;
  for (c = 0; c < tileColCount; c++) {
    for (r = 0; r < tileRowCount; r++) {
      if (walls[c][r] == true)
        tiles[c][r].state = 'w';
    }
  }
  draw(tileColCount, tileRowCount);
}

function choose(visited, row, col) {
  var dir = [
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0]
  ];

  var visitorder = [0, 1, 2, 3];
  shuffle(visitorder);

  for (x in visitorder) {
    var nr = row - dir[x][0];
    var nc = col - dir[x][1];
    if (nr >= 0 && nc >= 0 && nr < tileRowCount && nc < tileColCount && walls[nc][nr] == false) {
      if (dir[x][0] == 0 && dir[x][1] == -2) {
        walls[nc - 1][nr] = false;
        break;
      }
      if (dir[x][0] == 0 && dir[x][1] == 2) {
        walls[nc + 1][nr] = false;
        break;
      }
      if (dir[x][0] == -2 && dir[x][1] == 0) {
        walls[nc][nr - 1] = false;
        break;
      }
      if (dir[x][0] == 2 && dir[x][1] == 0) {
        walls[nc][nr + 1] = false;
        break;
      }
    }
  }
}

function mazePrim() {

  var visited = [];

  for (c = 0; c < tileColCount; c++) {
    visited[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      visited[c][r] = false;
    }
  }

  var visitorder = [0, 1, 2, 3];
  var set = [];
  set.push([startX, startY]);

  while (set.length != 0) {

    var index;
    if (set.length == 1) {
      index = 0;
    } else {
      index = randint(0, set.length - 1);
    }

    var row = set[index][1];
    var col = set[index][0];
    set.splice(index, 1);

    walls[col][row] = false;
    visited[col][row] = true;

    choose(visited, row, col);

    if (row - 2 >= 0) {
      if (!visited[col][row - 2]) {
        visited[col][row - 2] = true;
        set.push([col, row - 2]);
      }
    }

    if (col - 2 >= 0) {
      if (!visited[col - 2][row]) {
        visited[col - 2][row] = true;
        set.push([col - 2, row]);
      }
    }
    if (row + 2 < tileRowCount) {
      if (!visited[col][row + 2]) {
        visited[col][row + 2] = true;
        set.push([col, row + 2]);
      }
    }
    if (col + 2 < tileColCount) {
      if (!visited[col + 2][row]) {
        visited[col + 2][row] = true;
        set.push([col + 2, row]);
      }
    }
  }
}


function makePrimMaze() {

  cancelAnimationFrame(reqanimate);
  resetpathonly();
  resetwallsonly();

  document.getElementById('catch')
    .style.fontSize = "1.1em";
  document.getElementById('catch')
    .innerHTML = "THIS MAZE WAS FORMED USING <strong><strong>PRIM'S ALGORITHM!</strong></strong>";

  for (c = 0; c < tileColCount; c++) {
    walls[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      walls[c][r] = true;
      if (tiles[c][r].state == 's' || tiles[c][r].state == 'f') {
        walls[c][r] = false;
      }
    }
  }

  mazePrim();
  for (c = 0; c < tileColCount; c++) {
    for (r = 0; r < tileRowCount; r++) {
      if (walls[c][r])
        tiles[c][r].state = 'w';
    }
  }
  draw(tileColCount, tileRowCount);
}
/*-------------------------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------------------------*/
function pathCell(x, y, state) {
  this.x = x;
  this.y = y;
  this.state = state;

  this.draw = function() {
    if (this.state == 'v') {
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.rect(tiles[this.x][this.y].x, tiles[this.x][this.y].y, tileW, tileH);
      ctx.fill();
    } else {
      if (visitfinal[this.x][this.y] % 2 == 0) {
        ctx.fillStyle = "#662d91";
        visitfinal[this.x][this.y] -= 1;
      } else {
        ctx.fillStyle = "#EE82EE";
        visitfinal[this.x][this.y] -= 1;
      }
      ctx.beginPath();
      ctx.rect(tiles[this.x][this.y].x, tiles[this.x][this.y].y, tileW, tileH);
      ctx.fill();
    }
  }
}


function animatePath(timeStamp) {

  if (store_path.length != 0) {
    setTimeout(function() {
      reqanimate = requestAnimationFrame(animatePath);
    }, 1000 / FPS);
    var info = store_path.shift();
    if (tiles[info[0]][info[1]].state != 's' && tiles[info[0]][info[1]].state != 'f') {
      var cell = new pathCell(info[0], info[1], info[2]);
      cell.draw();
    }
  }

}
/*-------------------------------------------------------------------------------------------------------------------------
                                    WRITE SOLVER ALGORITHMS HERE
--------------------------------------------------------------------------------------------------------------------------*/
function solveBFS() {

  resetpathonly();
  draw(tileColCount, tileRowCount);

  algorithm_used = "BFS";

  document.getElementById('RunBtn')
    .innerHTML = 'RUN BFS!';
  document.getElementById('catch')
    .style.fontSize = "1.1em";
  document.getElementById('catch')
    .innerHTML = '<strong><strong>BREADTH-FIRST-SEARCH</strong></strong> EXPLORES ALL OF THE NEIGHBOUR NODES AT THE PRESENT DEPTH TO FIND <strong><strong>SHORTEST PATH</strong></strong>';

  var Xqueue = [startX];
  var Yqueue = [startY];

  xloc = startX;
  yloc = startY;

  can_run = false;
  FPS = 20;
  var pathFound = false;

  while (Xqueue.length > 0 && !pathFound) {
    xloc = Xqueue.shift();
    yloc = Yqueue.shift();

    if (tiles[xloc][yloc] != 's' && tiles[xloc][yloc] != 'f')
      store_path.push([xloc, yloc, 'v']);

    if (xloc > 0) {
      if (tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      }
    }
    if (xloc < tileColCount - 1) {
      if (tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      }
    }
    if (yloc > 0) {
      if (tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      }
    }
    if (yloc < tileRowCount - 1) {
      if (tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      }
    }

    if (xloc > 0) {
      if (tiles[xloc - 1][yloc].state == 'e') {
        Xqueue.push(xloc - 1);
        Yqueue.push(yloc);
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
      }
    }
    if (xloc < tileColCount - 1) {
      if (tiles[xloc + 1][yloc].state == 'e') {
        Xqueue.push(xloc + 1);
        Yqueue.push(yloc);
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
      }
    }
    if (yloc > 0) {
      if (tiles[xloc][yloc - 1].state == 'e') {
        Xqueue.push(xloc);
        Yqueue.push(yloc - 1);
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
      }
    }
    if (yloc < tileRowCount - 1) {
      if (tiles[xloc][yloc + 1].state == 'e') {
        Xqueue.push(xloc);
        Yqueue.push(yloc + 1);
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
      }
    }
  }
  if (pathFound) {
    can_run = true;
  } else {
    can_run = false;
  }
}

function manhattandistance(src_i, src_j, dest_i, dest_j) {
  return Math.sqrt((src_i - dest_i) * (src_i - dest_i) + (src_j - dest_j) * (src_j - dest_j));
}

function solveastar() {

  resetpathonly();
  draw(tileColCount, tileRowCount);

  algorithm_used = 'ASTAR';

  document.getElementById('RunBtn')
    .innerHTML = 'RUN A STAR!';
  document.getElementById('catch')
    .style.fontSize = "1.1em";
  document.getElementById('catch')
    .innerHTML = '<strong><strong>A STAR</strong></strong> USES <strong><strong>HEURISTICS</strong></strong> TO FIND <strong><strong>SHORTEST PATH</strong></strong>';

  var openList = [];
  openList.push([0, startX, startY]);

  FPS = 15;

  var closedList = [];
  var CellDetails = [];

  for (c = 0; c < tileColCount; c++) {
    CellDetails[c] = [];
    closedList[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      CellDetails[c][r] = {
        f: 100000000,
        parent_i: -1,
        parent_j: -1
      };
      closedList[c][r] = false;
    }
  }

  CellDetails[startX][startY].f = 0;
  CellDetails[startX][startY].parent_i = startX;
  CellDetails[startX][startY].parent_j = startY;

  can_run = false;
  var pathFound = false;
  while (openList.length != 0) {

    openList.sort(function(a, b) {
      return a[0] - b[0];
    });

    var info = openList.shift();

    xloc = info[1];
    yloc = info[2];
    closedList[xloc][yloc] = true;

    if (tiles[xloc][yloc] != 's' && tiles[xloc][yloc] != 'f')
      store_path.push([xloc, yloc, 'v']);

    if (xloc > 0) {
      if (tiles[xloc - 1][yloc].state == 'f') {
        CellDetails[xloc - 1][yloc].parent_i = xloc;
        CellDetails[xloc - 1][yloc].parent_j = yloc;
        pathFound = true;
        break;
      } else if (closedList[xloc - 1][yloc] == false && tiles[xloc - 1][yloc].state != 'w') {
        var new_f = manhattandistance(xloc - 1, yloc, finalX, finalY);

        if (CellDetails[xloc - 1][yloc].f > new_f) {
          openList.push([new_f, xloc - 1, yloc]);

          tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';

          CellDetails[xloc - 1][yloc].f = new_f;
          CellDetails[xloc - 1][yloc].parent_i = xloc;
          CellDetails[xloc - 1][yloc].parent_j = yloc;
        }
      }
    }
    if (yloc > 0) {
      if (tiles[xloc][yloc - 1].state == 'f') {
        CellDetails[xloc][yloc - 1].parent_i = xloc;
        CellDetails[xloc][yloc - 1].parent_j = yloc;
        pathFound = true;
        break;
      } else if (closedList[xloc][yloc - 1] == false && tiles[xloc][yloc - 1].state != 'w') {
        var new_f = manhattandistance(xloc, yloc - 1, finalX, finalY);

        if (CellDetails[xloc][yloc - 1].f > new_f) {
          openList.push([new_f, xloc, yloc - 1]);
          tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';

          CellDetails[xloc][yloc - 1].f = new_f;
          CellDetails[xloc][yloc - 1].parent_i = xloc;
          CellDetails[xloc][yloc - 1].parent_j = yloc;
        }
      }
    }
    if (xloc < tileColCount - 1) {
      if (tiles[xloc + 1][yloc].state == 'f') {
        CellDetails[xloc + 1][yloc].parent_i = xloc;
        CellDetails[xloc + 1][yloc].parent_j = yloc;
        pathFound = true;
        break;
      } else if (closedList[xloc + 1][yloc] == false && tiles[xloc + 1][yloc].state != 'w') {
        var new_f = manhattandistance(xloc + 1, yloc, finalX, finalY);

        if (CellDetails[xloc + 1][yloc].f > new_f) {
          openList.push([new_f, xloc + 1, yloc]);


          tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';

          CellDetails[xloc + 1][yloc].f = new_f;
          CellDetails[xloc + 1][yloc].parent_i = xloc;
          CellDetails[xloc + 1][yloc].parent_i = yloc;
        }
      }
    }
    if (yloc < tileRowCount - 1) {
      if (tiles[xloc][yloc + 1].state == 'f') {
        CellDetails[xloc][yloc + 1].parent_i = xloc;
        CellDetails[xloc][yloc + 1].parent_j = yloc;
        pathFound = true;
        break;
      } else if (closedList[xloc][yloc + 1] == false && tiles[xloc][yloc + 1].state != 'w') {

        var new_f = manhattandistance(xloc, yloc + 1, finalX, finalY);

        if (CellDetails[xloc][yloc + 1].f > new_f) {
          openList.push([new_f, xloc, yloc + 1]);



          tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';

          CellDetails[xloc][yloc + 1].f = new_f;
          CellDetails[xloc][yloc + 1].parent_i = xloc;
          CellDetails[xloc][yloc + 1].parent_j = yloc;
        }
      }
    }
  }

  if (pathFound)
    can_run = true;
  else
    can_run = false;
}

function solveLWF() {

  resetpathonly();
  draw(tileColCount, tileRowCount);

  algorithm_used = "LWF";

  document.getElementById('RunBtn')
    .innerHTML = 'RUN LWF';
  document.getElementById('catch')
    .style.fontSize = "1.0em";
  document.getElementById('catch')
    .innerHTML = "<strong><strong>WARNING! </strong></strong> : <strong><STRONG>WALL-FOLLOWER ALGORITHM</STRONG></strong> ONLY WORKS IF THE MAZE IS <strong><strong>SIMPLY CONNECTED</strong></strong> THAT IS, ALL ITS WALLS ARE CONNECTED TOGETHER OR TO THE MAZE'S OUTER BOUNDRY";

  var currcase = 3;
  var pathFound = false;

  FPS = 10;

  xloc = startX;
  yloc = startY;

  var count = 0;

  while (!pathFound) {
    if (count == 100000)
      break;
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc = yloc + 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc = yloc - 1;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc = xloc - 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc + 1 < tileRowCount && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 2;
      }
    }
  }
  if (!pathFound) {
    xloc = startX;
    yloc = startY;
    resetpathonly();
    algorithm_used = "LWF";
    document.getElementById('RunBtn')
      .innerHTML = 'RUN LWF';
  }
  currcase = 1;

  count = 0;

  while (!pathFound) {
    if (count == 100000)
      break;
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc = yloc + 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc = yloc - 1;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc = xloc - 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc + 1 < tileRowCount && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 2;
      }
    }
  }
  if (!pathFound) {
    xloc = startX;
    yloc = startY;
    resetpathonly();
    algorithm_used = "LWF";
    document.getElementById('RunBtn')
      .innerHTML = 'RUN LWF';
  }

  currcase = 2;

  count = 0;
  while (!pathFound) {
    if (count == 100000)
      break;
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc = yloc + 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc = yloc - 1;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc = xloc - 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc + 1 < tileRowCount && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 2;
      }
    }
  }
  if (!pathFound) {
    xloc = startX;
    yloc = startY;
    resetpathonly();
    algorithm_used = "LWF";
    document.getElementById('RunBtn')
      .innerHTML = 'RUN LWF';
  }
  currcase = 0;

  count = 0;
  while (!pathFound) {
    if (count == 100000)
      break;
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc = yloc + 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc = yloc - 1;
      } else if (xloc + 1 < tileColCount && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc = xloc + 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc = xloc - 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc + 1 < tileRowCount && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 2;
      }
    }
  }
  if (pathFound) {
    can_run = true;
  } else {
    can_run = false;
  }
}

function solveRWF() {

  resetpathonly();
  draw(tileColCount, tileRowCount);

  algorithm_used = "RWF";

  document.getElementById('RunBtn')
    .innerHTML = 'RUN RWF';
  document.getElementById('catch')
    .style.fontSize = "1.0em";
  document.getElementById('catch')
    .innerHTML = "<strong><strong>WARNING! </strong></strong> : <strong>WALL-FOLLOWER ALGORITHM</strong> ONLY WORKS IF THE MAZE IS <strong><strong>SIMPLY CONNECTED</strong></strong> THAT IS, ALL ITS WALLS ARE CONNECTED TOGETHER OR TO THE MAZE'S OUTER BOUNDRY";
  var currcase = 3;
  var pathFound = false;

  FPS = 10;

  xloc = startX;
  yloc = startY;

  var count = 0;

  while (!pathFound) {
    if (count == 100000) {
      break;
    }
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else {
        currcase = 2;
      }
    }
  }

  if (!pathFound) {
    xloc = startX;
    yloc = startY;
    resetpathonly();
    algorithm_used = "RWF";
    document.getElementById('RunBtn')
      .innerHTML = 'RUN LWF';
  }

  count = 0;
  currcase = 1;
  while (!pathFound) {
    if (count == 100000) {
      break;
    }
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else {
        currcase = 2;
      }
    }
  }

  if (!pathFound) {
    xloc = startX;
    yloc = startY;
    resetpathonly();
    algorithm_used = "RWF";
    document.getElementById('RunBtn')
      .innerHTML = 'RUN LWF';
  }

  count = 0;
  currcase = 2;
  while (!pathFound) {
    if (count == 100000) {
      break;
    }
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else {
        currcase = 2;
      }
    }
  }
  if (!pathFound) {
    xloc = startX;
    yloc = startY;
    resetpathonly();
    algorithm_used = "RWF";
    document.getElementById('RunBtn')
      .innerHTML = 'RUN LWF';
  }

  count = 0;
  currcase = 0;
  while (!pathFound) {
    if (count == 100000) {
      break;
    }
    count += 1;
    if (currcase == 0) {
      if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        currcase = 1;
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else {
        currcase = 3;
      }
    } else if (currcase == 1) {
      if (xloc > 0 && tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        currcase = 2;
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else if (xloc > 0 && tiles[xloc - 1][yloc].state != 'w') {
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
        xloc -= 1;
      } else {
        currcase = 0;
      }
    } else if (currcase == 2) {
      if (yloc > 0 && tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        currcase = 3;
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else if (yloc > 0 && tiles[xloc][yloc - 1].state != 'w') {
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
        yloc -= 1;
      } else {
        currcase = 1;
      }
    } else if (currcase == 3) {
      if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      } else if (yloc < tileRowCount - 1 && tiles[xloc][yloc + 1].state != 'w') {
        currcase = 0;
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
        yloc += 1;
      } else if (xloc < tileColCount - 1 && tiles[xloc + 1][yloc].state != 'w') {
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
        xloc += 1;
      } else {
        currcase = 2;
      }
    }
  }

  if (pathFound) {
    can_run = true;
  } else {
    can_run = false;
  }
}

function solveDijkstras() {

  resetpathonly();
  draw(tileColCount, tileRowCount);

  algorithm_used = "Dijkstra";

  document.getElementById('RunBtn')
    .innerHTML = "RUN Dijkstra's";
  document.getElementById('catch')
    .style.fontSize = "1.0em";
  document.getElementById('catch')
    .innerHTML = "<strong><strong>DIJKSTRA'S </strong></strong> IS A WEIGHTED ALGORITHM WHICH EXPLORES ALL OF THE NEIGHBOUR NODES AT THE PRESENT DEPTH TO FIND <strong><strong>SHORTEST PATH</strong></strong>";

  var Xqueue = [startX];
  var Yqueue = [startY];


  xloc = startX;
  yloc = startY;

  FPS = 20;

  can_run = false;

  var pathFound = false;

  while (Xqueue.length > 0 && !pathFound) {
    xloc = Xqueue.shift();
    yloc = Yqueue.shift();

    if (tiles[xloc][yloc] != 's' && tiles[xloc][yloc] != 'f')
      store_path.push([xloc, yloc, 'v']);

    if (xloc > 0) {
      if (tiles[xloc - 1][yloc].state == 'f') {
        pathFound = true;
      }
    }
    if (xloc < tileColCount - 1) {
      if (tiles[xloc + 1][yloc].state == 'f') {
        pathFound = true;
      }
    }
    if (yloc > 0) {
      if (tiles[xloc][yloc - 1].state == 'f') {
        pathFound = true;
      }
    }
    if (yloc < tileRowCount - 1) {
      if (tiles[xloc][yloc + 1].state == 'f') {
        pathFound = true;
      }
    }

    if (xloc > 0) {
      if (tiles[xloc - 1][yloc].state == 'e') {
        Xqueue.push(xloc - 1);
        Yqueue.push(yloc);
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';

      }
    }
    if (xloc < tileColCount - 1) {
      if (tiles[xloc + 1][yloc].state == 'e') {
        Xqueue.push(xloc + 1);
        Yqueue.push(yloc);
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';

      }
    }
    if (yloc > 0) {
      if (tiles[xloc][yloc - 1].state == 'e') {
        Xqueue.push(xloc);
        Yqueue.push(yloc - 1);
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';

      }
    }
    if (yloc < tileRowCount - 1) {
      if (tiles[xloc][yloc + 1].state == 'e') {
        Xqueue.push(xloc);
        Yqueue.push(yloc + 1);
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';

      }
    }
  }
  if (pathFound) {
    can_run = true;
  } else {
    can_run = false;
  }
}

function solveDFS() {

  resetpathonly();
  draw(tileColCount, tileRowCount);

  algorithm_used = 'DFS';

  document.getElementById('RunBtn')
    .innerHTML = 'RUN DFS!';

  document.getElementById('catch')
    .style.fontSize = "1.1em";
  document.getElementById('catch')
    .innerHTML = '<strong><strong>DEPTH-FIRST-SEARCH</strong></strong> EXPLORES ALONG EACH BRANCH OF A NODE AS FAR AS POSSIBLE BEFORE <strong><strong> BACKTRACKING</strong></strong> TO FIND A <strong><strong>PATH</strong></strong>';

  var visited = [];
  for (c = 0; c < tileColCount; c++) {
    visited[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      visited[c][r] = false;
    }
  }

  FPS = 15;

  var pathFound = false;
  var Xstack = new Array();
  var Ystack = new Array();

  Xstack.push(startX);
  Ystack.push(startY);

  xloc = startX;
  yloc = startY;

  while (Xstack.length != 0 && !pathFound) {
    xloc = Xstack.pop();
    yloc = Ystack.pop();


    if (tiles[xloc][yloc] != 's' && tiles[xloc][yloc] != 'f')
      store_path.push([xloc, yloc, 'v']);

    if (xloc > 0) {
      if (!visited[xloc - 1][yloc] && tiles[xloc - 1][yloc].state == 'f') {
        visited[xloc - 1][yloc] = true;
        pathFound = true;
      }
    }
    if (yloc > 0) {
      if (!visited[xloc][yloc - 1] && tiles[xloc][yloc - 1].state == 'f') {
        visited[xloc][yloc - 1] = true;
        pathFound = true;
      }
    }
    if (xloc < tileColCount - 1) {
      if (!visited[xloc + 1][yloc] && tiles[xloc + 1][yloc].state == 'f') {
        visited[xloc + 1][yloc] = true;
        pathFound = true;
      }
    }
    if (yloc < tileRowCount - 1) {
      if (!visited[xloc][yloc + 1] && tiles[xloc][yloc + 1].state == 'f') {
        visited[xloc][yloc + 1] = true;
        pathFound = true;
      }
    }
    if (xloc > 0) {
      if (!visited[xloc - 1][yloc] && tiles[xloc - 1][yloc].state == 'e') {
        visited[xloc - 1][yloc] = true;
        Xstack.push(xloc - 1);
        Ystack.push(yloc);
        tiles[xloc - 1][yloc].state = tiles[xloc][yloc].state + 'l';
      }
    }
    if (yloc > 0) {
      if (!visited[xloc][yloc - 1] && tiles[xloc][yloc - 1].state == 'e') {
        visited[xloc][yloc - 1] = true;
        Xstack.push(xloc);
        Ystack.push(yloc - 1);
        tiles[xloc][yloc - 1].state = tiles[xloc][yloc].state + 'u';
      }
    }
    if (xloc < tileColCount - 1) {
      if (!visited[xloc + 1][yloc] && tiles[xloc + 1][yloc].state == 'e') {
        visited[xloc + 1][yloc] = true;
        Xstack.push(xloc + 1);
        Ystack.push(yloc);
        tiles[xloc + 1][yloc].state = tiles[xloc][yloc].state + 'r';
      }
    }
    if (yloc < tileRowCount - 1) {
      if (!visited[xloc][yloc + 1] && tiles[xloc][yloc + 1].state == 'e') {
        visited[xloc][yloc + 1] = true;
        Xstack.push(xloc);
        Ystack.push(yloc + 1);
        tiles[xloc][yloc + 1].state = tiles[xloc][yloc].state + 'd';
      }
    }
  }
  if (pathFound) {
    can_run = true;
  } else can_run = false;
}

function run() {
  if (can_run) {
    cancelAnimationFrame(reqanimate);
    var path = tiles[xloc][yloc].state;
    var pathLength = path.length;
    var currX = startX;
    var currY = startY;

    if (pathLength > 1) {
      for (c = 0; c < tileColCount; c++) {
        visitfinal[c] = [];
        for (r = 0; r < tileRowCount; r++)
          visitfinal[c][r] = 0;
      }
      for (i = 0; i < pathLength; i++) {
        if (path.charAt(i + 1) == 'u') {
          currY -= 1;
        } else if (path.charAt(i + 1) == 'd') {
          currY += 1;
        } else if (path.charAt(i + 1) == 'r') {
          currX += 1;
        } else if (path.charAt(i + 1) == 'l') {
          currX -= 1;
        }

        if (tiles[currX][currY] != 's') {
          store_path.push([currX, currY, 'p']);
          tiles[currX][currY].state = 'x';
          visitfinal[currX][currY] += 1;
        }
      }

      animatePath();

    }
    xloc = startX;
    yloc = startY;
    can_run = false;

  } else if (algorithm_used.length == 0) {
    document.getElementById('RunBtn')
      .innerHTML = 'PICK AN ALGO!';
    document.getElementById('catch')
      .innerHTML = "PICK SOMETHING!";
  } else {
    resetpathonly();
    document.getElementById('RunBtn')
      .innerHTML = 'NO SOLUTION!';
    document.getElementById('catch')
      .innerHTML = "PICK SOMETHING!";
  }
}

/*-------------------------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------------------------*/

function irun() {
  if (can_run) {
    var path = tiles[xloc][yloc].state;
    var pathLength = path.length;
    var currX = startX;
    var currY = startY;

    for (c = 0; c < tileColCount; c++) {
      visitfinal[c] = [];
      for (r = 0; r < tileRowCount; r++)
        visitfinal[c][r] = 0;
    }
    for (var i = 0; i < pathLength; i++) {
      if (path.charAt(i + 1) == 'u') {
        currY -= 1;
      } else if (path.charAt(i + 1) == 'd') {
        currY += 1;
      } else if (path.charAt(i + 1) == 'r') {
        currX += 1;
      } else if (path.charAt(i + 1) == 'l') {
        currX -= 1;
      }
      if (tiles[currX][currY] != 's') {
        store_path.push([currX, currY, 'p']);
        tiles[currX][currY].state = 'x';
        visitfinal[currX][currY] += 1;
      }
    }
    draw(tileColCount, tileRowCount);
    xloc = startX;
    yloc = startY;
    can_run = false;
    store_path = [];
    for (c = 0; c < tileColCount; c++) {
      for (r = 0; r < tileRowCount; r++) {
        if (tiles[c][r].state == 's' || tiles[c][r].state == 'f')
          continue;
        else if (walls[c][r]) {
          tiles[c][r].state = 'w';
        } else if (!walls[c][r]) {
          tiles[c][r].state = 'e';
        }
      }
    }
    tiles[startX][startY].state = 's';
    tiles[finalX][finalY].state = 'f';
  } else {
    resetpathonly();
    document.getElementById('RunBtn')
      .innerHTML = 'NO SOLUTION!';
    document.getElementById('catch')
      .innerHTML = "PICK SOMETHING!";
  }

}
var is_start = false;
var prev_x = startX;
var prev_y = startY;

var is_end = false;
var last_x = finalX;
var last_y = finalY;

function myMove(e) {
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  if (is_start) {
    for (c = 0; c < tileColCount; c++) {
      for (r = 0; r < tileRowCount; r++) {
        if (c * (tileW + border) < x && x < c * (tileW + border) + tileW && r * (tileH + border) < y && y < r * (tileH + border) + tileH) {
          if (tiles[c][r].state == 'f') {
            tiles[prev_x][prev_y].state = 'f';
            finalX = prev_x;
            finalY = prev_y;
          } else if (walls[prev_x][prev_y])
            tiles[prev_x][prev_y].state = 'w';
          else
            tiles[prev_x][prev_y].state = 'e';
          tiles[c][r].state = 's';
          startX = c;
          startY = r;
          prev_x = startX;
          prev_y = startY;
        }
      }
    }
    if (algorithm_used.localeCompare('BFS') == 0) {
      solveBFS();
      irun();
    } else if (algorithm_used.localeCompare('DFS') == 0) {
      solveDFS();
      irun();
    } else if (algorithm_used.localeCompare('Dijkstra') == 0) {
      solveDijkstras();
      irun();
    } else if (algorithm_used.localeCompare('ASTAR') == 0) {
      solveastar();
      irun();
    } else if (algorithm_used.localeCompare('LWF') == 0) {
      solveLWF();
      irun();
    } else if (algorithm_used.localeCompare('RWF') == 0) {
      solveRWF();
      irun();
    } else {
      draw(tileColCount, tileRowCount)
    }
  } else if (is_end) {
    for (c = 0; c < tileColCount; c++) {
      for (r = 0; r < tileRowCount; r++) {
        if (c * (tileW + border) < x && x < c * (tileW + border) + tileW && r * (tileH + border) < y && y < r * (tileH + border) + tileH) {
          if (tiles[c][r].state == 's') {
            tiles[last_x][last_y].state = 's';
            startX = last_x;
            startY = last_y;
          } else if (walls[last_x][last_y])
            tiles[last_x][last_y].state = 'w';
          else
            tiles[last_x][last_y].state = 'e';
          tiles[c][r].state = 'f';
          finalX = c;
          finalY = r;
          last_x = finalX;
          last_y = finalY;
        }
      }
    }
    if (algorithm_used.localeCompare('BFS') == 0) {
      solveBFS();
      irun();
    } else if (algorithm_used.localeCompare('DFS') == 0) {
      solveDFS();
      irun();
    } else if (algorithm_used.localeCompare('Dijkstra') == 0) {
      solveDijkstras();
      irun();
    } else if (algorithm_used.localeCompare('ASTAR') == 0) {
      solveastar();
      irun();
    } else if (algorithm_used.localeCompare('LWF') == 0) {
      solveLWF();
      irun();
    } else if (algorithm_used.localeCompare('RWF') == 0) {
      solveRWF();
      irun();
    } else {
      draw(tileColCount, tileRowCount)
    }
  } else {
    for (c = 0; c < tileColCount; c++) {
      for (r = 0; r < tileRowCount; r++) {
        if (c * (tileW + border) < x && x < c * (tileW + border) + tileW && r * (tileH + border) < y && y < r * (tileH + border) + tileH) {
          if (tiles[c][r].state == 'e' && (c != boundX || r != boundY)) {
            tiles[c][r].state = 'w';
            walls[c][r] = true;
            boundX = c;
            boundY = r;
          } else if (tiles[c][r].state == 'w' && (c != boundX || r != boundY)) {
            tiles[c][r].state = 'e';
            walls[c][r] = false;
            boundX = c;
            boundY = r;
          }
        }
      }
    }
    draw(tileColCount, tileRowCount);
  }
}

function myDown(e) {
  cancelAnimationFrame(reqanimate);
  store_path = [];
  resetpathonly();
  draw(tileColCount, tileRowCount);
  canvas.onmousemove = myMove;
  canvas.onmousemove = myMove;
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  if (startX * (tileW + border) < x && x < startX * (tileW + border) + tileW && startY * (tileH + border) < y && y < startY * (tileH + border) + tileH) {
    is_start = true;
  } else if (finalX * (tileW + border) < x && x < finalX * (tileW + border) + tileW && finalY * (tileH + border) < y && y < finalY * (tileH + border) + tileH) {
    is_end = true;
  } else {
    for (c = 0; c < tileColCount; c++) {
      for (r = 0; r < tileRowCount; r++) {
        if (c * (tileW + border) < x && x < c * (tileW + border) + tileW && r * (tileH + border) < y && y < r * (tileH + border) + tileH) {
          if (tiles[c][r].state == 'e') {
            tiles[c][r].state = 'w';
            walls[c][r] = true;
            boundX = c;
            boundY = r;
          } else if (tiles[c][r].state == 'w') {
            tiles[c][r].state = 'e';
            walls[c][r] = false;
            boundX = c;
            boundY = r;
          }
        }
      }
    }
    draw(tileColCount, tileRowCount);
  }

}

function myUp(e) {
  if (is_start) {
    walls[startX][startY] = false;
    is_start = false;
  }
  if (is_end) {
    walls[finalX][finalY] = false;
    is_end = false;
  }
  canvas.onmousemove = null;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
