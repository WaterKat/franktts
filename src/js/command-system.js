class CommandSystem {

    static commandIdentifier = '!frank';

    static commandList = [
        'say',
        'skip',
        'mute',
        'unmute',
    ];

    static parse(text) {
        let _text = String(text);

        const response = {
            isCommand: false,
            matchingCommand: '',
            args : '',
        }

        if (!_text.startsWith(CommandSystem.commandIdentifier)) {
            return response;
        }

        _text = _text.substring(CommandSystem.commandIdentifier.length)

        CommandSystem.commandList.every((command) => {
            if (_text.startsWith(command)) {
                isCommand = true;
                response.matchingCommand = command;
                return false;
            }

            return true;
        });

        _text = _text.substring(response.matchingCommand.length);

        response.args = _text;

        return response;
    }
}

module.exports = CommandSystem;