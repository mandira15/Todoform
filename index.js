const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs'); 

const filesDirectory = path.join(__dirname, 'files');
// Set the view engine to ejs

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Set the path for your views directory
app.set('views', path.join(__dirname, 'views'));

// A route to render your index.ejs page
app.get('/', (req, res) => {
    // This will look for 'index.ejs' in your 'views' folder
    fs.readdir(filesDirectory, function(err, files){
        if (err) return res.status(500).send("Error reading files directory.");
        res.render('index', { files: files });
    })
    
});
app.get('/file/:filename', function(req, res)  {
    fs.readFile(path.join(filesDirectory, req.params.filename) ,"utf-8" , function(err, filedata){  //utf8 made it in eng
        if (err) return res.status(404).send("File not found.");
        res.render('show', {filename: req.params.filename, filedata : filedata});
    })
});

app.get('/edit/:filename', function(req, res)  {
    res.render('edit', {filename: req.params.filename});
})

app.post('/edit', function(req, res){
    const oldFilename = req.body.previous;
    // Sanitize the new filename and add the .txt extension, just like in the /create route
    const newFilename = req.body.new.split('.').join('') + '.txt';

    fs.rename(path.join(filesDirectory, oldFilename), path.join(filesDirectory, newFilename) , function(err){
        if (err) {
            console.error(err);
            return res.status(500).send("Error renaming the file.");
        }
        res.redirect("/");
    })
});

app.post('/create', (req, res) => {
    fs.writeFile(path.join(filesDirectory, `${req.body.title.split('.').join('')}.txt`), req.body.details, function(err){
        res.redirect("/")
    })
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running and listening on http://localhost:${port}`);
});