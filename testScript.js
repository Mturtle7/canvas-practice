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
	// Set up!
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);
	var actual;
	checkBoard.pieces.push(new Checker(2, 1, "red", 1));
	checkBoard.selectedPiece = checkBoard.getPiece(2, 1);
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 4, 3);
	test(false, actual);
	checkBoard.pieces.push(new Checker(3, 2, "black", -1));
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 4, 3);
	test(true, actual);
	checkBoard.pieces.push(new Checker(4, 3, "black", -1));
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 4, 3);
	test(false, actual);
	actual = checkBoard.canJumpTo(checkBoard.selectedPiece, 2, 3);
	test(false, actual);


}
testCanJumpTo();

function testMoveTo() {}

function testDraw() {}

function testChecker() {}

function testDrawPiece() {}
