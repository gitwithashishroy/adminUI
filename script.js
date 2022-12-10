
// Select the table (well, tbody)
let table = document.querySelector("#adminTable tbody");
const ul = document.querySelector('ul') ; 
let allData = [] ; 
let searchData = [] ; 
let tableData = [] ; 
const pageSize = 10;
const paginationData = {
  curPage : 1 , 
  currentPageData :  tableData.filter((row,index) => {
    let start = (currPage-1)*pageSize;
    let end = currPage*pageSize;
    if(index >= start && index < end) return true;
  }) 
}

document.addEventListener("DOMContentLoaded", init, false);

async function init() { 
  // get the admin data
  fetch(
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
  )
    .then((resp) => resp.json())
    .then(function (data) {
      allData = [...data] ; 
      tableData = [...data] ; 
      renderTable() ; 
      // console.log("allData" , allData) ; 
    });

    // console.log("renderTable called initially") ;
 
}

// rendering table at dom load or on search or any page click
function renderTable() {
  let currPage = paginationData.curPage ; 
 let result = '';
 const currentPageData =  tableData.filter((row,index) => {
        let start = (currPage-1)*pageSize;
        let end = currPage*pageSize;
        if(index >= start && index < end) return true;
  }) ; 
  
   for (i = 0; i < currentPageData.length; i++) {
        result += `<tr>
        <td> <input type="checkbox" id="${currentPageData[i].id}"> </td>
        <td>${currentPageData[i].name}</td>
        <td>${currentPageData[i].email}</td>
        <td>${currentPageData[i].role}</td>
        <td>
           <span id="editicon" onclick="editRow(this)"> <i class="fa-solid fa-pen-to-square"></i> </span> <span id="deleteicon" onclick="deleteRow(this)"> <i class="fa-solid fa-trash"></i> </span>
  
        </td>
        </tr>`;
        table.innerHTML = result;
    }  
   
    totalPage = tableData.length/10 + 1  ; 
    showPagination( totalPage , paginationData.curPage) ; 
}


function searchInput(){ 
  paginationData.curPage = 1 ; 
  searchData = [] ; 
  let inputData = document.getElementById('myInput').value.toUpperCase() ; 
  for (i = 0; i < allData.length; i++) {
    if(allData[i].name.toUpperCase().indexOf(inputData) > -1 || allData[i].email.toUpperCase().indexOf(inputData) > -1 || allData[i].role.toUpperCase().indexOf(inputData) > -1){
      searchData.push(allData[i]) ; 
    }
  }
  tableData = [...searchData] ; 
  // console.log("searchData" , searchData) ; 
  renderTable() ; 
}


function previousPage() {
  if(paginationData.curPage > 1) paginationData.curPage--;
  renderTable();
}

function nextPage() {
  if((paginationData.curPage * pageSize) < tableData.length) paginationData.curPage++;
  renderTable();
}



// pagintation show on the bottom
function showPagination(totalPage , currentPage){
    let li = "" ; 
    let liactive ; 
 
    if(currentPage >= 1){
      li += ` <li id="prevButton" onclick="previousPage()"  > <i class="fa-solid fa-angle-left"></i> </li>`  ; 
    }
      
    for(let page = 1 ; page <= totalPage ; page++ ){
      
      if(page === currentPage){
        liactive = "active" ; 
      }else{
        liactive = "" ; 
      }

      li += `<li id="page-${page}" class="${liactive}" onclick="renderTable(${page})" > ${page}  </li>` ; 
      
    }


    if(currentPage < totalPage){
      li += `<li id="nextButton" onclick="nextPage()" > <i class="fa-solid fa-angle-right"></i> </li>` ;
    }

   ul.innerHTML = li ; 
}


// select all after checking selectAll column
function checkAll(){
  let currPage = paginationData.curPage  ; 
  let headCheckbox = document.getElementById('headcheckbox') ;
  const currentPageData =  tableData.filter((row,index) => {
    let start = (currPage-1)*pageSize;
    let end = currPage*pageSize;
    if(index >= start && index < end) return true;
  }) ; 

  if(headCheckbox.checked === true){
     for (i = 0; i < currentPageData.length; i++) {
        const checkbox = document.getElementById(`${currentPageData[i].id}`) ; 
        checkbox.checked = true ;   
       }  
  }else{
    for (i = 0; i < currentPageData.length; i++) {
        const checkbox = document.getElementById(`${currentPageData[i].id}`) ; 
        checkbox.checked = false ;   
     }  
  }
}


//deleteSelected
function deleteSelected(){
      let currPage = paginationData.curPage  ; 
      const currentPageData =  tableData.filter((row,index) => {
        let start = (currPage-1)*pageSize;
        let end = currPage*pageSize;
        if(index >= start && index < end) return true;
      }) ; 
      
     for (i = 0; i < currentPageData.length; i++) {
        const checkbox = document.getElementById(`${currentPageData[i].id}`) ; 
           if( checkbox.checked === true){
              checkbox.parentNode.parentNode.remove() ; 
              console.log(checkbox.parentNode) ; 
              console.log(checkbox.parentNode.parentNode) ; 
           }
      }  

}

// delete row after clicking delete icon 
function deleteRow(r){
  console.log(r); 
  console.log(r.parentNode) ; 
   r.parentNode.parentNode.remove() ; 
}


// edit option open once you click editicon

function editRow(thisRow){
  // console.log(thisRow) ; 
  console.log(thisRow.nextElementSibling.nextElementSibling) ; 

  // console.log(thisRow.parentNode) ; 
  thisRow.style.display = "none" ; 
  thisRow.nextElementSibling.style.display="none"; 

 let td1 = thisRow.parentNode.parentNode.cells[1] ; 
  td1.innerHTML = `<input id="name" type="text" value="${td1.innerHTML}" > ` ; 

  let td2 = thisRow.parentNode.parentNode.cells[2] ; 
  td2.innerHTML = `<input id="email" type="email" value="${td2.innerHTML}" > ` ; 

  let td3 = thisRow.parentNode.parentNode.cells[3] ; 
  td3.innerHTML = `<input id="role" type="text" value="${td3.innerHTML}" > ` ; 

  if(thisRow.nextElementSibling.nextElementSibling === null){
    thisRow.parentNode.innerHTML += `<span> <input type="submit" onclick="saveRow(this)" value="update"></span> `  ; 
  }
 
   
}



// update row after edit 

function saveRow(thisRow){
  console.log(thisRow) ; 
  console.log(thisRow.parentNode.previousElementSibling) ; 

  thisRow.parentNode.style.display = "none" ; 

  thisRow.parentNode.previousElementSibling.style.display="inline"; 
  thisRow.parentNode.previousElementSibling.previousElementSibling.style.display="inline"; 

   
  let name = document.getElementById('name').value ;  
  let td1 = thisRow.parentNode.parentNode.parentNode.cells[1] ; 
  td1.innerHTML = name ;  

  let email = document.getElementById('email').value ;  
  let td2 = thisRow.parentNode.parentNode.parentNode.cells[2] ; 
  td2.innerHTML = email ;  


  let role = document.getElementById('role').value ;  
  let td3 = thisRow.parentNode.parentNode.parentNode.cells[3] ; 
  td3.innerHTML = role ;  

}