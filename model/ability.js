class Ability{

    /**
     * Nom de l'Abilité
     * @type {string}
     */
    #name

    /**
     * 
     * @type {string}
     */
    #description

    /**
     * @param {string} name 
     */
    constructor(name){
        this.#name = name;
    }

    async fetch(){
        const json = await pokeFetch(`https://pokeapi.co/api/v2/ability/${this.#name}/`);
        
        // Récupération du nom de l'abilitées dans le bon langage
        this.#name = json.names[7].name;
        // Récupération de la description de l'abilitées
        // Format du lien : https://pokeapi.co/api/v2/language/6/
        // On voudrait le '6' ici par exemple.
        this.#description = json.flavor_text_entries.find(entry => {
            // Important de le définir dans la fonction pour éviter des erreurs
            // car RegExp est horriblement mal fait ???
            const regex = /language\/(\d+)\//g; // On récupère le numéro de la langue dans le lien
            const result = regex.exec(entry.language.url);
            return result[1] === '9';
        }).flavor_text;
    }    
    
    /**
     * @returns {string} Nom de l'abilité
     */
    get name(){
        return this.#name;
    }
    /**
     * @returns {string} Description de l'abilitées du pokémon
     */
    get description(){
        return this.#description;
    }
}
export default Ability;