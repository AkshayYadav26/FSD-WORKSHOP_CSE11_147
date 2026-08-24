import EventEmitter from "node:events";

const emitter = new EventEmitter();

function addEventListener(eventType, listener) {
    emitter.on(eventType, listener);
}

function removeEventListener(eventType, listener) {
    emitter.off(eventType, listener);
}

function dispatchEvent(event) {
    emitter.emit(event.type, event);
}


addEventListener("save", () => {
    console.log("saving....");
});

dispatchEvent({
    type: "save"
});
const button = document.createElement("button");
button.innerText = "Submit";
button.addEventListener("click", handleClick);
function handleClick(event) {
    dispatchEvent({
        type: "submit"
    });
}
addEventListener("submit", () => {
    console.log("Form submitted successfully!");
});