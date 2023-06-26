const Subscription = require('../../dev-tools/subscription.js');


class StreamElementsEventListener{
    constructor(){
        this.activeSubscription = new Subscription();
        this.processEvent = this.#processEvent.bind(this);

        window.addEventListener('onEventReceived', this.processEvent);
    }

    #processEvent(_eventData){
        if (!_eventData.detail.event)
            return;

        if(typeof _eventData.detail.event.itemId !== 'undefined'){
            _eventData.detail.listener = 'redemption-latest';
        }

        this.activeSubscription.invoke({
            key: _eventData.detail.listener.split("-")[0],
            event: _eventData.detail.event,
        });      
    }
}

module.exports = StreamElementsEventListener
