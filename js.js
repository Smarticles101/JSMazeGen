var can = document.getElementById("canv");
var ctx = can.getContext("2d");

var cells=[];
var stack=[];

var h = can.height/50;
var w = can.width/50;
for(var i = 0; i<50; i++) {
    cells[i] = [];
    for(var ii = 0; ii<50; ii++) {
        cells[i][ii] = new Cell(i, ii, w, h);
    }
}

function Cell(xGrid,yGrid,width,height) {
    this.x=xGrid*width;
    this.y=yGrid*height;
    this.xGrid=xGrid;
    this.yGrid=yGrid;
    this.w=width;
    this.h=height;
    this.walls=[true,true,true,true];
    this.visited=false;
    this.color="#FFFFFF";
    // walls are north east south and west
    this.draw=function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x,this.y,this.w,this.h);
        
        context.strokeStyle = "#000000";
        context.beginPath();
        if(this.walls[0]) {
            context.moveTo(this.x,this.y);
            context.lineTo(this.x+this.w,this.y);
        }
        if(this.walls[1]) {
            context.moveTo(this.x+this.w,this.y);
            context.lineTo(this.x+this.w,this.y+this.h);
        }
        if(this.walls[2]) {
            context.moveTo(this.x+this.w,this.y+this.h);
            context.lineTo(this.x,this.y+this.h);
        }
        if(this.walls[3]) {
            context.moveTo(this.x,this.y+this.h);
            context.lineTo(this.x,this.y);
        }
        context.stroke();
    };
    
    this.neighbors = function() {
        var neighbors = [];

        var top;
        var right;
        var bottom;
        var left;

        if(cells[xGrid]) {
            top = cells[xGrid][yGrid-1];
            bottom = cells[xGrid][yGrid+1];
        }
        
        if(cells[xGrid+1]) {
            right  = cells[xGrid+1][yGrid];
        }
        
        if(cells[xGrid-1]) {
            left   = cells[xGrid-1][yGrid];
        }

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }
        return neighbors;
    };
}

cells[0][0].visited=true;
var currentCell = cells[0][0];
currentCell.color = "#004C00";

function drawMaze() {
    ctx.clearRect(0,0,can.width,can.height);
    for(var i = 0; i<cells.length; i++) {
        for(var ii = 0; ii<cells[i].length; ii++) {
            cells[i][ii].draw(ctx);
        }
    }
}

// do the magic here
function maze() {
    //while(!visited()) {
    var neighbors = currentCell.neighbors();
    var r = Math.floor(Math.random()*neighbors.length);
    var newCell = neighbors[r];
    
    if(neighbors.length!=0) {
        newCell.color = "#0000E5";
        newCell.visited = true;
        stack.push(currentCell);
        
        var x = currentCell.xGrid - newCell.xGrid;
        var y = currentCell.yGrid - newCell.yGrid;
        if(x==1) {
            currentCell.walls[3] = false;
            newCell.walls[1] = false;
        } else if(x==-1) {
            currentCell.walls[1] = false;
            newCell.walls[3]=false;
        }
        
        if(y==1) {
            currentCell.walls[0] = false;
            newCell.walls[2] = false;
        } else if(y==-1) {
            currentCell.walls[2] = false;
            newCell.walls[0] = false;
        }
        drawMaze();
        newCell.color="#004C00";
        currentCell = newCell;
    } else if(stack.length>0) {
        currentCell = stack.pop();
    }
    
    if(visited()) {
        sol();
    }
    
    //}
}

function visited() {
    for(var i = 0; i<cells.length; i++) {
        for(var ii = 0; ii<cells[i].length; ii++) {
            if(!cells[i][ii].visited) {
                return false;
            }
        }
    }
    return true;
}


    var dirX = 0;
    var dirY = 0;
    var x = 0;
    var y = 0;
    var newCell = cells[x][y];
    var triggered = false;
    var goalX = cells.length-1;
    var goalY = cells[0].length-1; 

function solve() {
    newCell.color="#0000E5";
    if(x==goalX&&y===goalY) { return; }
    
    drawMaze();
    newCell.visited = true;
        if(!newCell.walls[0] && dirY!=1 && y-1>=0 && !cells[x][y-1].visited) {
            dirX = 0;
            dirY = -1;
        } else if(!newCell.walls[1] && dirX!=-1 && x+1<cells.length && !cells[x+1][y].visited) {
            dirY = 0;
            dirX = 1;
        } else if(!newCell.walls[2] && dirY!=-1 && y+1<cells[x].length && !cells[x][y+1].visited) {
            dirX = 0;
            dirY = 1;
        } else if(!newCell.walls[3] && dirX!=1 && x-1>=0 && !cells[x-1][y].visited) {
            dirY = 0;
            dirX = -1;
        } else {
            dirX=0;
            dirY=0;
            newCell.color = "#004C00";
            newCell = stack.pop();
            x = newCell.xGrid;
            y = newCell.yGrid;
            return;
        }
        x+=dirX;
        y+=dirY;
        newCell.color="#FF69C4";
        stack.push(newCell);
        newCell = cells[x][y];
}

function sol() {
    window.clearInterval(gameLoopHandle);
    stack = [];             // reset the stack, we will use it to solve the maze
    for(var i = 0; i<cells.length; i++) {
        for(var ii = 0; ii<cells[i].length; ii++) {
            cells[i][ii].visited = false;   // reset the visited cells
        }
    }

    gameLoopHandle = window.setInterval(solve, 1);
}

//maze();
//drawMaze();
var gameLoopHandle = window.setInterval(maze, 1);
