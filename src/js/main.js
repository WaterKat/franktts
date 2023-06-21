const config = require("./config.js");

const Character = require("./rendering/character.js");
const BrianTTS = require("./text-to-speech/briantts.js");
const TTSFilter = require("./text-to-speech/ttsfilter.js");
const StreamElementsEventsSubscription = require("./stream-events/stream-elements-listener.js");
const StreamEventProcessor = require("./stream-events/stream-elements-translator.js");
const StreamEventInterpreter = require("./stream-events/stream-events.js");
const CommandSystem = require("./command-system.js");
const characterCanvas = document.getElementById('canvas1');
const characterInstance = new Character(characterCanvas);

const usernames = [];

const ttsInstance = new BrianTTS();
ttsInstance.addAmplitudeSubscriptor(
    (_amplitude) => {
        characterInstance.update_amplitude(_amplitude);
    }
);

StreamElementsEventsSubscription.subscribe((_data) => {
//    const oldStreamEvent = StreamEventProcessor.translate(_data);
    const streamEvent = StreamEventProcessor.ProcessStreamElementEvent(_data);

    let reply = '';

    if (streamEvent.type === 'command' && streamEvent.command.identifier === '!' && streamEvent.command.group === 'frank') {
        switch (streamEvent.command.request) {
            case 'skip':
                ttsInstance.requestStop();
                return;
            //break;
            case 'say':
                reply = reply || streamEvent.command.args;
                break;
        }
    }

    const conditionalMessage = (_data, _usernames) => {
        if (_data.type !== 'message')
            return '';

        const messages = [
            "Welcome, ${username}! Enjoy the cosmic vibes!",
            "Greetings, ${username}! Thanks for joining us!",
            "Hello there, ${username}! It's great to see you in the chat!",
            "Hey, ${username}! The cosmic adventure begins now. Buckle up!",
            "Greetings, ${username}! Your presence makes the stream shine brighter!",
            "Welcome, ${username}! Your arrival brings a new spark to the cosmic journey!",
        ];

        if (!_usernames.includes(_data.username)) {
            _usernames.push(_data.username);

            return messages[Math.floor(Math.random() * messages.length)].replace('${username}', _data.username);
        }

        return '';
    };

    reply = reply || conditionalMessage(streamEvent, usernames);

    //Testing
    reply = reply || StreamEventInterpreter.responseToEvent(streamEvent);

    const blacklistedEmotes = TTSFilter.emotesToBlackList(streamEvent.emotes);
    const filteredText = TTSFilter.filterALL(reply, blacklistedEmotes);
    ttsInstance.enqueueRequest(filteredText);
});

ttsInstance.enqueueRequest("What's up star beans. My name is Frank.");
