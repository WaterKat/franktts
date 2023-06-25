const Subscription = require('../../dev-tools/subscription.js');

class AonyxEventListener{
    activeSubscription = new Subscription();

    passthrough(_event){
        this.activeSubscription.invoke(_event);
    }
}

module.exports = AonyxEventListener;
