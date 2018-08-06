var login_button = document.getElementById("login-button");
//var logout_button = document.getElementById("button-logout");
const settings = require('electron-settings');
 const http = require('http');
 const glob = require('glob')
 const path = require('path')
 const net = require('electron').net;
 const querystring = require("querystring");
 const ipc = require('electron').ipcRenderer;
 var firebase = require('firebase');
 var $ = require("jquery");
 var db = firebase.database();
 var firebaseauth = require("firebase/auth");
 ipc.send('dbPath');
 ipc.on("setDbPath",function(event,data){
   settings.set("dbPath",path.join(data, '/orbocare'));
   var Datastore = require('nedb');
   dbusers = new Datastore({ filename: path.join(settings.get("dbPath"), 'users.db'),autoload: true });
   dbtests = new Datastore({ filename: path.join(settings.get("dbPath"), 'tests.db'),autoload: true });
   dbdoctors = new Datastore({ filename: path.join(settings.get("dbPath"), 'doctors.db'),autoload: true });
   dbagents = new Datastore({ filename: path.join(settings.get("dbPath"), 'agents.db'),autoload: true });
   dbtestCategory = new Datastore({ filename: path.join(settings.get("dbPath"), 'testCategory.db'),autoload: true });
   dbtestParams = new Datastore({ filename: path.join(settings.get("dbPath"), 'testParams.db'),autoload: true });
   dbsamples = new Datastore({ filename: path.join(settings.get("dbPath"), 'samples.db'),autoload: true });
 });
login_button.addEventListener('click', function (event) {
  document.getElementById("loader").classList.remove("hide");
  var username = document.getElementById("login_username").value;
  var password = document.getElementById("login_password").value;
  const postData = querystring.stringify({
  'email': username,
  'password':password
});

const options = {
  hostname: settings.get("api_url"),
  port: 8080,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

// db.ref("/groups").on("value",function(snapshot){
//   settings.set("groups",snapshot.val());
//   console.log(snapshot.val())
// })


var userData = {};
if(username!="" && password!=""){
  dbusers.findOne({"username" : username,"password":password}).exec(function(err,docs){

    if(!docs && navigator.onLine){
      firebase.auth().signInWithEmailAndPassword(username, password).then(user=>{
        if(user['uid']){
          userData['uid'] = user['uid'];
          userData['username'] = username;
          userData['password'] = password;
          userData['loggedIn'] = 1;
          db.ref("labs/"+user['uid']).once("value",function(snapshot){
            if(snapshot.val()){
              userData['name'] = snapshot.val()['name'];
              userData['address'] = snapshot.val()['address'];
              userData['email'] = username;
              userData['phone'] = snapshot.val()['phone'];
              settings.set("uid",user['uid']);
                dbusers.insert(userData,function(err,userInsertDetails){
                  console.log(userInsertDetails);
                })
        settings.set("isLoggedIn",true);
      document.getElementById("login_username").value = "";
      document.getElementById("login_password").value = "";
      document.getElementById("loader").classList.add("hide");
      document.getElementById("login-modal").classList.remove("is-shown");
      settings.set('activeSectionButtonId', "sample_list_button");
      $("#list").click();
      }else{
        ipc.send('open-error-dialog');
        document.getElementById("loader").classList.add("hide");
      }
      });
      }
      }).catch(function(err) {
         ipc.send('open-error-dialog');
         document.getElementById("loader").classList.add("hide");
       });
       firebase.auth().onAuthStateChanged(function(user) {
      if(!user){
        settings.set("isLoggedIn",1);
        document.getElementById("login-modal").classList.add("is-shown");
      }
      });
    }else if(!docs && !navigator.onLine){
      console.log("Please connect to the internet")
    }else{
      // get data from nedb
      console.log(docs);
      settings.set("uid",docs['uid']);
      settings.set("isLoggedIn",true);
      document.getElementById("login_username").value = "";
      document.getElementById("login_password").value = "";
      document.getElementById("loader").classList.add("hide");
      document.getElementById("login-modal").classList.remove("is-shown");
      settings.set('activeSectionButtonId', "sample_list_button");
      $("#list").click();
    }
  })
}else{
  document.getElementById("loader").classList.add("hide");
  ipc.send('open-error-dialog');
}
});
function loadDevices(){
  var files = glob.sync(path.join(__dirname, 'process/analyzer/**/index.js'))
  files.forEach(function (file) {
    require(file)
  })
}
document.onkeyup = function(e){
  if(!settings.get("isLoggedIn") && (e.which == 13)){
    document.getElementById("login-button").click();
  }
}
// logout_button.addEventListener('click', function (event) {
//   ipc.send('logout-dialog');
// });
// ipc.on('logout-selection', function (event, index) {
// if (index === 0){
//   settings.set("isLoggedIn",false);
//   document.getElementById("login-modal").classList.add("is-shown");
// }
// })
