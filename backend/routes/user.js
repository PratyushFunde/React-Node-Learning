const express=require("express")
const userController=require("../controller/userController");
const verifyJWT = require("../middleware/verifyJWT");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const router=express.Router();



router.get('/',userController.test);
router.post('/registerUser',userController.registerUser);
router.post('/login',userController.login);
router.get('/getData',verifyJWT,userController.getData);

router.post('/editData',verifyJWT,verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),userController.editData)
router.delete('/deleteData',verifyJWT,verifyRoles(ROLES_LIST.Admin),userController.deleteData)

router.get('/refresh',userController.handleRefreshToken)

module.exports=router;