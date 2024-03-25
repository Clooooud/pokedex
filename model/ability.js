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

    /**
     * Récupération des informations concernant l'objet Ability depuis l'API
     */
    async fetch(){
        const json = await pokeFetch(`ability/${this.#name}/`);

        // Récupération du nom de l'abilitées dans le bon langage
        json.names.filter(name => name != null).forEach((name, index) => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
                delete name.language.name;
            } else {
                delete json.names[index]; // Optimisation du cache
            }
        })


        // L'API nous renvoie plusieurs descriptions selon la langue et la version du jeu
        // Généralement, les descriptions sont les mêmes, donc on se permet de ne garder que le premier dans le cache
        const alreadySeenLanguages = [];

        // Récupération de la description de l'abilitées
        // Format du lien : https://pokeapi.co/api/v2/language/6/
        // On voudrait le '6' ici par exemple.
        json.flavor_text_entries.filter(entry => entry != null).forEach((entry, index) => {
            const language = window.languages.find(language => language.getLanguageRegex().test(entry.language.url));
            if (language && !alreadySeenLanguages.includes(language.id)) {
                this.#descriptions[language.id] = entry.flavor_text;
                alreadySeenLanguages.push(language.id);

                delete entry.version_group;
                delete entry.language.name;
            } else {
                delete json.flavor_text_entries[index];
            }
        })

        // Sauvegarde de l'utile dans le cache
        Object.keys(json).filter(key => !["names", "flavor_text_entries"].includes(key)).forEach(key => {
            delete json[key];
        });
        pokeCache(`ability/${this.#name}/`, json);
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