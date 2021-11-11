const router = require('express').Router();
const FileModel = require('../models/FileModel');

router.get('/:uuid', async (req, res) => {
    const file = await FileModel.findOne({uuid : req.params.uuid});
    if(!file) {
        return res.render('download.ejs', {Error: 'Link has been expired'});
    }
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
});

module.exports = router;