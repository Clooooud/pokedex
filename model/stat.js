class Stat{
    /**
     * Nom du Stat
     * @type {string}
     */
    #name;

    /**
     * Noms traduits de la stat
     * @type {Object}
     */
    #translatedNames;

    /**
     * Valeur du Stat
     * @type {Number}
     */
    #value;


    /**
     * @param {Number} value
     * @param {string} idString
     */
    constructor(value){
        // Récupération de la valeur du Stat
        this.#value = value;
        this.#translatedNames = {};
    }

    async fetch(idString){
        const json = await pokeFetch(`https://pokeapi.co/api/v2/stat/${idString}/`);
        // Récupération du nom du stat dans le bon langage
        json.names.forEach(name => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
            }
        })
    }
    /**
     * @returns {string} Nom du stat
     */
    get name(){return this.#name;}
    /**
     * @returns {string} Valeur du Stat
     */
    get value(){return this.#value;}

    get translatedNames() {
        return this.#translatedNames;
    }



}
export default Stat;