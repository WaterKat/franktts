class EmoteFilter{
    constructor(_typeWhitelist = [], _replacement = ''){
        this.whitelist = _typeWhitelist;
        this.replacement = _replacement;
    }

    filter(_text, _emotes = []){
        let response = _text;

        _emotes.forEach(emote => {
            if (!this.whitelist.includes(emote.type)){
                response = response.replace(emote.name, this.replacement);
            }
        });

        return response
    }
}

module.exports = EmoteFilter
