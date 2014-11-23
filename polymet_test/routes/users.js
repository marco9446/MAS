var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({
    log:[
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "10:10", message:"the house is burning "},
      {hour: "14:30", message:"you lost your house"},
      {hour: "16:50", message:"bye bye"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off cfsgbhjsxsxabssx agsgsvhsgvhxvghs gvhsxgvagsas gvhsxghvgva sjvgsxv"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"},
      {hour: "14:10", message:"light of bathroom off"},
      {hour: "13:15", message:"light of bathroom on"}
      ],
    prova: "this is a prove"
    });
});

router.post('/', function(req, res) {
  console.log(req.body);
  res.end("ok")
});
module.exports = router;
