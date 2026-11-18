const router = require("express").Router();
const userModel = require("../models/userModel");

router.post("/", async (req, res) => {
    try {
        const {  cusEmail } = req.body;
        
        // Find user by email
        const response = await userModel.findOne({ email: cusEmail }).select("profileImage firstName lastName").lean();
        // If user is not found, return a 404 response
        if (!response) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        // Respond with user data, using default profile image if not available
        return res.json({
            msg: {
                profileImage: response.profileImage ? response.profileImage.secure_url : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                name: `${response.firstName} ${response.lastName}`
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
