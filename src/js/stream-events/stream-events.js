const responses = require('../config.js').responses;

class StreamEventInterpreter {
    static usernames = [];
    static latest_raid_time = undefined;
    static new_message_raid_cooldown = 1000 * 30;

    static follower(_event) {
        const responseArray = responses[_event.type];
        const response = responseArray[Math.floor(Math.random() * responseArray.length)];
        return response.replace("${username}", _event.username);
    }

    static sub(_event) {
        const responseArray = responses[_event.type];
        const response = responseArray[Math.floor(Math.random() * responseArray.length)];
        return response
            .replace("${username}", _event.username)
            .replace("${amount}", _event.subLength) 
            + " " + _event.message;
    }

    static sub_gift(_event) {
        const responseArray = responses[_event.type];
        const response = responseArray[Math.floor(Math.random() * responseArray.length)];
        return response.replace("${username}", _event.username).replace("${sender}", _event.sender);
    }

    static sub_bomb(_event) {
        if (_event.isInitial) {
            const responseArray = responses[_event.type];
            const response = responseArray[Math.floor(Math.random() * responseArray.length)];
            return response
                .replace("${username}", _event.username)
                .replace("${amount}", _event.count)
                .replace("${sender}", _event.sender)
                + " " + _event.message;
        } else {
            //return `${_event.username} got a sub from ${_event.sender}`;
            return '';
        }
    }

    static cheer(_event) {
        return '';
        const responseArray = responses[_event.type];
        const response = responseArray[Math.floor(Math.random() * responseArray.length)];
        return response
            .replace("${username}", _event.username)
            .replace("${amount}", _event.cheerAmount) 
            + " " + _event.message;
    }

    static raid(_event) {
        StreamEventInterpreter.latest_raid_time = Date.now();

        const responseArray = responses[_event.type];
        const response = responseArray[Math.floor(Math.random() * responseArray.length)];
        return response
            .replace("${username}", _event.username)
            .replace("${amount}", _event.raiderCount);
    }

    static first_message(_event){
        if (!StreamEventInterpreter.usernames.includes(_event.username) && !usernameBlacklist.includes(_event.username.toLowerCase())) {
            StreamEventInterpreter.usernames.push(_event.username);

            const time_since_raid = ((Date.now() - StreamEventInterpreter.latest_raid_time) / StreamEventInterpreter.new_message_raid_cooldown);
            console.log('Time since raid: ', time_since_raid, StreamEventInterpreter.latest_raid_time, Date.now());
            console.log(StreamEventInterpreter.usernames);
            if (time_since_raid <= 1.0){
                return '';
            }

            const responseArray = responses[_event.type];
            const response = responseArray[Math.floor(Math.random() * responseArray.length)];
            return response.replace("${username}", _event.username);
        } else {
            return ``;
        }
    }

    static message(_event) {
        const say_command="!frank say "
        if (_event.message.startsWith(say_command) && _event.mod == true){
            return _event.message.slice(say_command.length);
        }else{
            return StreamEventInterpreter.first_message(_event)
        }
    }

    static ttsMessageFromEvent(_event) {
        let ttsMessage = ''

        if (StreamEventInterpreter[_event.type] !== undefined) {
            ttsMessage = StreamEventInterpreter[_event.type](_event);        
        }
        
        return ttsMessage;
    }
}

module.exports=StreamEventInterpreter;