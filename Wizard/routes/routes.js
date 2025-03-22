const wizardController = require('../Controller/wizardController');

const router = require('express').Router();

router.post('/run',wizardController.Run);
router.post("/savecode",wizardController.SaveCode);
router.post("/getfiles",wizardController.getfiles);
router.post("/getfiledata",wizardController.getFileData);
router.post("/updatecode",wizardController.UpdateCode);
 router.post("/updatefilename",wizardController.UpdateFileName);
 
 router.post("/deletefile",wizardController.deleteFile);
router.post("/ai",wizardController.AiCode);
router.post("/registor",wizardController.registor);
router.post("/login",wizardController.login);
router.get("/getusername",wizardController.getUserName);

module.exports=router;;