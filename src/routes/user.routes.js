import express from 'express';
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory,
    updateUserCoverImage}
    from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router =express.Router();
// ab ham log aise middleware ko inject karenge jaise woh datat process karte wakt raaste mein mujhse(middleware) milte hue jaye
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,            
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured Routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-toekn").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user".length(verifyJWT,getCurrentUser))
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-Image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)


// jab ham isko do params pass karte hain kaam karn eko toh woh jab pehle walesekamm karkr hatega toh jo next() hai uski madad se woh doosre wale param par chala jaega


export default router; 