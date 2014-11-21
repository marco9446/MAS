var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({
    ciao:"asd",
    cane:"http://lightstorage.ilcittadinomb.it/mediaon/cms.newilcittadinomb/storage/site_media/media/photologue/2014/4/25/photos/cache/monza-ciao-a-tutti-dallenpa-ecco-chi-cerca-una-casa_cbf9f12a-a5d9-11e3-90ff-e5a46b97fa06_big_story_linked_ima.jpg"});
});

module.exports = router;
