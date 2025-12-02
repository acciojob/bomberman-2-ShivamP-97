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

        for (let i = 0; i < squares.length; i++) {

            if (squares[i].classList.contains("valid")) {
                let total = 0;

                const isLeft = (i % width === 0);
                const isRight = (i % width === width - 1);

                
                if (!isLeft && squares[i - 1]?.classList.contains("bomb")) total++;
                
                if (!isRight && squares[i + 1]?.classList.contains("bomb")) total++;
                
                if (squares[i - width]?.classList.contains("bomb")) total++;
                
                if (squares[i + width]?.classList.contains("bomb")) total++;
                
                if (!isLeft && squares[i - width - 1]?.classList.contains("bomb")) total++;
                
                if (!isRight && squares[i - width + 1]?.classList.contains("bomb")) total++;
                
                if (!isLeft && squares[i + width - 1]?.classList.contains("bomb")) total++;
                
                if (!isRight && squares[i + width + 1]?.classList.contains("bomb")) total++;

                squares[i].setAttribute("data", total);
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
        const isLeft = (i % width === 0);
        const isRight = (i % width === width - 1);

        setTimeout(() => {
            if (!isLeft) click(squares[i - 1]);
            if (!isRight) click(squares[i + 1]);
            click(squares[i - width]);
            click(squares[i + width]);
            if (!isLeft) click(squares[i + width - 1]);
            if (!isRight) click(squares[i + width + 1]);
            if (!isLeft) click(squares[i - width - 1]);
            if (!isRight) click(squares[i - width + 1]);
        }, 10);
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
