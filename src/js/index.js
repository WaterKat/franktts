//import { setData, getData } from "./database/firestore/index.js";
import { setData, getData } from "./database/index.js";

const BrianTTS = require("./text-to-speech/index.js");
const stream_events = require('./stream-events/index.js');
const TTSFilter = require('./text-processing/index.js');
const SimpleMessageResponder = require('./responses/index.js');

const PNGTuber = require("./pngtuber/index.js");

import { VTuber } from './vtuber/vtuber.js';
let vtuberInstance = undefined;

const authData = require('./authentication/index.js');

async function init() {
    const userConfig = await getData(authData.userID);
    console.log('UserConfiguration: ', userConfig);

    const AonyxEventListener = stream_events.GetStreamEventListener(userConfig.admin.permissions);
    const ttsFilter = new TTSFilter(userConfig.filters.words, userConfig.filters.emotes.whitelist);
    const simpleMessageResponder = new SimpleMessageResponder(userConfig.responses);

    let characterCanvas = document.getElementById('canvas1');
    if (!characterCanvas) {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'canvas1';
        characterCanvas = newCanvas;
        document.body.appendChild(newCanvas);
    }
    const characterInstance = new PNGTuber(characterCanvas, userConfig.pngTuber.sources);

    if (typeof VTuber !== 'undefined') {
        vtuberInstance = new VTuber();
    } else {
        console.log('Vtuber instance not created');
    }

    const runtimeData = {
        skips: 0,
        isMuted: false,
        usernames: [],
        lastRaidTime: new Date(0, 0),
    }

    const ttsInstance = new BrianTTS();
    ttsInstance.addAmplitudeSubscriptor(
        (_amplitude) => {
            characterInstance.update_amplitude(_amplitude);
        }
    );

    if (typeof VTuber !== 'undefined') {
        ttsInstance.addAmplitudeSubscriptor(
            (_amplitude) => {
                vtuberInstance.update_amplitude(_amplitude);
            }
        );
    } else {
        console.log("VTuber instance not subscribed");
    }

    AonyxEventListener.activeSubscription.subscribe((streamEvent) => {
        //ignore simulated events
        if (streamEvent.type.startsWith('event')) {
            return;
        }

        console.log(JSON.stringify(streamEvent));

        //nickname
        if (!streamEvent.nickname) {
            const nicknameTable = userConfig.admin.nicknames[streamEvent.username];
            if (!nicknameTable) {
                streamEvent.nickname = streamEvent.username.replace('_', ' ');
            } else {
                streamEvent.nickname = nicknameTable[Math.floor(Math.random() * nicknameTable.length)];
            }
        }


        console.log(streamEvent);


        //Blacklist check
        if (userConfig.admin.blacklist.includes(streamEvent.username)) {
            console.log(`FrankTTS: Event from blacklisted username : ${streamEvent.username}`);
            return;
        }


        //Latest Raid Check
        if (streamEvent.type === 'raid') {
            runtimeData.lastRaidTime = new Date();
        }

        //console.log(streamEvent);

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

        const greetFirstMessage = (_data, _usernames) => {
            if (_data.type !== 'message')
                return '';

            const messages = [
                "Welcome, ${nickname}! Enjoy the cosmic vibes!",
                "Greetings, ${nickname}! Thanks for joining us!",
                "Hello there, ${nickname}! It's great to see you in the chat!",
                "Hey, ${nickname}! The cosmic adventure begins now. Buckle up!",
                "Greetings, ${nickname}! Your presence makes the stream shine brighter!",
                "Welcome, ${nickname}! Your arrival brings a new spark to the cosmic journey!",
            ];

            if (!_usernames.includes(_data.username)) {
                _usernames.push(_data.username);

                const secondsSinceRaid = (new Date() - runtimeData.lastRaidTime) / 1000;
                if (secondsSinceRaid > userConfig.behaviour.raid.ignoreFirstMessageForSeconds) {
                    const newMessageResponse = messages[Math.floor(Math.random() * messages.length)]
                        .replace('${nickname}', _data.nickname);
                    return newMessageResponse;
                } else {
                    console.log('FrankTTS: Raid timeout is still active');
                }
            }

            return '';
        };

        reply = reply || greetFirstMessage(streamEvent, runtimeData.usernames);

        reply = reply || simpleMessageResponder.respondToEvent(streamEvent);

        if (streamEvent.type === 'sub' || streamEvent.type === 'gift-bomb-sender' || streamEvent.type === 'gift-single') {
            if (streamEvent.message) {
                reply = reply + '. ' + streamEvent.message;
            }
        }

        const filteredText = ttsFilter.filterAll(reply, streamEvent.emotes);

        ttsInstance.enqueueRequest(filteredText);
    });


    ttsInstance.enqueueRequest("What's up star beans. My name is Frank.");
}

init();
