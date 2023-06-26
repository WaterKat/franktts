const Subscription = require('../../dev-tools/index.js').Subscription;

class AonyxEventListener{
    activeSubscription = new Subscription();

    passthrough(_event){
        this.activeSubscription.invoke(_event);
    }
}

module.exports = AonyxEventListener;
