"use strict";

/*
to-do list:
-flashy win condition
-only select your own pieces, before you finish moving
-must jump if able
-3D display
*/

// draw the checkerboard
function GameBoard(canvas) {
	var gb = this;
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.size = Math.min(canvas.width, canvas.height);
	this.pieces = [];
	this.selectedPiece = null;
	this.currentTurn = "red";
	this.moveType = null;
	//how to select & move pieces
	canvas.addEventListener('click', function(evt) {
		var rect = canvas.getBoundingClientRect();
		var x = evt.clientX - rect.left;
		var y = evt.clientY - rect.top;
		var column = Math.floor(x/(gb.size/8));
		var row = Math.floor(y/(gb.size/8));
		//alert("got column = " + column + ", row = " + row);
		gb.clickOnSquare(column, row);
	});
	canvas.addEventListener('dblclick', function(evt) {
		if (gb.moveType) {
			if (gb.currentTurn == "red") {
				gb.currentTurn = "black";
				gb.draw();
				console.log("black's turn");
			} else if (gb.currentTurn == "black") {
				gb.currentTurn = "red";
				gb.draw();
				console.log("red's turn");
			}
			gb.moveType = null;
		}
	});
} 

//click -> select a new piece, deselect piece, or move slected piece
GameBoard.prototype.clickOnSquare= function(column, row) {
	var target = this.getPiece(column, row);
	
	if (!this.selectedPiece) {
		if (target && (target.color == this.currentTurn) && (!this.moveType)) {
			console.log("piece selected");
			this.selectedPiece = this.getPiece(column, row);
			this.draw();
		} else {
			console.log("cannot select")
		}
	} else if (this.selectedPiece.column == column && this.selectedPiece.row == row) {
		this.deselect();
	} else {
		this.movePiece(column, row);
	} 
}

//lay out starting pieces both sides
GameBoard.prototype.initializePieces = function() {
	for (var column = 0; column < 8; column+=2) {
		this.pieces.push(new Checker(column, 1, "red", 1));
		this.pieces.push(new Checker(column, 5, "black", -1));
		this.pieces.push(new Checker(column, 7, "black", -1));
		this.pieces.push(new Checker(column+1, 0, "red", 1));
		this.pieces.push(new Checker(column+1, 2, "red", 1));
		this.pieces.push(new Checker(column+1, 6, "black", -1));
	}
	//also set first turn?
	this.currentTurn = "red";
}

//get a piece object based on location
GameBoard.prototype.getPiece = function (column, row) {
	var thatPiece = null;
	for (var i = 0; i <this.pieces.length; i++) {
		if (this.pieces[i].column == column && this.pieces[i].row == row) {
			thatPiece = this.pieces[i];
		}
	}
	return thatPiece;
};

//capture a piece (mainly used when jumping)
GameBoard.prototype.removePiece = function (column, row) {
	var index = null;
	for (var i = 0; i <this.pieces.length; i++) {
		if (this.pieces[i].column == column && this.pieces[i].row == row) {
			index = i;
		}
	} 
	this.pieces.splice(index, 1);
}

//simple deselect
GameBoard.prototype.deselect = function() {
	//console.log("deselecting");
	this.selectedPiece = null;
	this.draw();
}

//test legality of stepping a given piece to a given place
GameBoard.prototype.canStepTo = function (piece, column, row) {
	var dcolumn = column - piece.column;
	var drow = row - piece.row;
	//console.log('dcolumn = ' + dcolumn + ', drow = ' + drow);
	if (this.moveType != null) {
		console.log("cannot step piece - moveType = " + this.moveType)
		return false;
	} else if (this.getPiece(column, row)) {
		console.log('cannot step piece - space occupied');
		return false;
	} else if (Math.abs(dcolumn)!=1) {
		console.log('cannot step piece - not dcolumn 1');
		return false;
	} else if (drow!=piece.rowDirection) {
		console.log('cannot step piece - drow != rowDirection ' + piece.rowDirection);
		return false;
	} else {
		return true;
	}
};

//test legality of jumping a given piece to a given place
GameBoard.prototype.canJumpTo = function (piece, column, row) {
	var dcolumn = column - piece.column;
	var drow = row - piece.row;
	if (this.moveType == "step") {
		console.log("cannot jump with piece - moveType = " + this.moveType)
		return false;
	} else if (this.getPiece(column, row)) {
		console.log('cannot jump there - space occupied');
		return false;
	} else if (Math.abs(dcolumn)!=2) {
		console.log('cannot jump there - dcolumn!=2');
		return false;
	} else if ((drow/2)!=piece.rowDirection) {
		console.log('cannot jump there - jump is in wrong direction'); 
		return false;
	}
	var jumpedPiece = this.getPiece(column-(dcolumn/2), row-(drow/2));
	if (!jumpedPiece || (jumpedPiece.color == piece.color)) {
		return false;
	}
	return true

};

