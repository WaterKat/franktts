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

const runtimeData = {
    skips: 0,
    isMuted: false,
    usernames: [],
}

const ttsInstance = new BrianTTS();
ttsInstance.addAmplitudeSubscriptor(
    (_amplitude) => {
        characterInstance.update_amplitude(_amplitude);
    }
);

StreamElementsEventsSubscription.subscribe((_data) => {
    const streamEvent = StreamEventProcessor.ProcessStreamElementEvent(_data);

    console.log(streamEvent);

    //Blacklist check
    if (config.usernameBlacklist.includes(streamEvent.username)){
        return;
    }

    //console.log(streamEvent);

    //ignore simulated events
    if (streamEvent.type.startsWith('event'))
        return;

    let reply = '';

    const isMod = streamEvent.permissions.includes('streamer') || streamEvent.permissions.includes('moderator');

    if (isMod && streamEvent.type === 'command' && streamEvent.command.identifier === '!' && streamEvent.command.group === 'frank') {
        switch (streamEvent.command.request) {
            case 'skip':
                if (!isNaN(streamEvent.command.args) && !isNaN(parseFloat(streamEvent.command.args)) && +streamEvent.command.args > 0) {
                    console.log('FrankTTS: Requesting skips (', +streamEvent.command.args, ')');
                    runtimeData.skips += +streamEvent.command.args;
                } else if (streamEvent.command.args.trim().toLowerCase().startsWith('clear')) {
                    console.log('FrankTTS: Requesting skip reset');
                    runtimeData.skips = 0;
                } else {
                    console.log('FrankTTS: Requesting skip ( 1 )');
                    runtimeData.skips += 1;
                }
                let itemsSkipped = ttsInstance.requestStop(runtimeData.skips);
                runtimeData.skips -= itemsSkipped;
                console.log("TTS Skipped in queue: ", itemsSkipped);
                console.log("Current skips queued: ", runtimeData.skips);
                //return;
                break;
            case 'mute':
                console.log('FrankTTS: Muted');
                runtimeData.isMuted = true;
                ttsInstance.requestStop(1000);
                break;
            case 'unmute':
                console.log('FrankTTS: Unnmuted');
                runtimeData.isMuted = false;
                break;
            case 'say':
                console.log(`FrankTTS: ${streamEvent.username} requested a message: `, streamEvent.command.args);
                reply = reply || streamEvent.command.args;
                break;
        }
    }

    if (streamEvent.type !== 'command' && runtimeData.isMuted) {
        console.log("FrankTTS: Event received but is currently muted");
        return;
    }

    //Command Logic


    if (streamEvent.type !== 'command' && runtimeData.skips > 0) {
        //By returning this event does not get processed.
        runtimeData.skips -= 1;
        console.log("FrankTTS: Skips: ", runtimeData.skips);
        return;
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

    reply = reply || conditionalMessage(streamEvent, runtimeData.usernames);

    //Testing
    reply = reply || StreamEventInterpreter.responseToEvent(streamEvent);

    const blacklistedEmotes = TTSFilter.emotesToBlackList(streamEvent.emotes);
    const filteredText = TTSFilter.filterALL(reply, blacklistedEmotes);
    ttsInstance.enqueueRequest(filteredText);
});

ttsInstance.enqueueRequest("What's up star beans. My name is Frank.");
