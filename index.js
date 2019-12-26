var myGamePiece;
var myObstacles = [];
var myScore;
function startGame() {
  myGamePiece = new component(30, 30, "smiley.gif", 10, 120,"image");
  myScore = new component("30px", "Consolas", "black", 280, 40, "text");
  myGameArea.start();
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
          ctx.font = this.width + " " + this.height;
          ctx.fillStyle = color;
          ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "image"){
            ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
        }else{    
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
      crash = false;
    }
        return crash;
    }
}
function updateGameArea() {
      this.speedX=0;
      this.speedY=0;
      if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1;}
      if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1;}
      if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1;}
      if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1;}
      var x, y, height, gap, minHeight, maxHeight, minGap, maxGap;
      for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
          myGameArea.stop();
          return;
        }
      }
      myGameArea.clear();
      myGameArea.frameNo += 1;
      if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        minWidth = 10;
        maxWidth = 50;
        width = Math.floor(Math.random()*(maxWidth-minWidth+1) + minWidth)
        myObstacles.push(new component(width, height, "green", x, 0));
        myObstacles.push(new component(width, x - height - gap, "green", x, height + gap));
      }

      for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
      }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();  
    myGamePiece.update();
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    this.frameNo = 0;
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
      myGamePiece.image.src="angry.gif";
      myGamePiece.update();
    })
    window.addEventListener('keyup', function (e) {
        myGameArea.keys[e.keyCode] = false;
        myGamePiece.image.src="smiley.gif";
        myGamePiece.update();
    })    
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

function restart(){
    //myGameArea = null;
    //myGamePiece = null;
    //myStatusBar = null;
    //myScroe =null;
    myObstacles = [];
    startGame();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function onDocumentLoad() {
    startGame();
}
document.addEventListener('DOMContentLoaded', onDocumentLoad);
