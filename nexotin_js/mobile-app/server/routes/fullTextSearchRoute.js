const router = require("express").Router()
const productModel = require("../models/productModel")


router.post("/", async (req, res) => {
  let { name } = req.body;
  console.log("NAME TO SEARCH", name);
  
  if(name !== undefined){
    let responseFromDB = await productModel.find(
        { $text: { $search: name } },
        { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(40)
    .select("images name colors price height productQuantity");
  
    res.json({ msg: responseFromDB });
  }

});


module.exports = router