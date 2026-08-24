import EventEmitter from "node:events";

const myEmitter = new EventEmitter();

myEmitter.on("greet", (teacher) => {
    console.log(`Class started by ${teacher}`);
});

myEmitter.on("exit", (teacher) => {
    console.log(`Class ended by ${teacher}`);
});
myEmitter.emit("greet", "Akshay");
myEmitter.emit("exit", "Abhay");