const config = require("./config.js");

const Character = require("./rendering/character.js");
const BrianTTS = require("./text-to-speech/briantts.js");
const TTSFilter = require("./text-to-speech/ttsfilter.js");
const streamelementsListener = require("./stream-events/stream-elements-listener.js");
const streamelementsTranslator = require("./stream-events/stream-elements-translator.js");
const StreamEventInterpreter = require("./stream-events/stream-events.js");
const CommandSystem = require("./command-system.js");
const characterCanvas = document.getElementById('canvas1');
const characterInstance = new Character(characterCanvas);

const ttsInstance = new BrianTTS();
ttsInstance.addAmplitudeSubscriptor(
    (_amplitude) => {
        characterInstance.update_amplitude(_amplitude);
    }
);

streamelementsListener.subscribe((_key, _event) => {
    const streamEvent = streamelementsTranslator.translate(_key, _event);

    //Temporary, Replace with command management system
    if (streamEvent.type == 'message') {
        const commandData = CommandSystem.parse(streamEvent.message);
        
        if (commandData.isCommand){
            if (commandData.matchingCommand === 'skip'){
                ttsInstance.requestStop();
                return;
            }else if (commandData.matchingCommand === 'say') {
                const _blacklistedEmotes = TTSFilter.emotesToBlackList(streamEvent.emotes);
                const _filteredText = TTSFilter.filterALL(commandData.args, _blacklistedEmotes);
                ttsInstance.enqueueRequest(_filteredText);
                return;
            }else{
                console.log(`Command is '${commandData.matchingCommand}', with args: ${commandData.args}`);
            }
        }else{
            console.log("Possible not a command? ", commandData);
        }
    }

    const replyMessage = StreamEventInterpreter.ttsMessageFromEvent(streamEvent);
    const blacklistedEmotes = TTSFilter.emotesToBlackList(streamEvent.emotes);
    const filteredText = TTSFilter.filterALL(replyMessage, blacklistedEmotes);
    ttsInstance.enqueueRequest(filteredText);

});

ttsInstance.enqueueRequest("What's up star beans. My name is Frank.");
