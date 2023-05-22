const express= require('express');
const {signUpUser,loginUser,allUsers}=require('../controllers/userControllers')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.route('/').post(signUpUser).get(protect,allUsers);
router.route('/login').post(loginUser);

module.exports=router;