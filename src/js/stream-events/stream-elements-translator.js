const StreamElements = require('./stream-elements-listener.js');

function translate(_key, _event) {
    console.log(`translate SE_Event: ${_key} `, _event);

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
                type : element.type,
                name : element.name,
            }
            data.emotes.push(emote);
        })

    }

    return data;
}

module.exports = {
    translate: translate,
}