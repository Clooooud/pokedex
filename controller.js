import Pokedex from "./model/pokedex.js";
import view from "./view.js";
import Language from "./model/language.js";
import Pokemon from "./model/pokemon.js";

class Controller {

    /**
     * Pokedex
     * @type {Pokedex}
     */
    #pokedex;

    /**
     * Liste des langages
     * @type {Array}
     */
    #languages;

    /**
     * Index du langage actuel
     * @type {Number}
     * @see #languages
     */
    #language;

    constructor() {
        this.#pokedex = new Pokedex();
        this.#languages = [];
        this.#languages.push(new Language(9, "English", "🇺🇸"), new Language(5, "Français", "🇫🇷"));
        this.#language = 0;

        window.languages = this.#languages;
        window.language = this.#languages[this.#language];
    }

    /**
     * Initialise le contrôleur
     */
    init() {
        this.#listenEvents();
        this.#load();
    }

    /**
     * Met à jour l'affichage du compteur de page
     */
    #updatePageDisplay() {
        view.pageDisplay.innerHTML = `${this.#pokedex.page + 1}/${this.#pokedex.getPageMax() + 1}`;
    }

    /**
     * Ecoute les évènements de l'interface
     */
    #listenEvents() {
        view.closeSearchButton.addEventListener("click", () => this.#clearSearch());

        view.searchButton.addEventListener("click", () => this.#search());

        view.flagButton.addEventListener("click", () => this.#toggleLanguage());
        view.previousButton.addEventListener("click", () => this.#changePage(-1));
        view.nextButton.addEventListener("click", () => this.#changePage(1));

        view.favoriteCategoryButton.addEventListener("click", () => this.#goToFavorites());
        view.mainCategoryButton.addEventListener("click", () => this.#goToMainMenu());

        view.favoriteButton.addEventListener("click", () => this.#toggleFavorite());

        for (let buttonId = 0; buttonId < view.keyboard.children.length; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.addEventListener("click", () => this.#selectPokemon(buttonId));
        }
    }

    /**
     * Efface la recherche en cours
     */
    #clearSearch() {
        view.searchInput.value = "";
        this.#pokedex.search(null);
        this.#updatePageDisplay();
        this.#updateList();
    }

    /**
     * Recherche un pokémon en fonction de la valeur de l'input de recherche
     */
    #search() {
        this.#pokedex.search(view.searchInput.value);
        this.#updatePageDisplay();
        this.#updateList();
    }
    
    /**
     * Change la page du pokédex en fonction d'un décalage, positif ou négatif
     * @param {Number} offset 
     */
    #changePage(offset) {
        this.#pokedex.changePage(offset);
        this.#updatePageDisplay();
        this.#updateList();
    }

    /**
     * Sélectionne un pokémon en le récupérant depuis la liste des pokémons affichés avec l'id du bouton de la liste de pokémon
     * @param {Number} buttonId 
     */
    #selectPokemon(buttonId) {
        const pokemon = this.#pokedex.getPokemonsOnPage()[buttonId];

        if (pokemon === undefined) {
            return;
        }

        if (this.#pokedex.selection !== pokemon.id) {
            this.#pokedex.select(pokemon);
        } else {
            this.#pokedex.select(null);
        }

        this.#updateList();
        this.#updateScreen();
    }

    #goTo(button) {
        const toggled = document.querySelector("#category-div .toggled");

        if (toggled === button) {
            return;
        }    

        toggled?.classList.remove("toggled");
        button.classList.add("toggled");
        this.#pokedex.cycleCategories();
        this.#updatePageDisplay();
        this.#updateList();
    }

    /**
     * Change la catégorie pour les favoris
     */
    #goToFavorites() {
        this.#goTo(view.favoriteCategoryButton);
    }

    /**
     * Change la catégorie pour tous les pokémons
     */
    #goToMainMenu() {
        this.#goTo(view.mainCategoryButton);
    }

    /**
     * Ajoute ou retire un pokémon des favoris
     */
    #toggleFavorite() {
        if (this.#pokedex.selection === null) {
            return;
        }

        if (this.#pokedex.isFavorite(this.#pokedex.selection)) {
            this.#pokedex.removeFavorite(this.#pokedex.selection);
            if (this.#pokedex.category === "favorite") {
                this.#selectPokemon(this.#pokedex.selection);
            }
        } else {
            this.#pokedex.addFavorite(this.#pokedex.selection);
        }

        this.#updateList();
        this.#updateScreen();
    }

    /**
     * Charge les données du pokédex
     */
    async #load() {
        await this.#pokedex.fetchPokemons();
        this.#pokedex.loadFavorites();
        this.#updateList();
    }

    /**
     * Met à jour la liste des pokémons affichés
     */
    #updateList() {
        const pokemonsOnPage = this.#pokedex.getPokemonsOnPage();
        for (let buttonId = 0; buttonId < 20; buttonId++) {
            const button = view.keyboard.children[buttonId];
            button.innerHTML = "";
            button.classList.remove("selected");

            if (buttonId >= pokemonsOnPage.length) {
                continue;
            }
            
            const img = document.createElement("img");
            img.src = pokemonsOnPage[buttonId].imageLink;

            if (this.#pokedex.selection === pokemonsOnPage[buttonId].id) {
                button.classList.add("selected");
            }

            button.append(img);
        }
    }

    /**
     * Change la langue du pokédex
     */
    #toggleLanguage() {
        this.#language = (this.#language+1) % this.#languages.length
        window.language = this.#languages[this.#language];

        view.flagButton.innerHTML = window.language.flag;
        this.#updateScreen();
    }

    /**
     * Met à jour l'écran de détails du pokémon
     */
    async #updateScreen(){
        if (this.#pokedex.selection === null) {
            view.screen.innerHTML = "";
            view.idScreen.innerHTML = "";
            view.favoriteButton.classList.remove("toggled");
            view.favoriteButton.innerHTML = "♡";
            return;
        }

        const pokemon = this.#pokedex.getPokemon(this.#pokedex.selection);
        await pokemon.fetch();

        view.screen.innerHTML = "";

        view.idScreen.innerHTML = "N°" + this.#pokedex.selection;
        view.favoriteButton.innerHTML = this.#pokedex.isFavorite(this.#pokedex.selection) ? "❤️" : "♡";

        let div = document.createElement("div");
        div.id = "screen-content";
        // Nom du Pokémon
        let namePokemon = document.createElement("h1");
        namePokemon.innerHTML = pokemon.translatedNames[window.language.id];

        // Types du Pokémon
        let divTypes = document.createElement("div");
        divTypes.id = "screen-types-div";
        pokemon.types.forEach(type =>{
            let imageType = document.createElement("img");
            imageType.src = type.imageLink;
            divTypes.append(imageType);
        });
        namePokemon.append(divTypes);

        div.append(namePokemon);

        // Sprites du Pokémon
        let divImages = document.createElement("div");
        divImages.id = "screen-sprites-div"
        
        let image1 = document.createElement("img");
        image1.src = pokemon.sprites.front; 
        divImages.append(image1);
        
        if (pokemon.sprites.back !== null) { // Certains pokémons n'ont pas de sprite de dos
            let image2 = document.createElement("img");
            image2.src = pokemon.sprites.back;
            divImages.append(image2);
        }

        div.append(divImages);
        div.append(document.createElement("hr"));

        // Ablility du Pokemon
        let divAbilities = document.createElement("div");
        let titleAbilities = document.createElement("h2");
        titleAbilities.innerHTML = window.language.name == "English" ? "Abilities" : "Talents";
        divAbilities.append(titleAbilities);

        pokemon.abilities.forEach(ability=>{
            let pAbility = document.createElement("p");
            pAbility.innerHTML = ability.translatedNames[window.language.id] + " : " + ability.descriptions[window.language.id];
            divAbilities.append(pAbility);
        });
        div.append(divAbilities);
        div.append(document.createElement("hr"));

        // Stats du Pokémon 
        let divStat = document.createElement("div");
        divStat.id = "screen-stats-div";

        let titleStats = document.createElement("h2");
        titleStats.innerHTML = "Stats";
        divStat.append(titleStats);

        pokemon.stats.forEach(stat =>{
            let lineDiv = document.createElement("div");

            let pStat = document.createElement("p");
            pStat.innerHTML = stat.translatedNames[window.language.id] + ` (${stat.value})`;

            let statBar = document.createElement("div");
            statBar.classList.add("stat-bar");
            statBar.style.width = stat.value + "px";

            lineDiv.append(pStat);
            lineDiv.append(statBar);
            divStat.append(lineDiv);
        });
        div.append(divStat);

        let cry = document.createElement("button");
        cry.classList.add("button");
        cry.innerHTML = "🔊";
        cry.id = "sound-button";
        cry.addEventListener("click", () => this.#playSound(pokemon));
        div.append(cry); 

        view.screen.append(div);
    }

    /**
     * Joue le crie du pokémon
     * @param {Pokemon} pokemon 
     */
    #playSound(pokemon){
        const audio = new Audio(pokemon.cry);
        audio.volume = 0.15;
        audio.play();
    }

}

