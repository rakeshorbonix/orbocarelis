const links = document.querySelectorAll('link[rel="import"]')
const settings = require('electron-settings');
let $ = require('jquery');
const glob = require('glob');
const path = require("path");

// Import and add each page to the DOM
//document.getElementById("main_loader").classList.remove("hide");
settings.watch("isLoggedIn",function(login_new){
    if (!login_new) {
      document.getElementById("main_loader").classList.remove("hide");
      const link = document.querySelector('link[href="sections/login.html"]');
      let template = link.import.querySelector('.task-template')
      let clone = document.importNode(template.content, true)
      document.querySelector('body').appendChild(clone);
      document.getElementById("login-modal").classList.add("is-shown");
      document.getElementById("main_loader").classList.add("hide");
    } else {
        $("#user").hide();
        $("#admin").show();
      const link = document.querySelector('link[href="sections/sample_list.html"]');
      let template = link.import.querySelector('.task-template')
      let clone = document.importNode(template.content, true)
      document.querySelector('.content').appendChild(clone);
    }
})
if(!settings.get("isLoggedIn")){
  const link = document.querySelector('link[href="sections/login.html"]');
  let template = link.import.querySelector('.task-template')
  let clone = document.importNode(template.content, true)
  document.querySelector('body').appendChild(clone);
  document.getElementById("login-modal").classList.add("is-shown");
}else{
  document.getElementById("main_loader").classList.remove("hide");
  const link = document.querySelector('link[href="sections/sample_list.html"]');
  let template = link.import.querySelector('.task-template')
  let clone = document.importNode(template.content, true)
  document.querySelector('.content').appendChild(clone)
  document.getElementById("main_loader").classList.add("hide");
//console.log("I WILL CHECK SESSION");
  var lab_info = settings.get("lab_info");
    $("#user").hide();
    $("#admin").show();

}
function loadDevices(){
  var files = glob.sync(path.join(__dirname, '../process/analyzer/**/index.js'))
  files.forEach(function (file) {
    require(file)
  })
}
//

/*Array.prototype.forEach.call(links, function (link) {

  let template = link.import.querySelector('.task-template')
  let clone = document.importNode(template.content, true)
  if (link.href.match('login.html') && !settings.get("isLoggedIn")) {
    document.querySelector('body').appendChild(clone);
    document.getElementById("login-modal").classList.remove("is-shown");
  } else {
    document.querySelector('.content').appendChild(clone)
  }
  document.getElementById("main_loader").classList.add("hide");
})*/
