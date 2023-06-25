class Subscription {
    constructor() {
        this.functions = [];
    }

    #newResponse(_success) {
        const response = {};
        response.successful = _success;
        response.then = (_function) => { if (!response.successful) return; _function(); return response; }
        response.catch = (_function) => { if (response.successful) return; _function(); return response; }
        return response;
    }

    subscribe(_function) {
        if (typeof _function !== 'function') {
            return this.#newResponse(false);
        }

        if (this.functions.includes(_function)) {
            return this.#newResponse(false);
        }

        this.functions.push(_function);
        return this.#newResponse(true);
    }

    unsubscribe(_function) {
        if (typeof _function !== 'function') {
            return this.#newResponse(false);
        }

        if (!this.functions.includes(_function)) {
            return this.#newResponse(false);
        }

        const functionIndex = this.functions.indexOf(_function);
        if (functionIndex !== -1) {
            this.functions.splice(functionIndex, 1);
        }
    }

    invoke(_data){
        this.functions.forEach(_function => {
            _function(_data);
        });
    }
}

module.exports = Subscription;