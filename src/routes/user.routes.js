import express from 'express';
import { registerUser,loginUser,logoutUser,refreshAccessToken} from '../controllers/user.controllers.js';
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
// jab ham isko do params pass karte hain kaam karn eko toh woh jab pehle walesekamm karkr hatega toh jo next() hai uski madad se woh doosre wale param par chala jaega


export default router; 