const router = require('express').Router();
const FileModel = require('../models/FileModel');

//This api endpoint will render the download page and give the link to download the file.
router.get('/:uuid', async (req, res) => {
    try {
        const file = await FileModel.findOne({uuid: req.params.uuid});
        if(!file) {
            return res.render('download.ejs', {error: 'File Not Found'});
        }
        return res.render('download.ejs', {
            uuid: file.uuid,
            fileName: file.fileName,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })
    } catch(err) {
        return res.render('download.ejs', { error : 'Something went wrong'});
    }

});


module.exports = router;