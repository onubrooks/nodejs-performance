# nodejs-performance

Welcome to my NodeJs performance example. In this repository, I demonstrate how some scenarios can cause performance bottlenecks in NodeJs and how to improve performance of our NodeJs apps. Let's get started.

## First things first

To start things off, let's illustrate how NodeJs execution can be blocked using a simple contrived situation. Say we have an ExpressJs app with two endpoints:

```js
const express = require('express');

const app = express();

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
```

We can define our delay function as follows:

```js
function delay(duration){
    const startTime = Date.now();
    while(Date.now() - startTime < duration){
        // This is not an I/O activity, event loop is blocked!
    }
}
```

We know that NodeJs uses a thread pool and the operating system to handle I/O processes and these do not block handling other requests. When the I/O tasks are done, their callbacks are put in the Job Queue so the event loop can process them on the next clock tick. In our `delay()` function however, our server is actually blocked because the while loop is not making any I/O call and is just waiting until a condition is met.
If we visit our browser with the network tab on, we see that the request to `localhost:3000/` takes around 20ms depending on your environment. However, if we call the `/timer` endpoint, we have to wait for around 9 seconds (assuming we call delay with 9000) for the page to load.
We can also try to load `/timer` in one browser tab and `/` url in a second tab. Notice how the `/` endpoint now takes around 7 to 8 seconds to load. This is because the timer endpoint is blocking the server.
