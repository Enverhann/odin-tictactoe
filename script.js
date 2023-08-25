const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    
    function isBoardFull() {
      return board.every(cell => cell !== "");
    }
    
    return {
      board,
      isBoardFull
    };
  })();
  
  const Player = (name, marker) => {
    return { name, marker };
  };
  
  const GameController = (() => {
    let currentPlayer;
    let gameOver = false;
    
    function checkForWin() {
      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
    
      for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (Gameboard.board[a] && Gameboard.board[a] === Gameboard.board[b] && Gameboard.board[a] === Gameboard.board[c]) {
          return true;
        }
      }
    
      return false;
    }
    
    function checkForTie() {
      return Gameboard.isBoardFull() && !checkForWin();
    }
    
    function endGame(result) {
      gameOver = true;
      displayController.showResult(result);
    }
    
    function switchPlayer() {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      displayController.updateCurrentPlayer(currentPlayer);
    }
    
    function makeMove(index) {
      if (Gameboard.board[index] === "" && !gameOver) {
        Gameboard.board[index] = currentPlayer.marker;
        displayController.updateCell(index, currentPlayer.marker);
    
        if (checkForWin()) {
          endGame(`${currentPlayer.name} wins!`);
        } else if (checkForTie()) {
          endGame("It's a tie!");
        } else {
          switchPlayer();
        }
      }
    }
    
    function startGame(player1Name, player2Name) {
      player1 = Player(player1Name, "X");
      player2 = Player(player2Name, "O");
      currentPlayer = player1;
      displayController.initializeGameBoard();
      displayController.updateCurrentPlayer(currentPlayer);
    }
    
    function isGameOver(){
        return gameOver;
    }

    return {
      startGame,
      makeMove,
      restartGame() {
        Gameboard.board.fill("");
        gameOver = false;
        displayController.initializeGameBoard();
        displayController.updateCurrentPlayer(currentPlayer);
        const restartButton = document.querySelector(".restart-button");
        restartButton.style.display = "none";
    },
    isGameOver
    };
  })();
  
  const displayController = (() => {
    const gameBoardElement = document.querySelector(".game-board");
    const gameInfoElement = document.querySelector(".game-info");
    
    function initializeGameBoard() {
      gameBoardElement.innerHTML = "";
      
      Gameboard.board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () => GameController.makeMove(index));
        gameBoardElement.appendChild(cellElement);
      });
    }
    
    function updateCell(index, marker) {
      const cellElement = gameBoardElement.children[index];
      cellElement.textContent = marker;
    }
    
    function updateCurrentPlayer(player) {
      gameInfoElement.textContent = `Current Player: ${player.name} (${player.marker})`;
    }
    
    function showResult(result) {
        gameInfoElement.innerHTML = `${result}<br><button class="restart-button">Restart Game</button>`;
        const restartButton = document.querySelector(".restart-button");
        
        if (GameController.isGameOver()) {
            restartButton.style.display = "block";
        } else {
            restartButton.style.display = "none"; 
        }
    
        restartButton.addEventListener("click", GameController.restartGame);
    
    }
    
    return {
      initializeGameBoard,
      updateCell,
      updateCurrentPlayer,
      showResult
    };
  })();
  
  GameController.startGame("Player 1", "Player 2");
  