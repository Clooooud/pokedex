class Ability{

    /**
     * Nom de l'Abilité
     * @type {string}
     */
    #name

    /**
     * Noms traduits de l'abilité
     * @type {Object}
     */
    #translatedNames

    /**
     * Descriptions traduits de l'abilité
     * @type {Object}
     */
    #descriptions

    /**
     * @param {string} name 
     */
    constructor(name){
        this.#name = name;
        this.#translatedNames = {};
        this.#descriptions = {};
    }

    async fetch(){
        const json = await pokeFetch(`https://pokeapi.co/api/v2/ability/${this.#name}/`);
        
        // Récupération du nom de l'abilitées dans le bon langage
        json.names.forEach(name => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
            }
        })

        // Récupération de la description de l'abilitées
        // Format du lien : https://pokeapi.co/api/v2/language/6/
        // On voudrait le '6' ici par exemple.
        json.flavor_text_entries.forEach(entry => {
            const language = window.languages.find(language => language.getLanguageRegex().test(entry.language.url));
            if (language) {
                this.#descriptions[language.id] = entry.flavor_text;
            }
        })
    }    
    
    /**
     * @returns {string} Nom de l'abilité
     */
    get name(){
        return this.#name;
    }
    /**
     * @returns {Object} Descriptions de l'abilitées du pokémon
     */
    get descriptions(){
        return this.#descriptions;
    }

    get translatedNames() {
        return this.#translatedNames;
    }
}
export default Ability;