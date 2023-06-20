const StreamElements = require('./stream-elements-listener.js');

class StreamEventProcessor {
    static #stream_event = {
        username: '',
        permissions: 'chatter',
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
        }
    }

    static #updatePermissions(_data, _permissions) {
        if (!_data || !_data.event || !_data.event.channel || !_data.event.data || !_data.event.data.tags)
            return;
        if (_data.event.data.nick == _data.event.data.channel && !_permissions.streamer.includes(_data.event.data.nick)) {
            _permissions.streamer.push(_data.event.data.nick);
            return;
        }
        if (_data.event.data.tags.mod === '1' || !_permissions.moderator.includes(_data.event.data.nick)) {
            _permissions.moderator.push(_data.event.data.nick);
            return;
        }
        if (_data.event.data.tags.vip === '1' || !_permissions.vip.includes(_data.event.data.nick)) {
            _permissions.vip.push(_data.event.data.nick);
            return;
        }
        if (_data.event.data.tags.subscriber === '1' || !_permissions.subscriber.includes(_data.event.data.nick)) {
            _permissions.subscriber.push(_data.event.data.nick);
            return;
        }
    };

    static #getUsername(_data) {
        let response = '';

        if (!_data || !_data.event || !_data.event.name)
            return response;
        response = _data.event.name.toLowerCase()

        if (!_data.event.data) {
            return response;
        }
        if (!_data.event.data.nick) {
            return response;
        }

        return _data.event.data.nick.toLowerCase();
    }

    static #getPermissions(_username, _permissions) {
        const defaultResponse = 'chatter';

        const permissionTypes = Object.keys(_permissions);
        permissionTypes.forEach((permissionType) => {
            if (_permissions[permissionType].includes(_username)) {
                return permissionType;
            }
        });

        return defaultResponse;
    }

    static #getType(_data) {
        let response = '';
        if (!_data || !_data.key)
            return response;

        if (_data.key !== 'subscriber')
            return _data.key;

        if (!_data.event)
            return response;

        if (_data.event.bulkGifted || _data.event.isCommunityGift) {
            return 'gift-single';
        } else if (_data.event.gifted) {
            return 'gift-bomb';
        } else {
            return 'sub';
        }
    }

    static #getMessage(_data){
        let response = '';

        if (!_data || !_data.event)
            return response;

        response = _data.event.message || response;

        if (_data.event.data && _data.event.data.text)
            response = _data.event.data.text;

        return response;
    }

    static #getEmotes(_data){
        let response = [];

        if (!_data || !_data.event || !_data.event.data || !_data.event.data.emotes)
            return response;

        _data.event.data.emotes.forEach(emote => {
            response.push({type: emote.type, name: emote.name});
        });

        return response;
    }

    static #getSub(_data){
        const response = {
            length: 0,
        };

        if (!_data || !_data.event || !_data.event.amount)
            return response;

        response.length = _data.event.amount;

        return response;
    }

    static #getGift(_data){
        const response = {
            sender: '',
            count: 1,
            isInitial: false,
            isGifted: true,
            isBulk: false,
        };

        if (!_data || !_data.event || !_data.event.sender)
            return response;
        
        response.sender = _data.event.sender;
        response.count = _data.event.amount || 1;
        response.isInitial = _data.event.bulkGifted || false;
        response.isGifted = _data.event.gifted || false;
        response.isBulk = _data.event.isCommunityGift || false;

        return response;
    }

    static ProcessStreamElementEvent(_data) {
        const streamEvent = Object.create(StreamEventProcessor.#stream_event);
        //const streamEvent = StreamEventProcessor.#stream_event;
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

        //sub
        streamEvent.sub = StreamEventProcessor.#getSub(_data);

        //gift
        streamEvent.gift = StreamEventProcessor.#getGift(_data);

        return streamEvent;
    }
}

function translate(_key, _event) {
    const processedEvent = StreamEventProcessor.ProcessStreamElementEvent({ key: _key, event: _event });
    console.log('Processed Event: ', processedEvent);
    console.log(`Raw SE_Event: ${_key} `, _event);

    let data = {
        type: _key,
        username: _event.name,
    }

    if (data.type == 'subscriber') {
        if (_event.bulkGifted || _event.isCommunityGift) {
            data.type = 'sub_bomb';
        } else if (_event.gifted) {
            data.type = 'sub_gift';
        } else {
            data.type = 'sub';
        }
    }

    if (data.type == 'sub') {
        data.message = _event.message;
        data.subLength = _event.amount;
    }
    if (data.type == 'sub_gift') {
        data.sender = _event.sender;
    }
    if (data.type == 'sub_bomb') {
        data.sender = _event.sender;
        data.count = _event.amount;
        data.message = _event.message;

        data.isInitial = _event.bulkGifted;
        data.isGifted = _event.gifted;
        data.isBulk = _event.isCommunityGift;
    }
    if (data.type == 'raid') {
        data.raiderCount = _event.amount;
    }
    if (data.type == 'cheer') {
        data.cheerAmount = _event.amount;
        data.message = _event.message;
    }
    if (data.type == 'message') {
        data.username = _event.data.nick;
        data.mod = _event.data.tags.mod;
        data.message = _event.data.text;
        data.emotes = [];

        if (_event.data.nick == _event.data.channel) {
            data.mod = "1";
        }

        _event.data.emotes.forEach(element => {
            const emote = {
                type: element.type,
                name: element.name,
            }
            data.emotes.push(emote);
        })

    }

    return data;
}

module.exports = {
    translate: translate,
}