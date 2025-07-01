import {Router} from 'express';
import { registerUser } from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';

const router =Router();
// ab ham log aise middleware ko inject karenge jaise woh datat process karte wakt raaste mein mujhse(middleware) milte hue jaye
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,            
        },
        {
            name:"CoverIamge",
            maxCount:1
        }
    ]),
    registerUser
)


export default router; 