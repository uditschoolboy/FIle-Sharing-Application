const express = require('express');
const app = express();
const connectDB = require('./config/db');
const FileRoutes = require('./routes/files.js');
const DownloadPageRoutes = require('./routes/downloadPage.js');
const DownloadRoutes = require('./routes/download.js');
const path = require('path');

//Connection to mongo Atlas
connectDB();


//Put JSON into req.body
app.use(express.json());

//set template engine to ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//Make static folder
app.use(express.static('public'));


//Use file-upload route
app.use('/api/files', FileRoutes);

//Use file-download-page route
app.use('/files', DownloadPageRoutes);

//Use download route
app.use('/files/download', DownloadRoutes);


app.get('/', (req, res) => {
    res.send("somthing");
})

//Starting the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Listening on port');
});