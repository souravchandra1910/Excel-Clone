let rows = 100;
let cols = 26;

let address_col_container = document.querySelector(".address-column-container");
let address_row_container = document.querySelector(".address-row-container");
let cellsContainer=document.querySelector('.cells-container');
let addressBar=document.querySelector('.address-bar');
for (let i = 0; i < rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-column");
  addressCol.innerText = i + 1;
  address_col_container.appendChild(addressCol);
}

for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
   addressRow.setAttribute("class", "address-row");
   addressRow.innerText = String.fromCharCode(65+i);
   address_row_container.appendChild(addressRow);
}

for(let i=0;i<rows;i++){
  let rowContainer=document.createElement('div');
  rowContainer.setAttribute('class','rowContainer');
  for(let j=0;j<cols;j++){
    let cell=document.createElement('div');
    cell.setAttribute('class','cell');
    cell.setAttribute('contenteditable','true');
    cell.setAttribute('spellcheck',false);
    //attributes to identify cells
    cell.setAttribute('rid',i);
    cell.setAttribute('cid',j);
    rowContainer.appendChild(cell);
    addListenerForAddressBarDisplay(cell,i,j);
  }
  cellsContainer.appendChild(rowContainer);
}
function  addListenerForAddressBarDisplay(cell,i,j){
  cell.addEventListener("click",(e)=>{
     let rowId=i+1;
     let colId=String.fromCharCode(65+j);
     addressBar.value=`${colId}${rowId}`;
    //  console.log(addressBar.value)
  });
} 

let firstcell=document.querySelector('.cell');

