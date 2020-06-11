const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('VMWare CPQ Expression Processor');
})

app.get('/eval', function (req, res) {
    let expr = req.query.expr;
    console.log(expr);
    let ret = eval(expr);
    res.json({input: expr, result: ret});
})

app.post('/', function (req, res) {
    let jsonData = req.body;
    console.log('input data: ', jsonData);
    Object.keys(jsonData).forEach(function(key) {
        jsonData[key] = eval(jsonData[key]);
    });
    console.log('output data: ', jsonData);
    res.send(jsonData);
})

app.listen(port, () => console.log(`Expression Eval App is listening at http://localhost:${port}`))