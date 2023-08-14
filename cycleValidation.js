let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < cols; j++) {
    // more than one child
    row.push([]);
  }
  graphComponentMatrix.push(row);
}

function isCyclic(graphComponentMatrix) {
  //dependency and dfs
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

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] === false) {
       let ans= dfsCycleDG(graphComponentMatrix,i,j,visited,pathVisited);
       if(ans===true){
        console.log("there is cycle");
        return [i,j];
       }
      }
    }
  } 
  return null;
}

function dfsCycleDG(graphComponentMatrix,sr,sc,visited,pathVisited) {
  // directed Graph
  visited[sr][sc]=true;
//   console.log("meow");
  pathVisited[sr][sc]=true;
  for(let children=0;children<graphComponentMatrix[sr][sc].length;children++){
    let [nrid,ncid]=graphComponentMatrix[sr][sc][children];
    if(visited[nrid][ncid]===false){
        let r=dfsCycleDG(graphComponentMatrix,nrid,ncid,visited,pathVisited)
           if(r===true)return true;
        
    }else if(visited[nrid][ncid]===true && pathVisited[nrid][ncid]===true){
        return true;
    }
  }
  pathVisited[sr][sc]=false;
  return false;
}
 