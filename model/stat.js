import Language from "./language.js";

class Stat{

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
     * @param {string} name
     */
    constructor(value) {
        // Récupération de la valeur du Stat
        this.#value = value;
        this.#translatedNames = {};
    }

    /**
     * Récupération des informations concernant l'objet Stat depuis l'API
     * @param {String} name 
     */
    async fetch(name) {
        const json = await pokeFetch(`stat/${name}/`);
        // Récupération du nom du stat dans le bon langage
        json.names.filter(name => name != null).forEach((name, index) => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
                // On supprime les informations inutiles
                delete name.language.name;
            } else {
                delete json.names[index]; // Optimisation du cache
            }
        })

        // Sauvegarde de l'utile dans le cache
        Object.keys(json).filter(key => key !== "names").forEach(key => {
            delete json[key];
        });
        pokeCache(`stat/${name}/`, json);
    }

    /**
     * @returns {string} Valeur du Stat
     */
    get value() {
        return this.#value;
    }

    /**
     * Renvoie l'objet contenant les noms traduits de la stat
     * 
     * Cela est stocké sous la forme :
     * languageId => traduction
     * 
     * @see {@link Language}
     * 
     * @returns {Object} Noms traduits de la stat
     */
    get translatedNames() {
        return this.#translatedNames;
    }



}
export default Stat;