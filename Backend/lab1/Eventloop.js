console.log("This is the starting point of my code");

process.nextTick(() => {
    console.log("This is process.nextTick operation");
});
setTimeout(() => {
    console.log("This is first timeout operation");
}, 2000);
setTimeout(() => {
    console.log("This is second timeout operation");
}, 5000);

const promise = new Promise((resolve, reject) => {
    let success = true;

    if (success) {
        resolve("Data loaded successfully");
    } else {
        reject("Data loading failed");
    }
});

promise
    .then((message) => {
        console.log(message);
    })
    .catch((message) => {
        console.log(message);
    });

console.log("This is the end point of my code");