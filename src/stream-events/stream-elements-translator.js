const StreamElements = require('./stream-elements-listener.js');

class StreamEventProcessor {
    static #stream_event = {
        username: '',
        permissions: ['chatter'],
        type: '',
        message: '',
        emotes: [],
        follow: {
        },
        sub: {
            length: 0,
        },
        gift: {
            sender: '',
            count: 1,
            isInitial: '',
            isGifted: '',
            isBulk: '',
        },
        raid: {
            count: 0,
        },
        cheer: {
            amount: 0,
        },
        chat: {
        },
        command: {
            identifier: '',
            group: '',
            request: '',
            args: '',
            isValid: false,
        }
    }

    static #updatePermissions(_data, _permissions) {
        const username = StreamEventProcessor.#getUsername(_data);

        if (!_permissions)
            return;

        if (!_data || !_data.event || !_data.event.data)
            return;

        if (username == _data.event.data.channel && !_permissions.streamer.includes(username))
            _permissions.streamer.push(username);

        if (!_data.event.data.tags)
            return;

        if (_data.event.data.tags.mod === '1' && !_permissions.moderator.includes(username))
            _permissions.moderator.push(username);


        if (_data.event.data.tags.vip === '1' && !_permissions.vip.includes(username))
            _permissions.vip.push(username);

        if (_data.event.data.tags.subscriber === '1' && !_permissions.subscriber.includes(username))
            _permissions.subscriber.push(username);

    };

    static #getUsername(_data) {
        let response = '';

        if (!_data || !_data.event)
            return response;

        response = _data.event.name || response;

        if (_data.event.data) {
            response = _data.event.data.nick || response;
        }

        return response.toLowerCase();
    }

    static #getPermissions(_username, _permissions) {
        const response = ['chatter'];

        const permissionTypes = Object.keys(_permissions);
        permissionTypes.forEach((permissionType) => {
            if (_permissions[permissionType].includes(_username)) {
                response.push(permissionType);
            }
        });

        return response;
    }

    static #getType(_data) {
        let response = '';
        if (!_data || !_data.key)
            return response;

        if (_data.key !== 'subscriber')
            return _data.key;

        if (!_data.event)
            return response;

        if (_data.event.bulkGifted){
            return 'gift-bomb-sender';
        }else if (_data.event.isCommunityGift) {
            return 'gift-bomb-receiver';
        } else if (_data.event.gifted) {
            return 'gift-single';
        } else {
            return 'sub';
        }
    }

    static #getMessage(_data) {
        let response = '';

        if (!_data || !_data.event)
            return response;

        response = _data.event.message || response;

        if (_data.event.data && _data.event.data.text)
            response = _data.event.data.text;

        return response;
    }

    static #getEmotes(_data) {
        let response = [];

        if (!_data || !_data.event || !_data.event.data || !_data.event.data.emotes)
            return response;

        _data.event.data.emotes.forEach(emote => {
            response.push({ type: emote.type, name: emote.name });
        });

        return response;
    }

    static #getSub(_data) {
        const response = {
            length: 0,
        };

        if (!_data || !_data.event || !_data.event.amount)
            return response;

        response.length = _data.event.amount;

        return response;
    }

    static #getGift(_data) {
        const response = {
            sender: '',
            count: 1,
            isInitial: false,
            isGifted: false,
            isBulk: false,
        };

        if (!_data || !_data.event)
            return response;

        response.sender = _data.event.sender || response.sender;
        response.count = _data.event.amount || response.count;
        response.isInitial = _data.event.bulkGifted || response.isInitial;
        response.isGifted = _data.event.gifted || response.isGifted;
        response.isBulk = _data.event.isCommunityGift || response.isBulk;

        if (response.isInitial){
            response.isBulk = true;
        }

        return response;
    }

    static #getRaid(_data) {
        const response = {
            count: 0,
        };

        if (!_data || !_data.event)
            return response;

        response.count = _data.event.amount || response.count;

        return response;
    }

    static #getCheer(_data) {
        const response = {
            amount: 0,
        };

        if (!_data || !_data.event)
            return response;

        response.amount = _data.event.amount || response.amount;

        return response;
    }

    static #getCommand(_data) {
        const response = {
            identifier: '',
            group: '',
            request: '',
            args: '',
            isValid: false,
        }

        let rawMessage = '';

        if (!_data || !_data.event)
            return rawMessage;

        rawMessage = _data.event.message || rawMessage;

        if (_data.event.data)
            rawMessage = _data.event.data.text || rawMessage;

        rawMessage = rawMessage.trim();

        //4 Is a good minimum length as it allows the minimum requirements '!a b'
        const minimumCommandLength = 4;
        if (rawMessage.length <= minimumCommandLength)
            return response;

        const isAlphaNumericReg = /^[a-zA-Z0-9]+$/;
        const isWhitespaceReg = /\s+/;

        //Command Identifier ex: '!'
        const firstChar = rawMessage[0];
        if (isAlphaNumericReg.test(firstChar)) {
            return response;
        }

        const wordArray = rawMessage.substring(1).split(isWhitespaceReg).filter(word => word !== "");

        //Ensure there are atleast two words;
        if (wordArray.length < 2)
            return response;

        const firstWord = wordArray[0];
        const secondWord = wordArray[1];

        //AT THIS POINT THIS IS A VALID COMMAND
        response.identifier = firstChar || response.identifier;
        response.group = firstWord || response.group;
        response.request = secondWord || response.request;
        response.isValid = true;

        //Grab the rest of the message
        const argsIndex = rawMessage.indexOf(secondWord) + secondWord.length;
        if (argsIndex >= rawMessage.length)
            return response;

        const restOfMessage = rawMessage.substring(argsIndex).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
        response.args = restOfMessage || response.args;

        return response;
    }

    static ProcessStreamElementEvent(_data) {
        const streamEvent = Object.create(StreamEventProcessor.#stream_event);

        //temp
        const permissions = {
            streamer: [],
            moderator: [],
            vip: [],
            subscriber: [],
        };

        //SHOULD BE MOVED OUTSIDE
        StreamEventProcessor.#updatePermissions(_data, permissions);

        //username
        streamEvent.username = StreamEventProcessor.#getUsername(_data);

        //permissions
        streamEvent.permissions = StreamEventProcessor.#getPermissions(streamEvent.username, permissions);

        //type
        streamEvent.type = StreamEventProcessor.#getType(_data);

        //message
        streamEvent.message = StreamEventProcessor.#getMessage(_data);

        //emotes
        streamEvent.emote = StreamEventProcessor.#getEmotes(_data);

        //follow
        //streamEvent.follow = StreamEventProcessor.#getFollow(_data);

        //sub
        streamEvent.sub = StreamEventProcessor.#getSub(_data);

        //gift
        streamEvent.gift = StreamEventProcessor.#getGift(_data);

        //raid
        streamEvent.raid = StreamEventProcessor.#getRaid(_data);

        //cheer
        streamEvent.cheer = StreamEventProcessor.#getCheer(_data);

        //chat
        //streamEvent.chat = StreamEventProcessor.#getChat(_data);

        //command
        streamEvent.command = StreamEventProcessor.#getCommand(_data);
        if (streamEvent.command.isValid){
            streamEvent.type = 'command'
        }

        return streamEvent;
    };
}



module.exports = StreamEventProcessor;
