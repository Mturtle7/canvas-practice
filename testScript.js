//Checkers unit test
function test(expected, actual) {
	if (expected !== actual) {
		console.trace();
		throw "*sad trombone* " + "expected value = " + expected + "actual value = " + actual;
	} else {
		console.log("test successful");
	}
}

function testGameBoard() {
}

function testGetPiece() {}

function testDeselect() {}

function testCanMoveTo() {}

function testCanJumpTo() {
	/*
	// Set up!
	var actual;
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);

	//jump w/ only one piece on board
	checkBoard.pieces.push(new Checker(2, 1, "red", 1));
	checkBoard.selectedPiece = checkBoard.getPiece(2, 1);
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 4, 3);
	test(false, actual);
	//jump over enemy piece diagonally to empty space
	checkBoard.pieces.push(new Checker(3, 2, "black", -1));
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 4, 3);
	test(true, actual);
	//jump over enemy piece diagonally to occupied space
	checkBoard.pieces.push(new Checker(4, 3, "black", -1));
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 4, 3);
	test(false, actual);
	//jump over friendly piece to empty space
	checkBoard.pieces.push(new Checker(1, 2, "red", 1));
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 0, 3);
	test(false, actual);
	//jump to diagonally adjacent occupied space
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 2, 3);
	test(false, actual);
	//jump diagonally backwards
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 0, 1);
	test(false, actual);
	//jump long directly forwards
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 2, 5);
	test(false, actual);
	*/
}
//testCanJumpTo();

function testMovePiece() {
	/*
	//set up
	var actual;
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);
	checkBoard.pieces.push(new Checker(2, 1, "red", 1));
	checkBoard.selectedPiece = checkBoard.getPiece(2, 1);
	*/
}

function testDraw() {}

function testChecker() {}

function testDrawPiece() {}
