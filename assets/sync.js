const settings = require("electron-settings");
let $ = require("jquery");
var path = require("path");
var ipcRenderer = require('electron').ipcRenderer;
var Datastore = require('nedb');
var firebase = require('firebase');
var request = require('request');
var db = firebase.database();
settings.set("syncsample",0);
settings.watch("syncsample",function(sample){
  if(sample>0){
  syncsample();
}
})
settings.set("syncPrice",0);
settings.watch("syncPrice",function(price){
  if(price>0){
  syncPrice();
}
})
settings.set("walletSync",0);
settings.watch("walletSync",function(wallet){
  if(wallet>0){
  walletSync();
}
})

settings.set("syncParams",0);
settings.watch("syncParams",function(param){
  if(param>0){
  syncParams();
}
})
settings.set("syncdoctors",0);
settings.watch("syncdoctors",function(doctor){
  if(doctor>0){
  syncdoctors();
}
})
settings.set("syncagents",0);
settings.watch("syncagents",function(agent){
  if(agent>0){
  syncagents();
}
})


window.addEventListener('online',  function(online){
  syncParams();
  syncsample();
  syncdoctors();
  syncagents();
  syncPrice();
  walletSync();
  testsync();
})
  window.addEventListener('offline',  function(offline){
  })
function syncsample(){
  if(navigator.onLine){
  dbsamples.find({"sync":0}, function (err, samples) {
    for(let sample in samples){
      let patient_id = samples[sample].patient_id;
      var patient_details = samples[sample][patient_id];
      patient_details['added_by'] = settings.get("uid");
      db.ref("/patients/"+patient_id).update(patient_details);
      dbpatients.update({"_id":patient_id},{$set:{"sync":1}},{},function(err,updated){
      })
      db.ref("/samples/"+samples[sample].sample_id).update(samples[sample]);
      dbsamples.update({"_id":samples[sample]._id},{$set:{"sync":1}},{},function(err,updated){
      })
    }
  });
}else{
  console.log("Unable to sync due to offline");
}
}
function syncdoctors(){
  if(navigator.onLine){
  dbdoctors.find({"sync":0}, function (err, doctors) {
    for(let doctor in doctors){
    db.ref("/labs/"+settings.get("uid")+"/doctors/"+doctors[doctor]._id).update(doctors[doctor]);
    dbdoctors.update({"_id":doctors[doctor]._id},{$set:{"sync":1}},{},function(err,updated){
    })
  }
  });
}else{
  console.log("Unable to sync due to offline");
}
}
function syncagents(){
  if(navigator.onLine){
  dbagents.find({"sync":0}, function (err, agents) {
    for(let agent in agents){
    db.ref("/labs/"+settings.get("uid")+"/labs/"+agents[agent]._id).update(agents[agent]);
    dbdoctors.update({"_id":agents[agent]._id},{$set:{"sync":1}},{},function(err,updated){
    })
  }
  });
}else{
  console.log("Unable to sync due to offline");
}
}
function syncParams(){
  if(navigator.onLine){
  dbtests.find({"sync":0}, function (err, tests) {
    for(let test in tests){
    dbtestParams.find({test_key:tests[test].testKey},function(err,testparams){
      for(let param in testparams){
        db.ref("/labs/"+settings.get("uid")+"/test_category/"+tests[test].testKey+"/"+testparams[param].param_key).update(testparams[param]);
        db.ref("/labs/"+settings.get("uid")+"/testparams/"+testparams[param].param_key).update(testparams[param]);
      }
    })
    dbtests.update({"testKey":tests[test].testKey},{$set:{"sync":1}},{},function(err,updated){
    })
  }
  });
}else{
  console.log("Unable to sync due to offline");
}
}
function syncPrice(){
  if(navigator.onLine){
  dbtests.find({"sync":0}, function (err, tests) {
    for(let test in tests){
    db.ref("labs/"+settings.get("uid")+"/listests/"+tests[test].testKey).update(tests[test]);
    dbtests.update({"_id":tests[test]._id},{$set:{"sync":1}},{},function(err,numUpdated){
      // console.log(numUpdated);
    })
  }
  });
}else{
  console.log("Unable to sync due to offline");
}
}
function walletSync(){
  dbwallet.find({"sync":0}, function (err, wallets) {
    for(let wallet in wallets){
      var options = {
                            method: 'post',
                            body: {uid:settings.get("uid"),"amount":2,"message":"Wallet deduction from lis"}, // Javascript object
                            json: true, // Use,If you are sending JSON data
                            url: "http://orbopay.orbonix.com/lisWallet",
                            headers: {
                              // Specify headers, If any
                            }
                          }
  request(options, function (err, res, body) {
    if (err) {
      console.log('Error :', err)
    }
    console.log(' Body :', body)
    dbtests.update({"_id":wallets[wallet]._id},{$set:{"sync":1}},{},function(err,numUpdated){
      // console.log(numUpdated);
    })
  });

  }
  });
}
function testsync(){
  console.log("asdfasdf")
  if(navigator.onLine){
  db.ref("test_type").once("value",function(testSnap){
    if(testSnap.val()){
      for(let test in testSnap.val()){
        dballtests.find({'testKey': test},function(err,testExist){
          testSnap.val()[test]['testKey'] = test;
          var testDetails = testSnap.val()[test];
          testDetails['testKey'] = test;
            if(testExist.length>0){
              dballtests.update({"testKey":test},{$set:testDetails},{},function(err,updated){

              })
            }else{
              dballtests.update({"testKey":test},{$set:testDetails},{upsert:true},function(err,testInsertDetails){
              });
            }
        });
      }
    }
  })
}
}