/**
 * Récupère les données de l'API et les stocke dans le localStorage
 * Différence avec le fetch classique : on récupère directement le contenu sous format json
 * 
 * On stocke le json avec pour clé l'url de la requête, on peut donc retrouver très facilement les données
 * 
 * On a retiré la partie commune de l'URL : "https://pokeapi.co/api/v2/"
 * Cela optimise le stockage des données, car on ne stocke pas l'url en boucle
 * 
 * @param {String} url 
 * @returns {Object}
 */
window.pokeFetch = async (url) => {
    const item = localStorage.getItem(url);
    if (item){
        return JSON.parse(item);
    }

    const result = await fetch("https://pokeapi.co/api/v2/" + url).then(response => response.json());
    // On peut pas se permettre de tout stocker parce que le local storage a une limite de 5Mo
    // localStorage.setItem(url, JSON.stringify(result));
    return result;
}

/**
 * On sauvegarde les données dans le localStorage
 * 
 * Ce qui est important est de filtrer les données, on ne veut pas stocker des données inutiles
 * Auparavant, on ne faisait pas la différence entre les données, et on pouvait toucher la limite de certains navigateurs.
 * Le filtrage est à réaliser avant d'appeler cette fonction !!
 * 
 * @param {String} url 
 * @param {String} data 
 */
window.pokeCache = (url, data) => {
    localStorage.setItem(url, JSON.stringify(data));
};

new Controller().init();