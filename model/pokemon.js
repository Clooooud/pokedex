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
    constructor(id, name){
        this.#id = id;
        this.#name = name;
        this.#translatedNames = {};
    }

    async fetch() {
        const json = await pokeFetch(`https://pokeapi.co/api/v2/pokemon/${this.#id}/`);
        const jsonSpecies = await pokeFetch(`https://pokeapi.co/api/v2/pokemon-species/${this.#id}/`);

        jsonSpecies.names.forEach(name => {
            const language = window.languages.find(language => language.getLanguageRegex().test(name.language.url));
            if (language) {
                this.#translatedNames[language.id] = name.name;
            }
        });
        //Récupération de la taille du pokémon
        this.#height = json.height * 10; // Hauteur en décimètre de base
        //Récupération des cries
        this.#cry = json.cries.latest;
        //Récupération des sprites
        this.#sprites = {
            "back": json.sprites.back_default,
            "front": json.sprites.front_default
        };

        // Récupération du/des types du pokemon dans le JSON puis sa création en Object de type Type 
        this.#types = [];
        json.types.forEach(type => {
            const typeObject = new Type(type.type.name);
            this.#types.push(typeObject);
        })

        // Récupération du/des stats du pokemon dans le JSON puis sa création en Object de type Stat
        this.#stats = [];
        await Promise.all(json.stats.map(async stat => {
            const statObject = new Stat(stat.base_stat);
            await statObject.fetch(stat.stat.name);
            this.#stats.push(statObject); 
        }));

        // Récupération du/des abilitées du pokemon dans le JSON puis sa création en Object de type Ability
        this.#abilities = [];
        await Promise.all(json.abilities.map(async ability => {
            const abilityObject = new Ability(ability.ability.name);
            await abilityObject.fetch();
            this.#abilities.push(abilityObject);
        }));
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