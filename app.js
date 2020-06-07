const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//app.set('port', process.env.PORT || port)

app.get('/', function (req, res) {
    res.send('VMWare CPQ Expression Processor');
})

// PLUS: %2b    -->  2 %2b 3 = 5
// MINUS: -    -->  3 - 2 = 1
// MULTIPLY: *  --> 2 * 3 = 6
// DIVIDE: /    --> 4 / 2 = 1
// EQUALS: %3d%3d -->  4 %3d%3d 4 = true
// BRACKET: eval?expr=(5-2)*6 --> {"input":"(5-2)*6","result":18}
// STRING: eval?expr="Hello"%3d%3d"Hello" --> {"input":"\"Hello\"==\"Hello\"","result":true}
app.get('/eval', function (req, res) {
    let expr = req.query.expr;
    console.log(expr);
    let ret = eval(expr);
    res.json({input: expr, result: ret});
})

app.post('/', function (req, res) {
    res.send('TBD: Eval a POST request');
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))