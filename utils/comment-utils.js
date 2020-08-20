const Request = require('request');

const ITEM_ID_URL = "https://hacker-news.firebaseio.com/v0/item/"
const USER_ID_URL = "https://hacker-news.firebaseio.com/v0/user/"

function CommentUtils() {};

var TopTenComments = function(storyID) {
  return new Promise(async function(resolve, reject) {
    await Request.get(`${ITEM_ID_URL}${storyID}.json`, (err, res, body) => {
      if(err) { throw err; return reject(JSON.stringify(err)); }
      else if (body) {
        body = typeof body === 'string' ? JSON.parse(body) : body;
        if(!body.kids || !body.kids.length) { console.log(`Story does not have kids!`); return resolve([]); }
        body.kids = body.kids.length > 10 ? body.kids.slice(0, 10) : body.kids;
        return resolve(body.kids);
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

var GetUserCreated = function(userID) {
  return new Promise(async function(resolve, reject) {
    await Request.get(`${USER_ID_URL}${userID}.json`, (err, res, body) => {
      if(err) { throw err; return reject(err); }
      else if (body) { body = typeof body === 'string' ? JSON.parse(body) : body; return resolve(body.created); }
      else { return reject(JSON.stringify(res)); }
    });
  });
};

var MapItemObject = function(itemObj, userAge) {
  if(!itemObj) { console.ERROR(`Invalid itemObj obtained \n ${JSON.stringify(itemObj)}`); return null; }
  else {
    let mapObj = {};
    mapObj.comment_text = itemObj.text || null;
    mapObj.user_handle = itemObj.by || null;
    mapObj.user_age = new Date().getUTCFullYear() - new Date(userAge).getUTCFullYear() || null;
    mapObj.kids_length = itemObj.kids && itemObj.kids.length ? itemObj.kids.length : null;
    return mapObj;
  }
};

var ResolveComments = async function(storyID) {
  return new Promise(async function(resolve, reject) {
    var idArr = await TopTenComments(storyID);
    var commentsArr = [];
    for (var i = 0; i < idArr.length; i++) {
      let comment = await GetItemByID(idArr[i]);
      let userAge = await GetUserCreated(comment.by);
      commentsArr.push(await MapItemObject(comment, userAge));
    }
    // Sorting by kids_length
    commentsArr.sort((a, b) => { if(a.kids_length && b.kids_length){ return a.kids_length - b.kids_length } }).reverse();
    return resolve(commentsArr);
  });
};
CommentUtils.prototype.ResolveComments = ResolveComments;
module.exports.CommentUtils = new CommentUtils();
