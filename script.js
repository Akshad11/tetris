

//console.log('Hello from scipt.js');
document.addEventListener('DOMContentLoaded', () => {
	const width = 10;
	const grid = document.querySelector('.grid');
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startBtn = document.querySelector('#start-pause');
	let timerId;
	let score = 0;

	//The tetroninoes
	const lTetronino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2]
	]

	const ZTetronino = [
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1]
	]

	const tTetronino = [
		[1, width, width + 1, width + 2],
		[1, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width + 2, width * 2 + 1],
		[1, width, width + 1, width * 2 + 1]
	]
	const oTetronino = [
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1]
	]
	const iTetronino = [
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3]
	]

	const theTetrominoes = [lTetronino, ZTetronino, tTetronino, oTetronino, iTetronino]

	let currentPosition = 4;
	let currentRotation = 0;
	let nextRandom = 0;

	//ramdomly select a tetromino and its first rotation
	let random = Math.floor(Math.random() * theTetrominoes.length)
	//console.log(random, nextRandom)
	let current = theTetrominoes[random][currentRotation];
	//draw the first rotation i the first tetramino;
	function draw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.add('tetramino')
		})
	}

	//undraw the tetromino
	function undraw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.remove('tetramino')
		})
	}

	//make the tetramino move down every second
	//timerId = setInterval(moveDown, 250);


	//assign function to keyCodes
	function control(e) {
		if (e.key === 'ArrowLeft') {
			moveLeft()
		} else if (e.key === 'ArrowRight') {
			moveRight()
		} else if (e.key === 'ArrowUp') {
			rotate()
		} else if (e.key === 'ArrowDown') {
			moveDown()
		}
	}

	//event Listener
	document.addEventListener('keyup', control);

	//move down function
	function moveDown() {
		undraw();
		currentPosition += width;
		displayShape()
		draw();
		//console.log(random,nextRandom)
		freeze();
		addScore();
		gameOver();
	}

	//freeze function

	function freeze() {
		if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
			current.forEach(index => squares[currentPosition + index].classList.add('taken'))
			random = nextRandom;
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			current = theTetrominoes[random][currentRotation];
			currentPosition = 4;
			draw();
		}
	}

	//move the tetramino left, unless is at the edge or there is a blockage
	function moveLeft() {
		undraw();
		const isAtleftEdge = current.some(index => (currentPosition + index) % width === 0);

		if (!isAtleftEdge) currentPosition -= 1;

		if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition += 1;
		}
		draw();
	}




	//move the tetramino left, unless is at the edge or there is a blockage
	function moveRight() {
		undraw();
		const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

		if (!isAtRightEdge) currentPosition += 1;

		if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition -= 1;
		}
		draw();
	}

	//rotate the tetramino
	function rotate() {
		undraw();
		currentRotation++;
		if (currentRotation === current.length) {//if the current rotation get to 4 make it go back to 0
			currentRotation = 0;
		}
		current = theTetrominoes[random][currentRotation];
		draw();

	}

	//show up-next tetramino in mini-grid display.
	const displaySquares = document.querySelectorAll('.min-grid div')
	const displayWidth = 4;
	let displayIndex = 0;


	//the tetrominos without rotations
	const upNextTetrominoes = [
		[1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetronino
		[0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],//ZTetronino
		[1, displayWidth, displayWidth + 1, displayWidth + 2],//tTetronino
		[0, 1, displayWidth, displayWidth + 1],
		[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
	]

	//display the shapes in the mini-grid  display
	function displayShape() {
		displaySquares.forEach(square => {
			square.classList.remove('tetramino')
		})
		upNextTetrominoes[nextRandom].forEach(index => {
			displaySquares[displayIndex + index].classList.add('tetramino');
		});
	}

	//add function to the button 
	startBtn.addEventListener('click', () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
		} else {
			draw()
			timerId = setInterval(moveDown, 250);
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			displayShape()
		}
	})

	//add score
	function addScore() {
		for (let i = 0; i < 199; i += width) {
			const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

			if (row.every(index => squares[index].classList.contains('taken'))) {
				score += 10;
				scoreDisplay.innerHTML = score;
				row.forEach(index =>{
						squares[index].classList.remove('taken');
						squares[index].classList.remove('tetramino')
				})
				const squareRemoved = squares.splice(i, width)
			    //console.log(squareRemoved);
				squares = squareRemoved.concat(squares);
				squares.forEach(cell => grid.appendChild(cell))
			}
		}
	}
	
	
	
	//Game over
		function gameOver(){
				if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
					scoreDisplay.innerHTML = 'end';
					clearInterval(timerId);
				}
			}














})