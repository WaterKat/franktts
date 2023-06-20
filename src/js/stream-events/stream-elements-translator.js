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

    static ProcessStreamElementEvent(_data) {
        const streamEvent = Object.create(StreamEventProcessor.#stream_event);
        //const streamEvent = StreamEventProcessor.#stream_event;
        //temp
        const permissions = {
            streamer : [],
            moderator : [],
            vip : [],
            subscriber : [],
        };

        //temp
        const updatePermissions = () => {
            if (!_data || !_data.event || !_data.event.channel || !_data.event.data || !_data.event.data.tags)
                return;
            if (_data.event.data.nick == _data.event.data.channel && !permissions.streamer.includes(_data.event.data.nick)){
                permissions.streamer.push(_data.event.data.nick);
                return;
            }
            if (_data.event.data.tags.mod === '1' || !permissions.moderator.includes(_data.event.data.nick)){
                permissions.moderator.push(_data.event.data.nick);
                return;
            }
            if (_data.event.data.tags.vip === '1' || !permissions.vip.includes(_data.event.data.nick)){
                permissions.vip.push(_data.event.data.nick);
                return;
            }
            if (_data.event.data.tags.subscriber === '1' || !permissions.subscriber.includes(_data.event.data.nick)){
                permissions.subscriber.push(_data.event.data.nick);
                return;
            }
        };
        updatePermissions();

        //username
        const getUsername = () => {
            let response = '';
            
            if (!_data || !_data.event || !_data.event.name)
                return response;
            response = _data.event.name.toLowerCase()

            if (!_data.event.data){
                return response;
            }
            if (!_data.event.data.nick){
                return response;
            }
            return _data.event.data.nick.toLowerCase();
        }
        streamEvent.username = getUsername();

        //permissions
        const getPermissions = () => {
            const defaultResponse = 'chatter';

            const permissionTypes = Object.keys(permissions);
            permissionTypes.forEach((permissionType) => {
                if (permissions[permissionType].includes(streamEvent.username)){
                    return permissionType;
                }
            });

            return defaultResponse;
        }
        streamEvent.permissions = getPermissions();

        //type
        if (_data.key !== 'subscriber') {
            streamEvent.type = _data.key;
        } else {
            if (_data.event.bulkGifted || _data.event.isCommunityGift) {
                streamEvent.type = 'gift-single';
            } else if (_data.event.gifted) {
                streamEvent.type = 'gift-bomb';
            } else {
                streamEvent.type = 'sub';
            }
        }

        return streamEvent;
    }
}

function translate(_key, _event) {
    const processedEvent = StreamEventProcessor.ProcessStreamElementEvent({key: _key, event: _event});
    console.log('Processed Event: ', processedEvent);
//    console.log(`translate SE_Event: ${_key} `, _event);

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