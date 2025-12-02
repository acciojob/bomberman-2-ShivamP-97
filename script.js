document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("grid");
    const result = document.getElementById("result");
    const flagsLeft = document.getElementById("flagsLeft");

    const width = 10;
    const bombCount = 10;
    let flags = 0;
    let isGameOver = false;

    let squares = [];
	
    function createBoard() {

        const bombs = Array(bombCount).fill("bomb");
        const valids = Array(100 - bombCount).fill("valid");
        const gameArray = [...bombs, ...valids].sort(() => Math.random() - 0.5);

        for (let i = 0; i < 100; i++) {
            const square = document.createElement("div");
            square.id = i;
            square.classList.add(gameArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener("click", () => click(square));

            square.oncontextmenu = (e) => {
                e.preventDefault();
                toggleFlag(square);
            };
        }
		for (let i = 0; i < 100; i++) {

    if (squares[i].classList.contains("valid")) {

        const isLeft = i % width === 0;
        const isRight = i % width === width - 1;
        const isTop = i < width;
        const isBottom = i >= 100 - width;

        const neighbors = [];

        if (!isRight) neighbors.push(i + 1); 
        if (!isLeft) neighbors.push(i - 1); 
        if (!isTop) neighbors.push(i - width); 
        if (!isBottom) neighbors.push(i + width); 
        if (!isTop && !isLeft) neighbors.push(i - 1 - width);
        if (!isTop && !isRight) neighbors.push(i + 1 - width);
        if (!isBottom && !isLeft) neighbors.push(i - 1 + width);
        if (!isBottom && !isRight) neighbors.push(i + 1 + width);

        let count = neighbors.filter(idx => squares[idx]?.classList.contains("bomb")).length;

        squares[i].setAttribute("data", count);
	}
		}

	}

    createBoard();

    function toggleFlag(square) {
        if (isGameOver) return;
        if (square.classList.contains("checked")) return;

        if (!square.classList.contains("flag") && flags < bombCount) {
            square.classList.add("flag");
            square.textContent = "🚩";
            flags++;
        } else if (square.classList.contains("flag")) {
            square.classList.remove("flag");
            square.textContent = "";
            flags--;
        }

        flagsLeft.textContent = bombCount - flags;
        checkWin();
    }

    function click(square) {
        if (isGameOver) return;

        if (square.classList.contains("checked")) return;

        square.classList.remove("flag");
        square.textContent = "";

        if (square.classList.contains("bomb")) {
            square.classList.add("checked");
            square.textContent = "💣";
            gameOver();
            return;
        }

        let total = square.getAttribute("data");
        square.classList.add("checked");

        if (total != "0") {
            square.textContent = total;
            return;
        }

        revealZeros(square);
    }

	function revealZeros(square) {
    const i = Number(square.id);

    const isLeft = i % width === 0;
    const isRight = i % width === width - 1;
    const isTop = i < width;
    const isBottom = i >= 100 - width;

    const neighbors = [];

    if (!isRight) neighbors.push(i + 1); 
    if (!isLeft) neighbors.push(i - 1); 
    if (!isTop) neighbors.push(i - width); 
    if (!isBottom) neighbors.push(i + width); 
    if (!isTop && !isLeft) neighbors.push(i - 1 - width);
    if (!isTop && !isRight) neighbors.push(i + 1 - width);
    if (!isBottom && !isLeft) neighbors.push(i - 1 + width);
    if (!isBottom && !isRight) neighbors.push(i + 1 + width);

    neighbors.forEach(idx => {
        if (idx >= 0 && idx < 100) {
            click(squares[idx]);
        }
    });
}


    function gameOver() {
        isGameOver = true;
        result.textContent = "YOU LOSE!";

        squares.forEach(sq => {
            if (sq.classList.contains("bomb")) {
                sq.textContent = "💣";
                sq.classList.add("checked");
            }
        });
    }

    function checkWin() {
        let matches = 0;

        squares.forEach(sq => {
            if (sq.classList.contains("flag") && sq.classList.contains("bomb")) {
                matches++;
            }
        });

        if (matches === bombCount) {
            isGameOver = true;
            result.textContent = "YOU WIN!";
        }
    }

});
