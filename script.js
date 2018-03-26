// draw the checkerboard
"use strict";
function GameBoard(canvas) {
	var gb = this;
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.size = Math.min(canvas.width, canvas.height);
	this.pieces = [];
	this.selectedPiece = null;
	//how to select & move pieces
	canvas.addEventListener('click', function(evt) {
		var rect = canvas.getBoundingClientRect();
		var x = evt.clientX - rect.left;
		var y = evt.clientY - rect.top;
		var column = Math.floor(x/(gb.size/8));
		var row = Math.floor(y/(gb.size/8));
		//alert("got column = " + column + ", row = " + row);
		if (!gb.selectedPiece) {
			console.log("piece selected");
			gb.selectedPiece = gb.getPiece(column, row);
			gb.draw();
		} else if (gb.selectedPiece.column == column && gb.selectedPiece.row == row) {
			gb.deselect();
		} else {
			gb.movePiece(column, row);
		
		} 
	});
}

GameBoard.prototype.initializePieces = function() {
	for (var column = 0; column < 8; column+=2) {
		this.pieces.push(new Checker(column, 1, "red", 1));
		this.pieces.push(new Checker(column, 5, "black", -1));
		this.pieces.push(new Checker(column, 7, "black", -1));
		this.pieces.push(new Checker(column+1, 0, "red", 1));
		this.pieces.push(new Checker(column+1, 2, "red", 1));
		this.pieces.push(new Checker(column+1, 6, "black", -1));
	}
}

GameBoard.prototype.getPiece = function (column, row) {
	var thatPiece = null;
	for (var i = 0; i <this.pieces.length; i++) {
		if (this.pieces[i].column == column && this.pieces[i].row == row) {
			thatPiece = this.pieces[i];
		}
	}
	return thatPiece;
};

GameBoard.prototype.deselect = function() {
	console.log("deselecting");
	this.selectedPiece = null;
	this.draw();
}

GameBoard.prototype.canMoveTo = function (piece, column, row) {
	var dcolumn = column - piece.column;
	var drow = row - piece.row;
	console.log('dcolumn = ' + dcolumn + ', drow = ' + drow);
	if (this.getPiece(column, row)) {
		console.log('cannot move piece - space occupied');
		return false;
	} else if (Math.abs(dcolumn)!=1) {
		console.log('cannot move piece - not dcolumn 1');
		return false;
	} else if (drow!=piece.rowDirection) {
		console.log('cannot move piece - drow != rowDirection ' + piece.rowDirection);
		return false;
	} else {
		return true;
	}
};

GameBoard.prototype.canJumpTo = function (piece, column, row) {
	var dcolumn = column - piece.column;
	var drow = row - piece.row;
	if (this.getPiece(column, row)) {
		console.log('cannot jump there - space occupied');
		return false;
	} else if (Math.abs(dcolumn)!=2) {
		console.log('cannot jump there - dcolumn!=2');
		return false;
	} else if ((drow/2)!=piece.rowDirection) {
		console.log('cannot jump there - jump is in wrong direction'); 
		return false;
	}
	var jumpedPiece = this.getPiece(column-dcolumn/2, row-drow/2);
	if (!jumpedPiece) {
		return false;
	}
	return true
};

GameBoard.prototype.movePiece = function(column, row) {
	if (!this.selectedPiece) {
		console.log("cannot move piece - no piece selected");
	}
	if (this.canMoveTo(this.selectedPiece, column, row)) {
		console.log("moving piece");
		this.selectedPiece.column = column;
		this.selectedPiece.row = row;
		this.deselect();
	} else {
		console.log('cannot move piece to ' + column + ', ' + row);
	}
};

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
	console.log("found", this.selectedPiece);
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
	this.context.fillStyle = checker.color;
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



