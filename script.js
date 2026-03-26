

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = []

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const chooseCell = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        return boardWithCellValues;
    }
    return {getBoard, chooseCell, printBoard};
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;
    
    return {addToken, getValue}
}

function DisplayController(playerOneName = "Player One", playerTwoName = "Player two") {
    const board = Gameboard();

    const players = [
        {
            name : playerOneName,
            token : 1
        },
        {
            name : playerTwoName,
            token : 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    let finishGame;

    const playRound = (row, column) => {
        board.chooseCell(row, column, getActivePlayer().token);

        finishGame = checkWin(row,column);
        if (finishGame === true) {
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    const checkWin = (row,column) => {
            const theToken = getActivePlayer().token;
            const boardWithCellValues = board.printBoard();
            if (boardWithCellValues[row][0] === theToken && boardWithCellValues[row][1] === theToken && boardWithCellValues[row][2] === theToken
                || boardWithCellValues[0][column] === theToken && boardWithCellValues[1][column] === theToken && boardWithCellValues[2][column] === theToken
                || boardWithCellValues[0][0] === theToken && boardWithCellValues[1][1] === theToken && boardWithCellValues[2][2] === theToken
                || boardWithCellValues[0][2] === theToken && boardWithCellValues[1][1] === theToken && boardWithCellValues[2][0] === theToken) {
                    return true;
                }
            let sum = 0;
            for (i=0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                    sum += boardWithCellValues[i][j];
                    if (sum >= 13) {
                        return "tie";
                    }
                }
            }
        }

    if (finishGame === true) {
        console.log("The game has finished.")
        return;
    }

    printNewRound();

    return {playRound, getActivePlayer, checkWin};
}

function ScreenControler() {
    const cells = document.querySelectorAll(".cell");
    const choice = document.querySelector(".choices");
    const turn = document.querySelector(".turns");
    const printTurn = document.createElement("p");
    turn.appendChild(printTurn);
    const printChoice = document.createElement("p");
    choice.appendChild(printChoice);
    const newGameButton = document.querySelector(".newGame");
    const dialog = document.querySelector("dialog");
    const submit = document.querySelector(".submit");
    const playerOne = document.querySelector("#player_one");
    const playerTwo = document.querySelector("#player_two");
    let endGame;

    let cross;
    let circle;
    const crosses = [];
    const circles = [];

    cells.forEach((cell) => {
        const cellChoice = document.createElement("p");
        cellChoice.classList = "cellChoice";
        cellChoice.dataset.id = cell.id;
        cell.appendChild(cellChoice);
    })

    newGameButton.addEventListener("click", () => newGame());
    
    let game;
    let isPressed = false;
    const newGame = () => {
        dialog.showModal();
        if (!isPressed){
            makeItWork();
            isPressed = true;
        }
    }

    submit.addEventListener("click", (event) => {
        event.preventDefault();
        const cellChoice = document.querySelectorAll(".cellChoice")
        cellChoice.forEach((one) => {
        one.textContent = "";
        })

        cells.forEach((cell) => {
            crosses.forEach((cross) => {
                if (cell.contains(cross) && cross.dataset.id === cell.id) {
                    cell.removeChild(cross);
                }
            })
            circles.forEach((circle) => {
                if (cell.contains(circle) && circle.dataset.id === cell.id) {
                    cell.removeChild(circle);
                }
            })
        })

        printChoice.textContent = "";
        printTurn.textContent = "";

        dialog.close();
        game = DisplayController(playerOne.value, playerTwo.value);
        printTurn.textContent = `${game.getActivePlayer().name}'s turn.`;
        endGame = false;
    })

    const makeItWork = () => {
        cells.forEach((cell) => {
            const cellChoice = document.querySelectorAll(".cellChoice");

            cell.addEventListener("click", () => {
                cross = document.createElement("img");
                cross.src = "./images/cross.png";
                cross.dataset.id = cell.id;
                crosses.push(cross);
                circle = document.createElement("img");
                circle.src = "./images/circle.png";
                circle.dataset.id = cell.id;
                circles.push(circle);
                const cellArray = cell.id.split(",");
                const cellRow = cellArray[0];
                const cellColumn = cellArray[1];
                let chosenCell;
                cellChoice.forEach((one) => {
                    if (one.dataset.id === cell.id) {
                        chosenCell = one;
                    }
                })

                if (game.checkWin(cellRow,cellColumn) === true || game.checkWin(cellRow,cellColumn) === "tie" || endGame === true){
                    return;
                } else if (chosenCell.textContent === "") {
                    printChoice.textContent = "";
                    chosenCell.textContent = game.getActivePlayer().token;
                    if (chosenCell.textContent === "1") {
                        cell.appendChild(cross);
                    } else if (chosenCell.textContent === "2") {
                        cell.appendChild(circle);
                    }
                    game.playRound(cellRow,cellColumn);
                    if (game.checkWin(cellRow,cellColumn) === true) {
                        printChoice.textContent = `${game.getActivePlayer().name} has won the game.`;
                        endGame = true;
                        return;
                    } else if (game.checkWin(cellRow,cellColumn) === "tie"){
                        printChoice.textContent = "It´s a tie.";
                        endGame = true;
                        return;
                    } 
                } else {
                    printChoice.textContent = "This cell is not available."
                }
                printTurn.textContent = `${game.getActivePlayer().name}'s turn.`;
            })
        })
    }
}

ScreenControler();


