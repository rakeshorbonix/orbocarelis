const settings = require("electron-settings");
let $ = require("jquery");
var path = require("path");
var ipcRenderer = require('electron').ipcRenderer;
var pages = [];
$(".nav-item button").each(function(i){
  pages[$(this).prop("id")] = $(this).prop("id");
});
$(document).on("click",".nav-item > .nav-button",function(e){
  if(document.getElementById("sample_loader")){
  document.getElementById("sample_loader").classList.remove("hide");
}
  var folder_name = $(this).closest(".nav-item").prop("id");
  // $(".nav-item").find("button").not().removeClass("is-selected");
  // $().addClass("is-selected");
  /*if(!settings.get("slicktoken")){
    var lab_info = settings.get("lab_info");
    var contact = {};
      contact['username'] = lab_info.email;
      contact['password'] = lab_info.slikpassword;
        var url ="https://casa.slickaccount.in/api/v1/login";
        var req =  new XMLHttpRequest();
        req.open("POST",url,true);
        req.setRequestHeader('Access-Control-Allow-Origin', '*');
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.setRequestHeader("appId", "04bo*5l1ck#");
        req.setRequestHeader("appSalt", "n1*o4bsl1@c3d4#t4");
       req.send(JSON.stringify(contact));
        var data = req.responseText;
          req.onload = function () {
          var response = JSON.parse(req.responseText);
          settings.set("slicktoken",response.token);
          settings.set("company_id",lab_info.company_id);
      }
  }*/
  var file_name = $(this).prop("id");
  var link;
  if(folder_name == 'inventory' || folder_name == 'device' ){
   link = document.querySelector('link[href="sections/'+folder_name+"/"+e.target.dataset.section+'.html"]');
  }else{
   link = document.querySelector('link[href="sections/'+e.target.dataset.section+'.html"]');
  }
  let template = link.import.querySelector('.task-template')
  let clone = document.importNode(template.content, true)
  if(!$("#"+e.target.dataset.section+"-section").length){
  document.querySelector('.content').appendChild(clone);
  $(".datepicker").mask("99-99-9999");
  $(".timepicker").mask("99:99");
  require(path.join(__dirname, '../process/'+folder_name+'/'+file_name+'.js'));

  document.getElementById(file_name).click();

}
document.getElementById("sample_loader").classList.add("hide");
})
document.onkeyup = function(e){

  var activeSectionButtonId = settings.get("activeSectionButtonId");
  if(pages[activeSectionButtonId]){
    if(e.which == 40 || e.which == 38){
    if(!$("#"+pages[activeSectionButtonId]+"-section .scroll").hasClass("hide")){
      var table_selector = $("#"+pages[activeSectionButtonId]+"-section .scroll");
        if(e.which == 40){
        table_selector.scrollTop(table_selector.scrollTop()+20);
        nextselection(table_selector);
        }
      if(e.which == 38){
        table_selector.scrollTop(table_selector.scrollTop()-20);
        prevselection(table_selector);
      }
    }
  }
  if (e.ctrlKey && e.which == 80 && activeSectionButtonId == "report")
  {
    ipcRenderer.send('commandregister','CommandOrControl+p',"print_report");
 }
 if(e.ctrlKey && e.which == 80 && activeSectionButtonId=="print_bill" ){
   //ipcRenderer.send('commandregister','CommandOrControl+p',"print_report");
 }
 if(e.ctrlKey && e.which == 84 && activeSectionButtonId=="addpatient" ){
   ipcRenderer.send('commandregister','CommandOrControl+t',"addtest");
 }
  }else{
    if(!settings.get("isLoggedIn") && (e.which == 13)){
      document.getElementById("login-button").click();
    }
  }
}
ipcRenderer.on('commandregister-reply', (event,id)=>{
  document.getElementById(id).click();
})
function nextselection(table_selector){
  if(table_selector.find("tr").length>0 && !table_selector.find("tr.selected").length){
    table_selector.find("tr").eq(2).prop("background-color","green");
    table_selector.find("tr").eq(2).addClass("selected");
  }else{
    var tr_index  = parseInt(table_selector.find("tr.selected").index())+1;
    table_selector.find("tr").removeClass("selected");
    if(tr_index >= table_selector.find("tr").length){
      table_selector.find("tr").eq(2).prop("background-color","green");
      table_selector.find("tr").eq(2).addClass("selected");
    }else{
      table_selector.find("tr").eq(tr_index).prop("background-color","green");
      table_selector.find("tr").eq(tr_index).addClass("selected");
    }
  }
  if(table_selector.prop("id")){
  table_selector.find("tr.selected").click();
}
}
function prevselection(table_selector){
  if(table_selector.find("tr").length>0 && !table_selector.find("tr.selected").length){
    table_selector.find("tr").eq(2).prop("background-color","green");
    table_selector.find("tr").eq(2).addClass("selected");
  }else{
    var tr_index  = parseInt(table_selector.find("tr.selected").index())-1;
    table_selector.find("tr").removeClass("selected");
    if(tr_index<=1){
      table_selector.find("tr").eq(2).prop("background-color","green");
      table_selector.find("tr").eq(2).addClass("selected");
    }else{
      table_selector.find("tr").eq(tr_index).prop("background-color","green");
      table_selector.find("tr").eq(tr_index).addClass("selected");
    }
  }
  if(table_selector.prop("id")){
  table_selector.find("tr.selected").click();
}
}
