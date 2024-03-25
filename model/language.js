class Language {
    /**
     * Identifiant de la langue
     * @type {number}
     */
    #id;

    /**
     * Nom de la langue
     * @type {string}
     */
    #name;

    /**
     * Drapeau de la langue (Emoji)
     * @type {string}
     */
    #flag;

    /**
     * 
     * @param {Number} id 
     * @param {String} name 
     * @param {String} flag 
     */
    constructor(id, name, flag) {
        this.#id = id;
        this.#name = name;
        this.#flag = flag;
    }

    /**
     * @returns {number} Id de la langue
     */
    get id() {
        return this.#id;
    }

    /**
     * @returns {string} Nom de la langue
     */
    get name() {
        return this.#name;
    }

    /**
     * @returns {string} Drapeau de la langue
     */
    get flag() {
        return this.#flag;
    }

    /**
     * Les données traduites de l'API sont sous la forme :
     * 
     * {
     *    value: ...
     *    language: {
     *       name: "fr",
     *       url: "https://pokeapi.co/api/v2/language/5/"
     *    }
     * }
     * 
     * Ici on veut récupérer le '5' dans l'url et voir s'il correspond avec l'id de la langue
     * 
     * @returns {RegExp} Regex pour récupérer la langue
     */
    getLanguageRegex() {
        return new RegExp("/language\/(" + this.#id.toString() + ")\/");
    }
}

export default Language;