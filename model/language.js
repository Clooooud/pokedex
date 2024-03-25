class Language {
    #id;

    #name;

    #flag;

    constructor(id, name, flag) {
        this.#id = id;
        this.#name = name;
        this.#flag = flag;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get flag() {
        return this.#flag;
    }

    getLanguageRegex() {
        return new RegExp("/language\/(" + this.#id.toString() + ")\/");
    }
}

export default Language;