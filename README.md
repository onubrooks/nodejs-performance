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

app.get('/delay', (req, res) => {
    delay(9000);
    res.send('Delay example');
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
If we visit our browser with the network tab on, we see that the request to `localhost:3000/` takes around 20ms depending on your environment. However, if we call the `/delay` endpoint, we have to wait for around 9 seconds (assuming we call delay with 9000) for the page to load.
We can also try to load `/delay` in one browser tab and `/` url in a second tab. Notice how the `/` endpoint now takes around 7 to 8 seconds to load. This is because the timer endpoint is blocking the server.
Compare this with an async example like this:

```js
app.get("/delay-async", (req, res) => {
  setTimeout(() => {
    res.send("Async delay example");
  }, 9000);
});
```

Now if we load `/delay-async` on one tab and `/` on a second tab, the second tab loads fast as usual. This is all to illustrate the blocking nature of NodeJs when we aren't performing async operations.

## Real life examples

`JSON.stringify` and `JSON.parse` functions are examples of function calls that can take a long time to execute. These can execute in milliseconds even for large objects, however, if you have a server that takes in many requests, this can add up especially if these requests all make use of these `JSON` functions which is common when logging objects. if a call to `stringify` takes 10ms and your request takes 10ms, you have doubled the response time of the request. Other function to watch out for are sorting very large arrays, as these can start to get slow. Node's crypto module also has functions designed to execute slowly so it's harder for your passwords to be guessed. These are used to create hashes of user's passwordds.

## Improving performance

Generally, in dealing with overloaded servers, we want to divide the work up and spread the load. Knowing that unlike Jave and C#, Node is a single threaded runtime. What we do is to run multiple processes side by side to share the work. Our requests can be spread across multiple NodeJs processes. This simple technique allows NodeJs to make full use of all the CPUs on your machine.
How do we achieve this: enter the [Node cluster module](https://nodejs.org/api/cluster.html). It allows us to create copies of our server process that each run the server code side by side in parallel.
