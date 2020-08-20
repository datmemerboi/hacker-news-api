const fs = require('fs'),
      path = require('path');

var PastUtils = function() {};

var PastFileWrite = async function(json) {
  fs.writeFile(path.join(__dirname,'..','data','past.json'), JSON.stringify(json, null, 4), (err) => {
    if(err) { console.error(`ERROR in PastFileUpdate write! \n ${JSON.stringify(err)}`); }
    else { console.log(`========= Updated past list =========`); return true; }
  });
};

var PastFileUpdate = function(appendData) {
  if(appendData.length) {
    return new Promise(async function(resolve, reject) {
      await fs.readFile(path.join(__dirname,'..','data','past.json'), (err, content) => {
        if(err) { console.error(`ERROR in PastFileUpdate read! \n ${JSON.stringify(err)}`); }
        let json = JSON.parse(content);
        if(json) { console.log(`\tpast.json currently has data of length ${json.length}`); }
        for (var i = 0; i < appendData.length; i++) {
          if(json.indexOf(appendData[i]) === -1) { json.push(appendData[i]); }
        }
        return resolve(PastFileWrite(json));
      });
    });
  }
  else { return null; }
};
PastUtils.prototype.PastFileUpdate = PastFileUpdate;

var GetPastFile = function() {
  console.log("========= Getting past list =========");
  return new Promise(function(resolve, reject) {
    fs.readFile(path.join(__dirname,'..','data','past.json'), (err, past) =>{
      if(err) { console.error(`ERROR GetPastFile`); return reject(null); }
      else { return resolve(JSON.stringify(JSON.parse(past))); }
    });
  });
};
PastUtils.prototype.GetPastFile = GetPastFile;

module.exports.PastUtils = new PastUtils();
