const TTSFilter = require(".");

class CharFilter {
    constructor(_filterNonUnicode = true, _filterEmojis = true, _replacement = '') {
        this.filterNonUnicode = _filterNonUnicode;
        this.filterEmojis = _filterEmojis;
        this.replacement = _replacement;
    }

    filter(_text) {
        if (!_text)
            return '';

        let response = _text;

        if (this.filterEmojis) {
            response = response.replace(
                /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                this.replacement);
        }

        if (this.filterNonUnicode) {
            response = response.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, this.replacement);
        }

        return response;
    }
}

module.exports = CharFilter;