//attampts to step a piece one space (diagonally) forward
GameBoard.prototype.stepPiece = function(column, row) {
	if (!this.selectedPiece) {
		console.log("cannot step piece - no piece selected");
		return;
	}
	if (this.canStepTo(this.selectedPiece, column, row)) {
		//console.log("moving piece");
		this.selectedPiece.column = column;
		this.selectedPiece.row = row;
		this.deselect();
		this.moveType = "step";
	} else {
		console.log('cannot step piece to ' + column + ', ' + row);
	}
};

//attampts to jump a piece (diagonally) over another, capturing it
GameBoard.prototype.jumpPiece = function(column, row) {
	//will be a function for jumping, separate from stepping
	if (!this.selectedPiece) {
		console.log("cannot jump piece - no piece selected");
		return;
	}
	if (this.canJumpTo(this.selectedPiece, column, row)) {
		console.log("removing piece");
		this.removePiece((this.selectedPiece.column + column)/2, (this.selectedPiece.row + row)/2);
		console.log("moving piece");
		this.selectedPiece.column = column;
		this.selectedPiece.row = row;
		this.deselect();
		this.moveType = "jump";
	} else {
		console.log('cannot jump piece to ' + column + ', ' + row);
	}
};

//jump, step, or do nothing
GameBoard.prototype.movePiece = function(column, row) {
	if (this.currentTurn != this.selectedPiece.color) {
		console.log("not " + this.selectedPiece.color + "'s turn to move")
	} else if (this.canJumpTo(this.selectedPiece, column, row)) {
		this.jumpPiece(column, row);
		console.log("can jump");
	} else if (this.canStepTo(this.selectedPiece, column, row)) {
		this.stepPiece(column, row);
		console.log("can step");
	} else {
		console.log("invalid move");
	}	
};

//draw all squares and pieces
GameBoard.prototype.draw = function() {
	//blank slate
	this.context.fillStyle = "white";
	this.context.fillRect(0, 0, this.size, this.size);
	//draw squares
	var b = false;
	this.context.fillStyle = "grey";
	for (var ix = 0; ix < 8; ix++) {
	 	for (var iy = 0; iy < 8; iy++) {
			if (b) {
				this.context.fillRect(ix*this.size/8, iy*this.size/8, this.size/8, this.size/8);
			}
			b = !b;
		}
		b = !b;
	}
	if (this.selectedPiece) {
		this.context.fillStyle = "green";
		this.context.fillRect(this.selectedPiece.column*this.size/8, this.selectedPiece.row*this.size/8, this.size/8, this.size/8);
	}
	//draw current pieces
	for (var i = 0; i < this.pieces.length; i++) {
		this.drawPiece(this.pieces[i]);
	}
};

function Checker(column, row, color, direction) {
	this.column = column;
	this.row = row;
	this.color = color;
	this.rowDirection = direction;
	//positive 1 means down the y-axis, negative 1 means up
}


GameBoard.prototype.drawPiece = function(checker) {
	if ((checker.color == "red") && (this.currentTurn == "red")) {
		this.context.fillStyle = "red";
	} else if ((checker.color == "red") && (this.currentTurn == "black")) {
		this.context.fillStyle = "tomato";
	} else if ((checker.color == "black") && (this.currentTurn == "black")) {
		this.context.fillStyle = "black";
	} else if ((checker.color == "black") && (this.currentTurn == "red")) {
		this.context.fillStyle = "darkslategrey";
	}
	this.context.beginPath();
	this.context.arc((this.size/16)+(checker.column*(this.size/8)), (this.size/16)+(checker.row*(this.size/8)), (this.size/17), 0, 2*Math.PI);
	this.context.closePath();
	this.context.fill();
	this.context.lineWidth = 2;
	this.context.stroke();
};

//------------------------------------------
// Set up!
var a_canvas = document.getElementById("a");
var checkBoard = new GameBoard(a_canvas);
checkBoard.initializePieces();
checkBoard.draw();

/*
Rules: 	-pieces move to the spaces diagonally in front of them
	-if a piece can jump over an opposing piece (in one of the spaces diagonally in front of it) it MUST take the jump
	-if >1 jump is available, player can choose which one to take
*/





