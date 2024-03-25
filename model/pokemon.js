import Type from "./type.js";
import Ability from "./ability.js";
import Stat from "./stat.js";

class Pokemon{

    /***
     * Nom du pokémon
     * @type {string}
     */
    #name; 

    /**
     * Nom traduit du pokémon
     * @type {string}
     */
    #translatedNames;
    
    /**
     * Id du pokemon
     * @type {Number}
     */
    #id;

    /**
     * Hauteur en cm
     * @type {Number}
     */
    #height;

    /**
     * Stats du pokemon
     * @type {Array}
     * @see fetch
     */
    #stats;

    /**
     * URL de l'audio .ogg
     * @type {String}
     */
    #cry;

    /**
     * Types du pokémon
     * @type {Array}
     * @see fetch
     */
    #types;

    /**
     * Abilitées du pokémon
     * @type {Array}
     * @see fetch
     */
    #abilities;

    /**
     * Sprites du pokémon
     * @type {Object}
     * @see fetch
     */
    #sprites;

    /**
     * Booléen pour savoir si le pokémon est favoris
     * @type {Boolean}
     */
    #isFavorite;


    /**
     * @param {number} id 
     * @param {string} nomPokemon
     */
    constructor(id){
        this.#id = id;
        this.#translatedNames = {};
    }

    async fetch() {
        const json = await pokeFetch(`pokemon/${this.#id}/`);
        const jsonSpecies = await pokeFetch(`pokemon-species/${this.#id}/`);

        // Récupération du nom du pokémon
        this.#name = json.name;

        // Récupération des noms traduits du pokémon
        jsonSpecies.names.filter(name => name != null).forEach((name, index) => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
            } else {
                delete jsonSpecies.names[index]; // Optimisation du cache
            }
        });
        Object.keys(jsonSpecies).filter(key => key !== "names").forEach(key => {
            delete jsonSpecies[key];
        });
        pokeCache(`pokemon-species/${this.#id}/`, jsonSpecies);

        //Récupération de la taille du pokémon
        this.#height = json.height * 10; // Hauteur en décimètre de base
        //Récupération des cries
        this.#cry = json.cries.latest;
        //Récupération des sprites
        // Lien statique, pas d'image de dos après le 898ème pokémon
        this.#sprites = {
            "back": this.#id <= 898 
                                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${this.#id}.png` 
                                : null,
            "front": `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.#id}.png`
        };
        Object.keys(json.sprites).filter(key => !["back_default", "front_default"].includes(key)).forEach(key => {
            delete json.sprites[key];
        });

        // Récupération du/des types du pokemon dans le JSON puis sa création en Object de type Type 
        this.#types = [];
        json.types.forEach(type => {
            delete type.type.url;
            const typeObject = new Type(type.type.name);
            this.#types.push(typeObject);
        })

        // Récupération du/des stats du pokemon dans le JSON puis sa création en Object de type Stat
        this.#stats = [];
        await Promise.all(json.stats.map(async stat => {
            delete stat.stat.url;
            delete stat.effort;
            const statObject = new Stat(stat.base_stat);
            await statObject.fetch(stat.stat.name);
            this.#stats.push(statObject); 
        }));

        // Récupération du/des abilitées du pokemon dans le JSON puis sa création en Object de type Ability
        this.#abilities = [];
        await Promise.all(json.abilities.map(async ability => {
            delete ability.ability.url;
            delete ability.is_hidden;
            delete ability.slot;
            const abilityObject = new Ability(ability.ability.name);
            await abilityObject.fetch();
            this.#abilities.push(abilityObject);
        }));

        const usedKeys = ["height", "cries", "types", "stats", "abilities"];
        Object.keys(json).filter(key => !usedKeys.includes(key)).forEach(key => {
            delete json[key];
        });
        pokeCache(`pokemon/${this.#id}/`, json);
    }

    /**
     * @returns {string} Lien de l'image du pokémon
     */
    get imageLink() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.#id}.png`;
    }

    /**
     * @returns {string} Nom du pokémon
     */
    get name() {
        return this.#name;
    }

    /**
     * @returns {number} Id du pokémon
     */
    get id() {
        return this.#id;
    }

    get isFavorite() {
        return this.#isFavorite;
    }

    set isFavorite(value) {
        this.#isFavorite = value;
    }

    /**
     * @returns {Array} Liste des stats du pokémon
     */
    get stats(){
        return this.#stats;  
    }
    /**
     * @returns {Object} Sprites du pokémon
     */
    get sprites() {
        return this.#sprites;
    }

    /**
     * @returns {Object} Noms traduits du pokémon
     */
    get translatedNames() {
        return this.#translatedNames;
    }

    /**
     * @returns {Array} Liste des types du pokémon
     */
    get types() {
        return this.#types;
    }

    /**
     * @returns {Array} Liste des abilities
     */
    get abilities(){
        return this.#abilities;
    }

    /**
     * @return {string} URL de l'audio .ogg
     */
    get cry(){
        return this.#cry;
    }

}

export default Pokemon;