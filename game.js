const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = Array(9).fill(null);
const scores = { X: 0, O: 0, draws: 0 };
const cellButtons = [...document.querySelectorAll("[data-cell]")];
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const status = document.querySelector("#turn-status");
const statusCopy = document.querySelector("#status-copy");
const roundNumber = document.querySelector("#round-number");
const scoreX = document.querySelector("#value-x");
const scoreO = document.querySelector("#value-o");
const scoreDraws = document.querySelector("#value-draws");
const scorePanelX = document.querySelector("#score-x");
const scorePanelO = document.querySelector("#score-o");
const playerNameO = document.querySelector("#name-o");

let mode = "computer";
let currentPlayer = "X";
let round = 1;
let gameOver = false;
let isThinking = false;
let aiTimer;

function findWinningLine(board) {
  return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function setStatus(message, state = "") {
  statusCopy.textContent = message;
  status.classList.toggle("is-win", state === "win");
  status.classList.toggle("is-draw", state === "draw");
}

function updateTurnIndicator() {
  scorePanelX.classList.toggle("is-active", !gameOver && currentPlayer === "X");
  scorePanelO.classList.toggle("is-active", !gameOver && currentPlayer === "O");
}

function updateBoard() {
  cellButtons.forEach((button, index) => {
    const mark = cells[index];
    button.textContent = mark === "X" ? "×" : mark === "O" ? "○" : "";
    button.setAttribute("aria-label", `Cell ${index + 1}, ${mark ?? "empty"}`);
    button.classList.toggle("mark-x", mark === "X");
    button.classList.toggle("mark-o", mark === "O");
    button.classList.toggle("pop-in", Boolean(mark));
    button.disabled = Boolean(mark) || gameOver || isThinking;
  });
  updateTurnIndicator();
}

function updateScore() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraws.textContent = scores.draws;
}

function finishRound(line) {
  gameOver = true;
  if (line) {
    scores[currentPlayer] += 1;
    line.forEach((index) => cellButtons[index].classList.add("is-winner"));
    setStatus(
      mode === "computer" && currentPlayer === "O" ? "The computer got this one." : `${currentPlayer} takes the round!`,
      "win",
    );
  } else {
    scores.draws += 1;
    setStatus("A draw. Nicely matched.", "draw");
  }
  updateScore();
  updateBoard();
}

function placeMark(index) {
  if (gameOver || isThinking || cells[index]) return;

  cells[index] = currentPlayer;
  const line = findWinningLine(cells);

  if (line || cells.every(Boolean)) {
    finishRound(line);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateBoard();

  if (mode === "computer" && currentPlayer === "O") {
    isThinking = true;
    setStatus("The computer is thinking...");
    updateBoard();
    aiTimer = window.setTimeout(makeComputerMove, 360);
  } else {
    setStatus(mode === "computer" ? "Your turn — make it count." : `${currentPlayer}'s turn — make it count.`);
  }
}

function minimax(board, player, depth) {
  const line = findWinningLine(board);
  if (line) return { score: player === "O" ? depth - 10 : 10 - depth, index: -1 };
  if (board.every(Boolean)) return { score: 0, index: -1 };

  const moves = [];
  board.forEach((mark, index) => {
    if (mark) return;
    board[index] = player;
    const result = minimax(board, player === "O" ? "X" : "O", depth + 1);
    moves.push({ index, score: result.score });
    board[index] = null;
  });

  return moves.reduce((best, move) => {
    if (!best) return move;
    return player === "O"
      ? move.score > best.score ? move : best
      : move.score < best.score ? move : best;
  }, null);
}

function makeComputerMove() {
  if (gameOver || mode !== "computer") return;
  const move = minimax(cells, "O", 0);
  isThinking = false;
  if (move.index >= 0) placeMark(move.index);
}

function startRound() {
  window.clearTimeout(aiTimer);
  cells.fill(null);
  cellButtons.forEach((button) => button.classList.remove("is-winner"));
  currentPlayer = "X";
  gameOver = false;
  isThinking = false;
  roundNumber.textContent = String(round).padStart(2, "0");
  setStatus(mode === "computer" ? "Your turn — make it count." : "X starts — make it count.");
  updateBoard();
}

function resetRound() {
  round += 1;
  startRound();
}

function newMatch() {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  round = 1;
  updateScore();
  startRound();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (mode === button.dataset.mode) return;
    mode = button.dataset.mode;
    modeButtons.forEach((option) => {
      option.setAttribute("aria-pressed", String(option === button));
    });
    playerNameO.textContent = mode === "computer" ? "CPU" : "PLAYER 2";
    newMatch();
  });
});

cellButtons.forEach((button, index) => {
  button.addEventListener("click", () => placeMark(index));
});

document.querySelector("#reset-round").addEventListener("click", resetRound);
document.querySelector("#new-match").addEventListener("click", newMatch);

startRound();
