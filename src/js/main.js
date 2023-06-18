const config = require("./config.js");

const Character = require("./rendering/character.js");
const BrianTTS = require("./text-to-speech/briantts.js");
const TTSFilter = require("./text-to-speech/ttsfilter.js");
const streamelementsListener = require("./stream-events/stream-elements-listener.js"); 
const streamelementsTranslator = require("./stream-events/stream-elements-translator.js");
const StreamEventInterpreter = require("./stream-events/stream-events.js");

const characterCanvas = document.getElementById('canvas1');
const characterInstance = new Character(characterCanvas);

const ttsInstance = new BrianTTS();
ttsInstance.addAmplitudeSubscriptor(
    (_amplitude) => {
        characterInstance.update_amplitude(_amplitude);
    }
);

streamelementsListener.subscribe( (_key, _event) => {
    const streamEvent = streamelementsTranslator.translate(_key, _event);
    const replyMessage = StreamEventInterpreter.ttsMessageFromEvent(streamEvent);
    const blacklistedEmotes = TTSFilter.emotesToBlackList(streamEvent.emotes);
    const filteredText = TTSFilter.filterALL(replyMessage, blacklistedEmotes);
    ttsInstance.enqueueRequest(filteredText);
});

ttsInstance.enqueueRequest("What's up star beans. My name is Frank.");