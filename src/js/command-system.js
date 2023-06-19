class CommandSystem {

    static commandIdentifier = '!frank';

    static commandList = [
        'say',
        'skip',
        'mute',
        'unmute',
    ];

    static parse(_text) {
        const response = {
            isCommand: false,
            matchingCommand: '',
            args : '',
        }

        if (!_text){
            return response;
        }

        let inputText = String(_text);

        if (!inputText.startsWith(CommandSystem.commandIdentifier)) {
            return response;
        }

        inputText = inputText.substring(CommandSystem.commandIdentifier.length)

        CommandSystem.commandList.every((command) => {
            if (inputText.startsWith(command)) {
                isCommand = true;
                response.matchingCommand = command;
                return false;
            }

            return true;
        });

        inputText = inputText.substring(response.matchingCommand.length);

        response.args = inputText;

        return response;
    }
}

module.exports = CommandSystem;