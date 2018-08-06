const settings = require('electron-settings')
settings.set("api_url","35.229.183.254")
settings.set("apiKey","AIzaSyDWc-qMXnJ59q08kb5SlE-HaT9sAhg2HL4");
settings.set("authDomain","orbocare-prod.firebaseapp.com");
settings.set("databaseURL","https://orbocare-prod.firebaseio.com");
settings.set("projectId","orbocare-prod");
settings.set("storageBucket","orbocare-prod.appspot.com");
settings.set("messagingSenderId","6874922095")
var firebase = require('firebase');
const config = {
    apiKey: settings.get("apiKey"),
    authDomain: settings.get("authDomain"),
    databaseURL: settings.get("databaseURL"),
    projectId:settings.get("projectId"),
    storageBucket: settings.get("storageBucket"),
    messagingSenderId: settings.get("messagingSenderId")
  };
  var app = firebase.initializeApp(config);
