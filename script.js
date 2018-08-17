"use strict";

/*
to-do list:
-must jump if able (?)
-3D display
*/

// draw the checkerboard
function GameBoard(renderer) {
	var gb = this;
	this.canvas = renderer.domElement;
	this.context = renderer.getContext();
	this.size = Math.min(this.canvas.width, this.canvas.height);
	this.pieces = [];
	this.selectedPiece = null;
	this.moveType = null;
	this.currentTurn = "red";
	this.winner = null;
	console.log("canvas width = " + this.canvas.width+ ", canvas height = " + this.canvas.height);
	console.log("boardsize = " + (0.9*this.size));
	
	//how to select & move pieces
	this.canvas.addEventListener('click', function(evt) {
		if (gb.hasGameEnded()) {
			return;
		}
		//coords of click within 2d canvas
		var rect = gb.canvas.getBoundingClientRect();
		var x = evt.clientX - rect.left;
		var y = evt.clientY - rect.top;
		console.log("click screen coords: x = " + x + ", y = " + y);

		//coords & dimensions of board within 2d canvas
		var boardHeight = 0.49 * gb.canvas.height;
		var boardTopLength = 0.49 * gb.canvas.height;
		var boardBottomLength = gb.canvas.height;
		var sceneCenterX = gb.canvas.width/2;
		var sceneCenterY = gb.canvas.height/2;
		var TopLeftX = sceneCenterX - (boardTopLength/2);
		var BottomLeftX = sceneCenterX - (boardBottomLength/2);
		var TopRightX = TopLeftX + boardTopLength;
		var BottomRightX = BottomLeftX + boardBottomLength;
		var TopY = sceneCenterY - (0.37 * boardHeight); 
		var BottomY = TopY + boardHeight;

		/* proportion testing table
			canvas width | canvas height | upper left | lower left | upper right | scene center
			1083		  623			  (392, 200)   (232, 504)   (694, 197)	  (543, 308)
			768			  524			  (258, 168)   (126, 421)   (513, 168)    (385, 259)
			617			  625			  (163, 200)   (8, 505)		(458, 200)	  (311, 308)
			340			  351			  (171, 176)   (90, 114)    (2, 285)      (252, 112)
		*/

		//coords of click within board
		var leftEdgePointX = BottomLeftX + ((TopLeftX - BottomLeftX) * ((y - BottomY)/(TopY-BottomY)));
		var rightEdgePointX = BottomRightX + ((TopRightX - BottomRightX) * ((y - BottomY)/(TopY-BottomY)));
		if ((y >= TopY) && (y <= BottomY) && (x >= leftEdgePointX) && (x <= rightEdgePointX)) {
			//find column
			var column = Math.floor(((x - leftEdgePointX)/(rightEdgePointX - leftEdgePointX)) * 8);

			//find row
			var row = -1;
			var rowHeight = .06 * boardHeight;
			var rowHeightChange = (boardHeight - (8 * rowHeight))/28;
			var rowBottom = TopY + rowHeight;
			var foundRow = false; 
			while(foundRow == false) {
				row++;
				if (y < rowBottom) {
					foundRow = true;
				}
				rowHeight += rowHeightChange;
				rowBottom += rowHeight;
			}
			
			console.log("got column = " + column + ", row = " + row);
			gb.clickOnSquare(column, row);
		}
	});
	this.canvas.addEventListener('dblclick', function(evt) {
		//check if game ended
		if (gb.hasGameEnded()) {
			this.draw3D();
			console.log("ending game");
			return;
		}
		//change turns if able
		if (gb.moveType) {
			if (gb.currentTurn == "red") {
				gb.currentTurn = "black";
				gb.deselect();
				console.log("black's turn");
			} else if (gb.currentTurn == "black") {
				gb.currentTurn = "red";
				gb.deselect();
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
			this.draw3D();
		} else {
			console.log("cannot select")
		}
	} else if (this.selectedPiece.column == column && this.selectedPiece.row == row) {
		console.log("deslecting piece");
		this.deselect();
	} else {
		console.log("moving piece");
		this.movePiece(column, row);
	} 
}

//lay out starting pieces both sides
GameBoard.prototype.initializePieces = function() {
	for (var column = 0; column < 8; column+=2) {
		this.pieces.push(new Checker(column, 1, "red", 1, false));
		this.pieces.push(new Checker(column, 5, "black", -1, false));
		this.pieces.push(new Checker(column, 7, "black", -1, false));
		this.pieces.push(new Checker(column+1, 0, "red", 1, false));
		this.pieces.push(new Checker(column+1, 2, "red", 1, false));
		this.pieces.push(new Checker(column+1, 6, "black", -1, false));
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
	console.log("deselecting");
	this.selectedPiece = null;
	this.draw3D();
}


//return true if either side has won, and set victory color accordingly; otherwise, false
GameBoard.prototype.hasGameEnded = function() {
	var firstColor = this.pieces[0].color;
	for (var i = 0; i <this.pieces.length; i++) {
		if (this.pieces[i].color != firstColor) {
			return false;
		}
	}
	this.winner = firstColor;
	return true;
}

//test legality of stepping a given piece to a given place
GameBoard.prototype.canStepTo = function (piece, column, row) {
	var dcolumn = column - piece.column;
	var drow = row - piece.row;
	//console.log('dcolumn = ' + dcolumn + ', drow = ' + drow);
	if (this.moveType != null) {
		//console.log("cannot step piece - moveType = " + this.moveType)
		return false;
	} else if (this.getPiece(column, row)) {
		//console.log('cannot step piece - space occupied');
		return false;
	} else if (Math.abs(dcolumn)!=1) {
		//console.log('cannot step piece - not dcolumn 1');
		return false;
	} else if ((drow!=piece.rowDirection) && (!piece.isKing)) {
		//console.log('cannot step piece - drow != rowDirection ' + piece.rowDirection);
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
		//console.log("cannot jump with piece - moveType = " + this.moveType)
		return false;
	} else if (this.getPiece(column, row)) {
		//console.log('cannot jump there - space occupied');
		return false;
	} else if (Math.abs(dcolumn)!=2) {
		//console.log('cannot jump there - dcolumn!=2');
		return false;
	} else if (((drow/2)!=piece.rowDirection) && (!piece.isKing)) {
		//console.log('cannot jump there - jump is in wrong direction'); 
		return false;
	}
	var jumpedPiece = this.getPiece(column-(dcolumn/2), row-(drow/2));
	if (!jumpedPiece || (jumpedPiece.color == piece.color)) {
		return false;
	}
	return true

};

//attempts to step a piece one space (diagonally) forward
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

//attempts to jump a piece (diagonally) over another, capturing it
GameBoard.prototype.jumpPiece = function(column, row) {
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
		console.log("context = " + this.context);
		this.draw3D();
		this.moveType = "jump";
	} else {
		console.log('cannot jump piece to ' + column + ', ' + row);
	}
};

//jump, step, or do nothing
GameBoard.prototype.movePiece = function(column, row) {
	if (!this.selectedPiece) {
		console.log("cannot move piece - no piece selected");
		return;
	}
	var movingPiece = this.selectedPiece;
	if (this.currentTurn != movingPiece.color) {
		console.log("not " + movingPiece.color + "'s turn to move")
		return;
	} else if (this.canJumpTo(movingPiece, column, row)) {
		this.jumpPiece(column, row);
		console.log("can jump");
	} else if (this.canStepTo(movingPiece, column, row)) {
		this.stepPiece(column, row);
		console.log("can step");
	} else {
		//console.log("invalid move");
		return;
	}	
	if (((movingPiece.color == "red") && (row == 7)) || ((movingPiece.color == "black") && (row == 0))) {
		movingPiece.isKing = true;
	}
};

function Checker(column, row, color, direction, king) {
	this.column = column;
	this.row = row;
	this.color = color;
	this.rowDirection = direction;
	this.isKing = king;
	//positive 1 means down the y-axis, negative 1 means up
}

GameBoard.prototype.draw3D = function() {
	var scene = new THREE.Scene();

	//set camera looking down at board from lower right corner
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10 );
	camera.position.set(0, 1.5, 1.5);
	camera.lookAt(scene.position);
	
	//make blank box @ scene center
	var baseGeometry = new THREE.BoxGeometry(2.0 , 0.2, 2.0);
	var whiteMaterial = new THREE.MeshBasicMaterial( {color: "white", side: THREE.DoubleSide} );
	var mesh1 = new THREE.Mesh(baseGeometry, whiteMaterial);
	scene.add(mesh1);
	var baseEdges = new THREE.EdgesGeometry(baseGeometry);
	var baseLines = new THREE.LineSegments(baseEdges, new THREE.LineBasicMaterial( {color: "black"}));
	scene.add(baseLines);

	/*
	//draw line for 3D event-listener testing
	var lineTestMaterial = new THREE.LineBasicMaterial( {color: "red"});
	var lineTestGeometry1 = new THREE.Geometry();
	lineTestGeometry1.vertices.push(new THREE.Vector3( 2.5, 0, 0) );
	lineTestGeometry1.vertices.push(new THREE.Vector3( -2.5, 0, 0) );
	var lineTestGeometry2 = new THREE.Geometry();
	lineTestGeometry2.vertices.push(new THREE.Vector3( 0, .5, 0) );
	lineTestGeometry2.vertices.push(new THREE.Vector3( 0, -.5, 0) );
	var lineTestGeometry3 = new THREE.Geometry();
	lineTestGeometry3.vertices.push(new THREE.Vector3( 0, 0, 2.5) );
	lineTestGeometry3.vertices.push(new THREE.Vector3( 0, 0, -2.5) );
	var testLine1 = new THREE.Line(lineTestGeometry1, lineTestMaterial);
	var testLine2 = new THREE.Line(lineTestGeometry2, lineTestMaterial);
	var testLine3 = new THREE.Line(lineTestGeometry3, lineTestMaterial);
	scene.add(testLine1);
	scene.add(testLine2);
	scene.add(testLine3);
	*/

	//draw grey squares
	var surfaceGeometry =  new THREE.PlaneGeometry(0.25, 0.25)
	var greyMaterial = new THREE.MeshBasicMaterial( {color: "grey", side: THREE.DoubleSide} );

	var b = false;
	var newSquare;
	for (var ix = -4; ix < 4; ix++) {
	 	for (var iy = -4; iy < 4; iy++) {
			if (b) {
				newSquare = new THREE.Mesh(surfaceGeometry, greyMaterial);
				scene.add(newSquare);
				newSquare.position.set((ix/4 + .125), 0.11, (iy/4 + .125));
				newSquare.rotateX(Math.PI/2);
			}
			b = !b;
		}
		b = !b;
	}

	//draw current pieces
	for (var i = 0; i < this.pieces.length; i++) {
		this.draw3DPiece(this.pieces[i], scene);
	}

	//render new drawing
	a_renderer.render(scene, camera);
}

//display victory text for after game's end
GameBoard.prototype.draw3DText = function() {
	var loader = new THREE.FontLoader();
	var textGeometry;
	loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.', function ( font ) {
		textGeometry = new THREE.TextGeometry( "victory!", { 
			font: font, 
			size: 80,
			height: 5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 10,
			bevelSize: 8,
			bevelSegments: 5
		} );
	} );
	var textMaterial = new THREE.MeshBasicMaterial( {color: "white", side: THREE.DoubleSide} );
	var textMesh = new THREE.Mesh(textGeometry, textMaterial);
	if (textMesh) {
		scene.add(textMesh);
		textMesh.position.set(2, 2, 2);
		console.log("drawing text: " + textMesh.position.y);
	}
	camera.lookAt(textMesh.position);
}

