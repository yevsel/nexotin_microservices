const router = require("express").Router()


router.post("/",async(req,res)=>{
    try {
        const {report} = req.body
        
        setTimeout(()=>{
            res.json({ msg: "We appreciate your feedback. Our team will investigate the issue." })
        },3000)
        
    } catch (error) {
        
    }
})

module.exports = router