document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("grid");
    const result = document.getElementById("result");
    const flagsLeft = document.getElementById("flagsLeft");

    const width = 10;
    const bombCount = 10;
    let isGameOver = false;
    let flags = 0;

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

        assignNumbers();
    }

    createBoard();

    function assignNumbers() {

        for (let i = 0; i < 100; i++) {

            const square = squares[i];
            if (!square.classList.contains("valid")) continue;

            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            const isTopEdge = (i < width);
            const isBottomEdge = (i >= 100 - width);

            const a = squares[i + 1];             
            const b = squares[i - 1];             
            const c = squares[i - width];         
            const d = squares[i + width];         
            const e = squares[i - 1 - width];     
            const f = squares[i + 1 - width];     
            const g = squares[i - 1 + width];     
            const h = squares[i + 1 + width];    

            let total = 0;

            if (!isRightEdge && a?.classList.contains("bomb")) total++;
            if (!isLeftEdge  && b?.classList.contains("bomb")) total++;
            if (!isTopEdge   && c?.classList.contains("bomb")) total++;
            if (!isBottomEdge&& d?.classList.contains("bomb")) total++;
            if (!isLeftEdge && !isTopEdge      && e?.classList.contains("bomb")) total++;
            if (!isRightEdge && !isTopEdge     && f?.classList.contains("bomb")) total++;
            if (!isLeftEdge && !isBottomEdge   && g?.classList.contains("bomb")) total++;
            if (!isRightEdge && !isBottomEdge  && h?.classList.contains("bomb")) total++;

            square.setAttribute("data", total);
        }
    }

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

        flagsLeft.textContent = (bombCount - flags);
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

        const total = square.getAttribute("data");
        square.classList.add("checked");

        if (total !== "0") {
            square.textContent = total;
            return;
        }

        revealZeros(square);
    }

    function revealZeros(square) {

        const i = Number(square.id);

        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);
        const isTopEdge = (i < width);
        const isBottomEdge = (i >= 100 - width);

        const neighbors = [];

        if (!isRightEdge) neighbors.push(i + 1);
        if (!isLeftEdge) neighbors.push(i - 1);
        if (!isTopEdge) neighbors.push(i - width);
        if (!isBottomEdge) neighbors.push(i + width);
        if (!isLeftEdge && !isTopEdge) neighbors.push(i - 1 - width);
        if (!isRightEdge && !isTopEdge) neighbors.push(i + 1 - width);
        if (!isLeftEdge && !isBottomEdge) neighbors.push(i - 1 + width);
        if (!isRightEdge && !isBottomEdge) neighbors.push(i + 1 + width);

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
