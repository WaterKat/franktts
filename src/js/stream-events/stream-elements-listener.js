const subscribers = [];

function callSubscribers(_listener, _event) {
    subscribers.forEach(subscriber => {
 //       try{
            subscriber(_listener, _event);
//        }catch(e){
//            console.error(e);
//        }
    });
}

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
        return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    callSubscribers( { key: listener, event: event });
});

function subscribe(_function) {
    if (!_function instanceof Function) {
        console.error("Provided value is not a function.");
        return;
    }

    if (subscribers.includes(_function, 0)) {
        console.error("Provided function is already subscribed.");
        return;
    }

    if (_function.length !== 2) {
        console.error("Provided function does not take 2 requirements.");
        return;
    }

    subscribers.push(_function);
}

function unsubscribe(_function) {
    if (!_function instanceof Function) {
        console.error("Provided value is not a function.");
        return;
    }

    if (!subscribers.includes(_function, 0)) {
        console.error("Provided function is not subscribed.");
        return;
    }

    const index = subscribers.indexOf(_function);
    if (index > -1) {
        subscribers.splice(index, 1);
    }
}

module.exports = {
    subscribe : subscribe,
    unsubscribe : unsubscribe,
}