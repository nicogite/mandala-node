const express = require('express');
const path = require('node:path');
const fs = require('fs');
var PDFDocument = require('pdfkit');
var SVGtoPDF = require('svg-to-pdfkit');

const app = express();

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb', extended: true}));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/mandala.html'));
})

app.get('/download', (req, res) => {
    res.send('Download ready !')
})

app.post('/pdf', (req, res) => { 
 
    res.set('Content-Type', 'application/pdf');

    const svg = req.body.svg;

    var doc = new PDFDocument(),
    stream = fs.createWriteStream('pdf/mandala.pdf');
  
    SVGtoPDF(doc, svg, 0, 0);

    stream.on('finish', function() {
        let filePath = "/pdf/mandala.pdf"
        let fileName = 'mandala.pdf'
    
        res.setHeader('Content-disposition', 'attachment; filename="' + fileName + '"');

    // Way 1
    /*fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });*/

    // Way 2
    /*var data =fs.readFileSync(__dirname + filePath);
    res.contentType("application/pdf");
    res.send(data);*/

    // Way 3
    res.download(__dirname + filePath, function (err) {
       if (err) {
           console.log("Error");
           console.log(err);
       } else {
           console.log("Success");
       }    
    });
  });

  doc.pipe(stream);
  doc.end();
   
})

app.listen(5000, () => console.log('Server is up and running'));