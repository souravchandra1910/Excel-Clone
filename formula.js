// blur vs focus eventlistener
for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
           let address=addressBar.value;
           let [cell,cellProperty]= getActiveCell(address);
           let enteredData=cell.innerText;

           if(enteredData === cellProperty.value)return;

           cellProperty.value=enteredData;

           //if data modified update
           removeChildFromParent(cellProperty.formula);
           cellProperty.formula="";
        //    console.log(cellProperty.formula);
           updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {

        let address = addressBar.value;
        let [cell, cellProp] = getActiveCell(address);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);
       
        // console.log(graphComponentMatrix);
        let cycleResponse = isCyclic(graphComponentMatrix);
        if (cycleResponse) {
            console.log(cycleResponse[0]+"    "+cycleResponse[1]);
            // alert("Your formula is cyclic");
             let response=confirm("Your formula is Cyclic . Do You want to trace your path ?");
             while(response === true){
                // keep on tracking jab tak cancel na karo
                await isCyclicTracePath(graphComponentMatrix,cycleResponse);
                response=confirm("Your formula is Cyclic . Do You want to trace your path ?");
             }
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        // To update UI and cellProp in DB
        setCellUIAndProperty(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        console.log(sheetDB);
        updateChildrenCells(address);
    }
})
function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decode(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decode(encodedFormula[i]);
           graphComponentMatrix[prid][pcid].push([crid, ccid]);
           console.log(graphComponentMatrix[prid][pcid][0]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decode(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}


function evaluateFormula(formula){
 let encodedFormula=formula.split(" ");
 for(let i=0;i<encodedFormula.length;i++){
    let asciiValue=encodedFormula[i].charCodeAt(0);
    // console.log(asciiValue);
    if(asciiValue>=65 && asciiValue<=90){
      let [cell,cellProperty]=getActiveCell(encodedFormula[i]);
      encodedFormula[i]=cellProperty.value;
      console.log("val"+cellProperty.value + " for"+cellProperty.formula);
    }
 }
 let decodeFormula=encodedFormula.join(" ");
//  console.log("Meow"+decodeFormula)
 return eval(decodeFormula);
}

function setCellUIAndProperty(evaluated_value,formula,address){
    let [cell,cellProperty]=getActiveCell(address);


    //ui update
    cell.innerText=evaluated_value;
    //db update
    cellProperty.value=evaluated_value;
    cellProperty.formula=formula;
}

// data update in children (recursively)
function addChildToParent(formula){
    let childAddress=addressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentcell,parentcellProperty]=getActiveCell(encodedFormula[i]);
            parentcellProperty.children.push(childAddress);
        }
    }
}
// if the current cell is no longer depend on its children and is dependent on other cell
function removeChildFromParent(formula){
    let childAddress=addressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentcell,parentcellProperty]=getActiveCell(encodedFormula[i]);
           let idx =parentcellProperty.children.indexOf(childAddress);
           parentcellProperty.children.splice(idx,1);
        }
    }
}

function updateChildrenCells(parentAddress){
   let [parentcell,parentcellProperty]=getActiveCell(parentAddress);
   let children=parentcellProperty.children;
   
   for(let i=0;i<children.length;i++){
    let childAddress=children[i];
    let [childcell,childcellProperty]=getActiveCell(childAddress);
    let childformula=childcellProperty.formula;
    let evaluated_value=evaluateFormula(childformula);
    setCellUIAndProperty(evaluated_value,childformula,childAddress);
    updateChildrenCells(childAddress);
   }

}