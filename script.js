class Players{
  static X = 0;
  static Y = 1;
};

const gridContainer = document.querySelector('.grid-container');
const currentStatus = document.querySelector('.current-status');

const svgX = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" aria-label="X" role="img" viewBox="0 0 128 128" width="128" height="128"><path class="hFJ9Ve" d="M16,16L112,112" stroke="#000000" fill="none" stroke-width="16px"></path><path class="hFJ9Ve" d="M112,16L16,112" stroke="#000000" fill="none" stroke-width="16px"></path></svg>`;
const svgO = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" jsname="D7yUae" aria-label="O" role="img" viewBox="0 0 128 128" width="128" height="128"><path class="hFJ9Ve" d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" stroke="#000000" fill="none" stroke-width="16px"></path></svg>`;
const X = createMarkElement(Players.X);
const O = createMarkElement(Players.Y);


var currentPlayer = 0;
var size = 3;
var remainTurn = size * size;

function createGrid(size) {
  for (let i = 0; i < size; i++) {
    const gridRow = document.createElement('tr');
    gridContainer.appendChild(gridRow);
    for (let j = 0; j < size; j++){
      const gridItem = document.createElement('td');
      gridItem.classList.add('grid-item');
      gridRow.appendChild(gridItem);
      gridItem.addEventListener('click', handleClick);  
    }
  }
}

function handleClick(event){
  const gridItem = event.currentTarget;
  let mark;
  if (currentPlayer == Players.X){
    mark = X.cloneNode(true);
  }
  else {
    mark = O.cloneNode(true);
  }
  gridItem.appendChild(mark);
  resizeMark(mark, 48);
  setCurrentStatus();
  currentPlayer = 1 - currentPlayer;
  gridItem.removeEventListener('click', handleClick);
}

function createMarkElement(player){
  if (player == undefined) player = currentPlayer;
  const mark = document.createElement('div');
  mark.innerHTML = player == Players.X ? svgX : svgO;
  return mark.firstChild;
}

function resizeMark(ele, size){
  ele.setAttribute("width", size + "px");
  ele.setAttribute("height", size + "px");
}

function setCurrentStatus(){
  let player = currentPlayer == Players.X ? X.cloneNode(true) : O.cloneNode(true);
  resizeMark(player, 16);
  currentStatus.innerHTML = player.outerHTML + " turn";
}

function restartGame(){
  gridContainer.innerHTML = '';
  createGrid(size);
  currentStatus.textContent = "Start game or select player";
}

function checkResult(){
  return false;
}

createGrid(size);