const express = require('express');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const mockResponse = {
    foo: 'bar',
    bar: 'foo'
};

app.use(express.static(DIST_DIR));

app.get('/api', (req, res) => {
    res.send(mockResponse);
});
app.get('/', (req, res) => {
    //res.status(200).send('Hello World!');
    res.sendFile(HTML_FILE);
});
app.listen(port, function () {
    console.log('App listening on port: ' + port);
});



// Ref Node-Babel-Webpack-React
// https://kedar9.medium.com/creating-a-node-app-with-react-webpack-4-babel-7-express-and-sass-8ff8d23b5fcb
