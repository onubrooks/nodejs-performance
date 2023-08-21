const express = require('express');

const app = express();

function delay(duration){
    const startTime = Date.now();
    while(Date.now() - startTime < duration){
        // This is not an I/O activity, event loop is blocked!
    }
}

app.get('/', (req, res) => {
    res.send('Performance example');
});

app.get('/timer', (req, res) => {
    delay(9000);
    res.send('Timer example');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});