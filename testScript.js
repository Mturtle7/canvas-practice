//Checkers unit test
function test(expected, actual) {
	if (expected !== actual) {
		console.trace();
		throw "*sad trombone* " + "expected value = " + expected + " actual value = " + actual;
	} else {
		//console.log("test successful");
	}
}

function testGameBoard() {
	// Set up!
	var actual;
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);
	if (checkBoard && (checkBoard.size == 8) && (checkBoard.currentTurn == "red")) {
		actual = true;
	} else {
		actual = false;
	}
	test(true, actual);
}
testGameBoard();

function testGetPiece() {}

function testDeselect() {}

function testCanStepTo() {
	// Set up!
	var actual;
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);
	checkBoard.pieces.push(new Checker(2, 1, "red", 1, false));
	checkBoard.selectedPiece = checkBoard.getPiece(2, 1);

	//step directly in front
	actual = checkBoard.canStepTo(checkBoard.selectedPiece, 2, 2);
	test(false, actual);

	//step directly to the side
	actual = checkBoard.canStepTo(checkBoard.selectedPiece, 3, 1);
	test(false, actual);

	//step forward multiple spaces and one to the side
	actual = checkBoard.canStepTo(checkBoard.selectedPiece, 5, 2);
	test(false, actual);

	//step backwards multiple spaces and to the side
	actual = checkBoard.canStepTo(checkBoard.selectedPiece, 0, 0);
	test(false, actual);

	//actual step: diagonally forward one space
	actual = checkBoard.canStepTo(checkBoard.selectedPiece, 3, 2);
	test(true, actual);
}
testCanStepTo();

function testCanJumpTo() {
	
	// Set up!
	var actual;
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);

	//jump w/ only one piece on board
	checkBoard.pieces.push(new Checker(2, 1, "red", 1, false));
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
	
}
testCanJumpTo();

function testMovePiece() {
	//set up
	var actual;
	var test_canvas = {width: 8, height: 8, getContext: function () {}, addEventListener: function () {}};
	var checkBoard = new GameBoard(test_canvas);
	checkBoard.pieces.push(new Checker(2, 1, "red", 1, false));
	checkBoard.pieces.push(new Checker(3, 2, "black", -1, false));
	
	//test select enforcer
	checkBoard.movePiece(4, 3);
	if (checkBoard.getPiece(4, 3)) {
		actual = true;
	} else {
		actual = false;
	}
	test(false, actual);

	//test turn enforcer
	checkBoard.selectedPiece = checkBoard.getPiece(3, 2);
	checkBoard.movePiece(1, 0);
	if (checkBoard.getPiece(1, 0)) {
		actual = true;
	} else {
		actual = false;
	}
	test(false, actual);

	//test jump
	checkBoard.currentTurn = "black";
	checkBoard.movePiece(1, 0);
	if (checkBoard.getPiece(1, 0) && !checkBoard.getPiece(2, 1)) {
		actual = true;
	} else {
		actual = false;
	}
	test(true, actual);

	//test step
	checkBoard.moveType = null;
	checkBoard.movePiece(0, 1);
	if (checkBoard.getPiece(0, 1)) {
		actual = true;
	} else {
		actual = false;
	}
	test(true, actual);
}
testMovePiece();

function testDraw() {}

function testChecker() {}

function testDrawPiece() {}
