const express=require('express');
const refreshController=require("../controller/refreshController");

const router=express.Router();

router.post('/refresh',refreshController.handleRefresh);

module.exports=router;

