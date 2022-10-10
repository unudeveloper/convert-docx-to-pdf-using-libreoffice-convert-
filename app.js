var http = require('http')
// to use express
var express = require('express')
var app = express()
// to prevent cors policy
var cors = require('cors')
app.use(cors())
// to read formdata
const multer  = require('multer')
var upload = multer({ dest: 'uploads/' }).single('inputFile');
// fs node module
var fs = require('fs');
// to convert docx to pdf
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);


app.post('', upload, function(req, res) {
    console.log(req.file);
    fs.readFile( __dirname + '/uploads/' + req.file.filename, async function (err, data) {
        if (err) {
            throw err; 
        }
        console.log("data", data);
        const pdfBuf = await libre.convertAsync(data, '.pdf', undefined);
        try {
            fs.unlinkSync('./uploads/' + req.file.filename)
            //file removed
        } catch(err) {
            console.error(err)
        }
        res.json({data: pdfBuf});
    });
    
    
});

app.listen(3000, function() {
    console.log('Node app is running on port 3000');
});

module.exports = app;