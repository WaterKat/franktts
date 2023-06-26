const AonyxEventListener = require('./aonyx-events/index.js').AonyxEventListener;

const StreamElementsEventListener = require('./stream-elements/index.js').StreamElementsEventListener;
const StreamElementsEventTranslator = require('./aonyx-events/stream-elements-translator.js');

function GetStreamEventListener(_permissions) {
    const aonyxEventListener = new AonyxEventListener();
    const streamelementsEventListener = new StreamElementsEventListener();
    const streamelementsEventTranslator = new StreamElementsEventTranslator(_permissions);


    streamelementsEventListener.activeSubscription.subscribe(
        (_streamelementsEvent) => {
            aonyxEventListener.passthrough(
                streamelementsEventTranslator.processStreamElementEvent(_streamelementsEvent)
            );
        });


    return aonyxEventListener;
}


module.exports = {
    GetStreamEventListener : GetStreamEventListener,
}
