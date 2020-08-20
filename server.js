const express = require('express'),
      app = express(),
      router = express.Router();

const StoryUtils = require('./utils/story-utils').StoryUtils;
const CommentUtils = require('./utils/comment-utils').CommentUtils;
const PastUtils = require('./utils/past-utils').PastUtils;

let port = process.env.PORT || 8080;

app.use(express.json()); app.use(router);

var cacheContent = [];

function updateCache() {
  console.log("========= New cache =========");
  StoryUtils.ResolveStories()
    .then(storiesArr => { cacheContent = storiesArr; console.log(`\tNew cache of length ${cacheContent.length}`); })
    .catch(err => { console.error(`ERROR at resetting cache \n ${JSON.stringify(err)}`); });
};

setInterval(async function() {
  console.log("========= Archiving old cache =========");
  await PastUtils.PastFileUpdate(cacheContent);
  updateCache();
}, 600000);


// ROUTES
router.all('/health', (req, res) => {
  res.status(200).json({ success: true, message: "Welcome!" }); res.end();
});
router.all('/past-stories', (req, res) => {
  console.log("========= Past Stories Request =========");
  PastUtils.GetPastFile()
    .then(past => {
      past = JSON.parse(past);
      if(!past || !past.length) { res.status(204).send("NULL past stories list"); }
      res.status(200).json({ success:true, body: past });
    })
    .catch(err => { res.status(500).send("ERROR in fetch past stories"); });
});
router.all('/top-stories', (req, res) => {
  console.log("========= Top stories Request =========");
  if(!cacheContent.length) { res.status(204).send("NULL top stories list"); }
  else { res.status(200).json({ success: true, body: cacheContent }); }
});
router.post('/comments/:sid/', (req, res) => {
  console.log("========= Comments Request =========");
  if(!req.params.sid) { res.status(401).send("NULL story ID parameter"); }
  CommentUtils.ResolveComments(req.params.sid)
    .then(commentsArr => { res.status(200).json({ success: true, body: commentsArr }); res.end(); })
    .catch(err => { res.status(500).send("ERROR in fetch comments of story"); });
});


app.listen(port, (err) => {
  if(err) { throw err; }
  else { console.log(`Express server running at http://127.0.0.1:${port}/`); updateCache(); }
});
