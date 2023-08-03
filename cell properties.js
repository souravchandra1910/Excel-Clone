let sheetDb = [];

for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < cols; j++) {
    let cellProperty = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      backgroundColor: "#000000",
      value:"",
      formula:"",
      children:[],
    };
    sheetRow.push(cellProperty);
  }
  sheetDb.push(sheetRow);
}

let activeColorProperty = "#d1d8e0";
let inactiveColorProperty = "#ecf0f1";

//selectors

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-property");
let fontFamily = document.querySelector(".font-family-property");
let fontColor = document.querySelector(".font-color-property");
let backgroundColor = document.querySelector(".background-color-property");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

// let addressBar=document.querySelector('.address-bar');
//aab listener add karenge
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProperty] = getActiveCell(address);

  //modification
  cellProperty.bold = !cellProperty.bold; //data change
  cell.style.fontWeight = cellProperty.bold ? "bold" : "normal"; // change the UI
  bold.style.backgroundColor = cellProperty.bold
    ? activeColorProperty
    : inactiveColorProperty;
});
italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProperty] = getActiveCell(address);

  //modification
  cellProperty.italic = !cellProperty.italic; //data change
  cell.style.fontStyle = cellProperty.italic ? "italic" : "normal"; // change the UI
  italic.style.backgroundColor = cellProperty.italic
    ? activeColorProperty
    : inactiveColorProperty;
});
underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProperty] = getActiveCell(address);

  //modification
  cellProperty.underline = !cellProperty.underline; //data change
  cell.style.textDecoration = cellProperty.underline ? "underline" : "none"; // change the UI
  underline.style.backgroundColor = cellProperty.underline
    ? activeColorProperty
    : inactiveColorProperty;
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProperty] = getActiveCell(address);

  cellProperty.fontSize = fontSize.value;
  cell.style.fontSize = `${cellProperty.fontSize}px`;
  fontSize.value = cellProperty.fontSize;
});
fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProperty] = getActiveCell(address);

  cellProperty.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProperty.fontFamily;
  fontFamily.value = cellProperty.fontFamily;
});

fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProperty] = getActiveCell(address);

  cellProperty.fontColor = fontColor.value;
  cell.style.color = cellProperty.fontColor;
  fontColor.value = cellProperty.fontColor;
});
backgroundColor.addEventListener("change", (e) => {
  //address pata karke do
  let address = addressBar.value;
  // the address returned will be in the form of rows and cols
  let [cell, cellProperty] = getActiveCell(address);

  // cell ki property ko change karna hai
  cellProperty.backgroundColor = backgroundColor.value;
  cell.style.backgroundColor = cellProperty.backgroundColor;
  backgroundColor.value = cellProperty.backgroundColor;
});

alignment.forEach((alignElement) => {
  alignElement.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProperty] = getActiveCell(address);

    let alignValue = e.target.classList[0];
    cellProperty.alignment = alignValue; //data change
    cell.style.textAlign = cellProperty.alignment;
    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProperty;
        centerAlign.style.backgroundColor = inactiveColorProperty;
        rightAlign.style.backgroundColor = inactiveColorProperty;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProperty;
        centerAlign.style.backgroundColor = activeColorProperty;
        rightAlign.style.backgroundColor = inactiveColorProperty;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProperty;
        centerAlign.style.backgroundColor = inactiveColorProperty;
        rightAlign.style.backgroundColor = activeColorProperty;
        break;
    }
   
  });
});

let allcells = document.querySelectorAll(".cell");
for (let i = 0; i < allcells.length; i++) {
  addListenerToAttachCellProperties(allcells[i]);
}
function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decode(address);
    let cellProperty = sheetDb[rid][cid];
    //apply cell property
    cell.style.fontWeight = cellProperty.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProperty.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProperty.underline ? "underline" : "none";
    cell.style.fontSize = cellProperty.fontSize + "px";
    cell.style.fontFamily = cellProperty.fontFamily;
    cell.style.color = cellProperty.fontColor;
    cell.style.backgroundColor =
      cellProperty.backgroundColor === "#000000"
        ? "transparent"
        : cellProperty.backgroundColor;
    cell.style.textAlign = cellProperty.alignment;
    //apply
    bold.style.backgroundColor = cellProperty.bold
      ? activeColorProperty
      : inactiveColorProperty;
    italic.style.backgroundColor = cellProperty.italic
      ? activeColorProperty
      : inactiveColorProperty;
    underline.style.backgroundColor = cellProperty.underline
      ? activeColorProperty
      : inactiveColorProperty;
    fontSize.value = cellProperty.fontSize;
    fontFamily.value = cellProperty.fontFamily;
    fontColor.value = cellProperty.fontColor;
    backgroundColor.value = cellProperty.backgroundColor;

    switch (cellProperty.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProperty;
        centerAlign.style.backgroundColor = inactiveColorProperty;
        rightAlign.style.backgroundColor = inactiveColorProperty;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProperty;
        centerAlign.style.backgroundColor = activeColorProperty;
        rightAlign.style.backgroundColor = inactiveColorProperty;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProperty;
        centerAlign.style.backgroundColor = inactiveColorProperty;
        rightAlign.style.backgroundColor = activeColorProperty;
        break;
    }
    let formulaBar=document.querySelector(".formula-bar");
    formulaBar.value=cellProperty.formula;
    cell.value=cellProperty.value;
  });
}

function getActiveCell(address) {
  let [rid, cid] = decode(address);
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProperty = sheetDb[rid][cid];
  return [cell, cellProperty];
}
function decode(address) {
  let rid = Number(address.slice(1) - 1);
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}

