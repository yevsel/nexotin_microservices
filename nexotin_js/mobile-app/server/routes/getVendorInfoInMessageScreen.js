const router = require("express").Router();
const businessAccountModel = require("../models/businessAccountModel");
const individualAccountModel = require("../models/individualAccountModel");

router.post("/", async (req, res) => {
    try {
        const { vendorEmail } = req.body;

        // Use Promise.all to parallelize the queries
        const [resFromBusinessEmail, resFromIndividual] = await Promise.all([
            businessAccountModel.findOne({ businessEmail: vendorEmail }).select("profileImage shopName").lean(),
            individualAccountModel.findOne({ email: vendorEmail }).select("profileImage firstName lastName").lean()
        ]);

        // If found in business account, respond immediately, else respond with individual account result
        if (resFromBusinessEmail) {
            return res.json({ msg: {
                profileImage:resFromBusinessEmail.profileImage?resFromBusinessEmail.profileImage.secure_url:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
                name:resFromBusinessEmail.shopName
            } });
        } else if (resFromIndividual) {
            return res.json({ msg: 
                {
                    profileImage: resFromIndividual.profileImage?resFromIndividual.profileImage.secure_url:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    name:resFromIndividual.firstName+" "+resFromIndividual.lastName
                }
            });
        } else {
            return res.status(404).json({ msg: "Vendor not found" });
        }
        
    } catch (error) {
        // Handle the error properly
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
