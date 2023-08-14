function colorPromise(){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve();
        },1000);
    })
}
async function isCyclicTracePath(graphComponentMatrix,cycleResponse) {
    //dependency and dfs
    // console.log("Meow in isCyclicTracePath");
    let [sr,sc]=cycleResponse;
    // console.log("In isCyclicTracePath"+ sr +" "+ sc);
    let visited = []; //(2d array)
    let pathVisited = [];
  
    for (let i = 0; i < rows; i++) {
      let visitedRow = [];
      let pathVisitedRow = [];
      for (let j = 0; j < cols; j++) {
        visitedRow.push(false);
        pathVisitedRow.push(false);
      }
      visited.push(visitedRow);
      pathVisited.push(pathVisitedRow);
    }
    // console.log("Before call");
    let ans= await dfsCycleDGTracePath(graphComponentMatrix,sr,sc,visited,pathVisited);
    // console.log("after call");
     if(ans===true){
    // console.log("true");
        return Promise.resolve(true);
     }
     else {
        // console.log("false");
        return Promise.resolve(false);
     }
  }
  
 
  async function dfsCycleDGTracePath(graphComponentMatrix,sr,sc,visited,pathVisited) {
    // directed Graph
    // console.log("meow");
    visited[sr][sc]=true;
  //   console.log("meow");
    pathVisited[sr][sc]=true;
    let cell = document.querySelector(`.cell[rid="${sr}"][cid="${sc}"]`);
    cell.style.backgroundColor="#5C5CFF";
    await colorPromise();
    
    for(let children=0;children<graphComponentMatrix[sr][sc].length;children++){
      let [nrid,ncid]=graphComponentMatrix[sr][sc][children];
      if(visited[nrid][ncid]===false){
          let r=await dfsCycleDGTracePath(graphComponentMatrix,nrid,ncid,visited,pathVisited)
             if(r===true){
                cell.style.backgroundColor="transparent";
                await colorPromise();
                return Promise.resolve(true);
             }
      }else if(visited[nrid][ncid]===true && pathVisited[nrid][ncid]===true){
        let cyclicCell = document.querySelector(`.cell[rid="${nrid}"][cid="${ncid}"]`);
        cyclicCell.style.backgroundColor="lightsalmon";
        await colorPromise();
        cyclicCell.style.backgroundColor="transparent"; 
        cell.style.backgroundColor="transparent";
        await colorPromise(); 
        return Promise.resolve(true);
      }
    }
    //   ( B1 + 110 )
    // ( A1 + 10 )

    pathVisited[sr][sc]=false;
    // cyclicCell.style.backgroundColor="transparent";
    return Promise.resolve(false);
  }
   