GameBoard.prototype.draw3DPiece = function(checker, scene) {
	//create frame & material; set material color based on team, turn, and selected piece
	var pieceGeometry = new THREE.CylinderGeometry(.1, .1, .03, 16);
	var pieceMaterial = new THREE.MeshBasicMaterial();
	if (checker.color == "red") {
		if (checker == this.selectedPiece) {
			pieceMaterial.color.set("purple");
		} else if (this.currentTurn == "red") {
			pieceMaterial.color.set("red");
		} else if (this.currentTurn == "black") {
			pieceMaterial.color.set("tomato");
		}
	} else if (checker.color == "black" ) {
		if (checker == this.selectedPiece) {
		 	pieceMaterial.color.set("blue");
		} else if (this.currentTurn == "black") {
			pieceMaterial.color.set("black");
		} else if (this.currentTurn == "red") {
			pieceMaterial.color.set("darkslategrey");
		}
	}
	//draw piece
	var newPiece = new THREE.Mesh(pieceGeometry, pieceMaterial);
	scene.add(newPiece);

	//draw piece outline
	var pieceEdges = new THREE.EdgesGeometry(pieceGeometry);
	var pieceLines = new THREE.LineSegments(pieceEdges, new THREE.LineBasicMaterial( {color: "black"}));
	scene.add(pieceLines);

	//move piece & outline to its place on the board
	newPiece.position.set((checker.column-4)/4 +.125, 0.12, (checker.row-4)/4 + .125);
	pieceLines.position.set((checker.column-4)/4 +.125, 0.12, (checker.row-4)/4 + .125);
}

//------------------------------------------
// Set up!
var a_canvas = document.getElementById("a");
var a_renderer = new THREE.WebGLRenderer();
a_renderer.setSize(window.innerWidth - 40 , window.innerHeight -40);
document.body.appendChild(a_renderer.domElement );
var checkBoard = new GameBoard(a_renderer);

var is3D = true;
if (is3D == true) {
	//console.log("setting up 3D board")
	checkBoard.initializePieces();
	checkBoard.draw3D();
} else {	
	//console.log("setting up 2D board")
	checkBoard.initializePieces();
	checkBoard.draw2D();
}



/*
Rules: 	-pieces move to the spaces diagonally in front of them
	-if a piece can jump over an opposing piece (in one of the spaces diagonally in front of it) it MUST take the jump
	-if >1 jump is available, player can choose which one to take
*/





