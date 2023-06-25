class WordFilter {
    constructor(_filteredWords, _caseSensitive = false, _replacement = '') {
        this.filteredWords = _filteredWords;
        this.caseSensitive = _caseSensitive;
        this.replacement = _replacement;
    }

    filter(_text) {
        if (!_text)
            return '';

        let response = _text;

        this.filteredWords.forEach(word => {
            if (this.caseSensitive) {
                response = response.replace(word, this.replacement);
            } else {
                const esc = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const reg = new RegExp(esc, 'ig');
                response = response.replace(reg, this.replacement);
            }
        });

        return response;
    }
}

module.exports = WordFilter;
