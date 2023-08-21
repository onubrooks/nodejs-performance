const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();

function delay(duration){
    const startTime = Date.now();
    while(Date.now() - startTime < duration){
        // This is not an I/O activity, event loop is blocked!
    }
}

app.get('/', (req, res) => {
    res.send(`Performance example: ${process.pid}`);
});

app.get('/delay', (req, res) => {
    delay(9000);
    res.send(`Delay example: ${process.pid}`);
});

app.get("/delay-async", (req, res) => {
  setTimeout(() => {
    res.send("Async delay example");
  }, 9000);
});

console.log('running server.js');
if(cluster.isMaster){
    console.log(`Master ${process.pid} is running`);
    const NUMCPUs = os.cpus().length;
    for(let i = 0; i < NUMCPUs; i++){
        cluster.fork();
    }
} else{
    console.log(`Worker ${process.pid} started`);
    app.listen(3000);
}