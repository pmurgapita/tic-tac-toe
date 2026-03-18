

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
        console.log(boardWithCellValues);
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

    const turn = document.querySelector(".turns");
    const choices = document.querySelector(".choices");
    const printTurn = document.createElement("p");
    const printChoice = document.createElement("p");
    turn.appendChild(printTurn);
    choices.appendChild(printChoice);

    const printNewRound = () => {
        board.printBoard();
        printTurn.textContent = `${getActivePlayer().name}'s turn.`;
    }

    const playRound = (row, column) => {

        printChoice.textContent = `Placing ${getActivePlayer().name}'s token on row ${row} and column ${column}.`;
        board.chooseCell(row, column, getActivePlayer().token);

        const finishGame = checkWin(row,column);
        if (finishGame === true) {
            console.log("The game has finished.")
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
                    printChoice.textContent = `${getActivePlayer().name} has won the game.`;
                    return true;
                }
            let sum = 0;
            for (i=0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                    sum += boardWithCellValues[i][j];
                    if (sum >= 13) {
                        printChoice.textContent = "It´s a tie";
                        return true;
                    }
                }
            }
        }

    printNewRound();

    return {playRound, getActivePlayer, checkWin};
}

function ScreenControler() {
    const cells = document.querySelectorAll(".cell");
    const choice = document.querySelector(".choices")
    const turn = document.querySelector(".turns")
    const printChoice = document.createElement("p")
    choice.appendChild(printChoice);
    const game = DisplayController("One", "Two");

    cells.forEach((cell) => {
        const cellChoice = document.createElement("p");
        cell.appendChild(cellChoice);
        cell.addEventListener("click", function choose() {
            const cellArray = cell.id.split(",");
            const cellRow = cellArray[0];
            const cellColumn = cellArray[1]
            if (game.checkWin(cellRow,cellColumn)){
                const newGameButton = document.createElement("button");
                turn.appendChild(newGameButton);
            } else if (cellChoice.textContent === "") {
                cellChoice.textContent = game.getActivePlayer().token
                game.playRound(cellRow,cellColumn)
                
            } else {
                printChoice.textContent = "This cell is not available."
            }
        })
    })
}




