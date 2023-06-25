class AonyxStreamEvent {
    username = '';
    nickname = '';
    permissions = ['chatter'];
    type = '';
    message = '';
    emotes = [];
    follow = {};
    sub = {
        length: 0,
    };
    gift = {
        sender: '',
        count: 1,
        isInitial: '',
        isGifted: '',
        isBulk: '',
    };
    raid = {
        count: 0,
    };
    cheer = {
        amount: 0,
    };
    chat = {
    };
    command = {
        identifier: '',
        group: '',
        request: '',
        args: '',
        isValid: false,
    }
}

module.exports = AonyxStreamEvent;
