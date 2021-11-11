const multer = require('multer');
const router = require('express').Router();
const path = require('path');
const FileModel = require('../models/FileModel');
const {v4: uuid4} = require('uuid');

//Initialising disk storage for multer. This will specify destination and filename for the file to be saved.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, name);
    }
});

//Initialising upload object with storage object and giving field name in single function to fetch the file with the given field name in the form
const upload = multer({storage}).single('myfile');

//Upload file route
router.post('/', function(req, res) {
    //Step 1 : put the file in req.file using multer. The file if exists will be uploaded to uploads folder
    upload(req, res, async (err) => {
        //Step 2 : Validate the existence of file using multer
        if(!req.file) {
            return res.status(400).json({"Message" : "File not found"});
        }

        if(err) {
            return res.status(500).send({error : err.message})
        }

         //Step 3 : Store into database
        //Create a file to store using the FileModel
        const file = new FileModel({
            fileName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuid4()
        });

        let dbres = await file.save();

        //Step 4 : Returning the URL to download the file to the user
        return res.json({fileLink: `${process.env.APP_BASE_URL}/files/${dbres.uuid}`});
    });
});

//Send Email route
router.post('/send', async (req, res) => {
   const {uuid, emailTo, emailFrom} = req.body;

   //Validation of body 
   if(!uuid || !emailTo || !emailFrom) {
       return res.status(422).send({error: "All Fields are required"});
   } 
   //Get data of requested file from dataBase
   const file = await FileModel.findOne({uuid: uuid});

   //If already sent the email once then throw error
   if(file.sender) {
       return res.status(422).send({Error: "Email already sent"});
   }

   //Send Email
   const sendMail = require('../services/emailService');
    try {
        await sendMail({
            from: emailFrom,
            to: emailTo,
            subject: "IN Share file Sharing",
            text: `${emailFrom} shared a file with you`,
            html: require('../services/emailTemplate')({
                emailFrom,
                downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({success: "false"});
    }

    //Attach sender and receiver in file details and save it in the database
   file.sender = emailFrom;
   file.receiver = emailTo;
   await file.save();

   //respond to user about sent status
   return res.status(200).json({success: "true"});
});


module.exports = router;