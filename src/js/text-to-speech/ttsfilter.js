const emoteWhitelist = require('../config.js').emoteWhitelist;

class TTSFilter {
    static words = [
        "dyke",
        "fag",
        "fag1t",
        "faget",
        "fagg1t",
        "faggit",
        "faggot",
        "fagg0t",
        "fagit",
        "fags",
        "fagz",
        "faig",
        "faigs",
        "femboy",
        "Fudge Packer",
        "gook",
        "g00k",
        "jap ",
        "japs",
        "Lezzian",
        "Lipshits",
        "Lipshitz",
        "n1gr",
        "nastt",
        "nigger",
        "nigur",
        "niiger",
        "niigr",
        "polac",
        "polack",
        "polak",
        "Poonani",
        "qweir",
        "retard",
        "chink",
        "nazi",
        "nigga",
        "nigger",
        "shemale",
        "w00se",
        "amcik",
        "andskota",
        "ayir",
        "butt-pirate",
        "cazzo",
        "chraa",
        "chuj",
        "daygo",
        "dego",
        "dike",
        "dupa",
        "dziwka",
        "Ekrem",
        "Ekto",
        "enculer",
        "faen",
        "fag",
        "fanculo",
        "fanny",
        "feg",
        "Flikker",
        "gook",
        "honkey",
        "hui",
        "injun",
        "kanker",
        "kike",
        "klootzak",
        "kraut",
        "knulle",
        "kuk",
        "kuksuger",
        "Kurac",
        "kurwa",
        "kusi",
        "kyrpa",
        "lesbo",
        "mamhoon",
        "mibun",
        "monkleigh",
        "mouliewop",
        "muie",
        "mulkku",
        "muschi",
        "nazis",
        "nepesaurio",
        "nigger",
        "orospu",
        "paska",
        "perse",
        "picka",
        "pierdol",
        "pillu",
        "pimmel",
        "pizda",
        "poontsee",
        "pula",
        "pule",
        "rautenberg",
        "schaffer",
        "scheiss",
        "schlampe",
        "sharmuta",
        "sharmute",
        "shipal",
        "shiz",
        "skribz",
        "skurwysyn",
        "sphencter",
        "spic",
        "spierdalaj",
        "suka",
        "vittu",
        "wetback",
        "wichser",
        "wop",
        "yed",
        "zabourah"
    ];

    static caseSensitive(_string, _word, _replacement) {
        return _string.replace(_word, _replacement);
    };

    static caseInsensitive(_string, strReplace, strWith) {
        // See http://stackoverflow.com/a/3561711/556609
        var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var reg = new RegExp(esc, 'ig');
        return _string.replace(reg, strWith);
    };

    static removeEmojis(_string, _replacement) {
        return _string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, _replacement);
    }

    static emotesToBlackList(_emotes) {
        let blacklist = []

        if (!_emotes){
            return [];
        }

        _emotes.forEach(emote=>{
            if (!emoteWhitelist.includes(emote.type)){
                blacklist.push(emote.name);
            }
        });

        return blacklist;
    }

    static filterALL(_text, _blacklist = []) {
        let filtered_text = ' ' + _text + ' ';

        //doublespaced
        filtered_text = filtered_text.replace(' ', '    ');
        filtered_text = filtered_text.replace('.', ' . ');

        //caseInsensitive
        TTSFilter.words.forEach(_badWord => {
            var replacementWord = new Array(_badWord.length + 1).join('ᴺ');
            filtered_text = TTSFilter.caseInsensitive(filtered_text, ' ' + _badWord + ' ', replacementWord + '!');
        });

        //emojis
        filtered_text = TTSFilter.removeEmojis(filtered_text, '');

        //caseSensitive
        _blacklist.forEach(_blacklistWord => {
            filtered_text = TTSFilter.caseSensitive(filtered_text, ' ' + _blacklistWord + ' ', ' ');
        });

        filtered_text = filtered_text.replace(' . ', '.');
        filtered_text = filtered_text.replace('  ', ' ').replace('  ', ' ');
        filtered_text = filtered_text.trim();

        console.log("Filtered Text: ", filtered_text);

        return filtered_text
    }
}

module.exports = TTSFilter;