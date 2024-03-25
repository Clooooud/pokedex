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
        const json = await pokeFetch(`stat/${idString}/`);
        // Récupération du nom du stat dans le bon langage
        json.names.filter(name => name != null).forEach((name, index) => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
                delete name.language.name;
            } else {
                delete json.names[index]; // Optimisation du cache
            }
        })

        // Sauvegarde de l'utile dans le cache
        Object.keys(json).filter(key => key !== "names").forEach(key => {
            delete json[key];
        });
        pokeCache(`stat/${idString}/`, json);
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