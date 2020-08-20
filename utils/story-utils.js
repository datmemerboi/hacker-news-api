const Request = require('request');

const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const ITEM_ID_URL = "https://hacker-news.firebaseio.com/v0/item/"

function StoryUtils() {};

var TopTenStories = async function() {
  return new Promise(async function(resolve, reject) {
    await Request.get(TOP_STORIES_URL, (err, res, body) => {
      if(err) { throw err; return reject(JSON.stringify(err)); }
      else if (body) {
        body = typeof body === 'string' ? JSON.parse(body) : body;
        return resolve(body.slice(0, 10));
      }
      else { return reject(JSON.stringify(res)); }
    });
  });
};

var GetItemByID = function(itemID) {
  return new Promise(async function(resolve, reject) {
    await Request.get(`${ITEM_ID_URL}${itemID}.json`, (err, res, body) => {
      if(err) { throw err; return reject(err); }
      else if (body) { body = typeof body === 'string' ? JSON.parse(body) : body; return resolve(body); }
      else { return reject(JSON.stringify(res)); }
    });
  });
};

var MapItemObject = function(itemObj) {
  if(!itemObj) { console.ERROR(`Invalid itemObj obtained \n ${JSON.stringify(itemObj)}`); return null; }
  else {
    let mapObj = {};
    mapObj.title = itemObj.title || null;
    mapObj.url = itemObj.url || null;
    mapObj.score = itemObj.score || null;
    if(itemObj.time) {
      mapObj.unix_time = itemObj.time;
      let date = new Date(itemObj.time * 1000);
      mapObj.submission_time = `${('0'+date.getHours()).substr(-2)}:`+
          `${('0'+date.getMinutes()).substr(-2)}:`+
          `${('0'+date.getSeconds()).substr(-2)}`;
    }
    mapObj.user = itemObj.by;
    return mapObj;
  }
}

var ResolveStories =  async function() {
  return new Promise(async function(resolve, reject) {
    var idArr = await TopTenStories();
    var storiesArr = [];
    for (var i = 0; i < idArr.length; i++) {
      let story = await GetItemByID(idArr[i]);
      story = await MapItemObject(story);
      storiesArr.push(story);
    }
    // Sorting based on score
    storiesArr.sort((a, b) => { return a.score - b.score }).reverse();
    return resolve(storiesArr);
  });
}
StoryUtils.prototype.ResolveStories = ResolveStories;

module.exports.StoryUtils = new StoryUtils();
