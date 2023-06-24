const responses = require('../responses.js');

class StreamEventInterpreter {
    static responseToEvent(_data) {
        let response = '';

        const responseArray = responses[_data.type];
        if (responseArray) {
            let rawResponse = responseArray[Math.floor(Math.random() * responseArray.length)]
                .replace('${username}', _data.username)
                .replace('${sub.length}', _data.sub.length)
                .replace('${gift.sender}', _data.gift.sender)
                .replace('${gift.count}', _data.gift.count)
                .replace('${cheer.amount}', _data.cheer.amount)
                .replace('${raid.count}', _data.raid.count);
            response = rawResponse;
        }

        return response;
    }
}

module.exports = StreamEventInterpreter;
