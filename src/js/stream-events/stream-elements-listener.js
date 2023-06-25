const Subscription = require('../dev-tools/subscription.js');

const StreamElementsEventSubscription = new Subscription();

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
        return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    StreamElementsEventSubscription.invoke({ key: listener, event: event });
});

module.exports = {
    activeSubscription : StreamElementsEventSubscription,
}
