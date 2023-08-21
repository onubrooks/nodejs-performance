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

app.get('/delay', (req, res) => {
    delay(9000);
    res.send('Delay example');
});

app.get("/delay-async", (req, res) => {
  setTimeout(() => {
    res.send("Async delay example");
  }, 9000);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});