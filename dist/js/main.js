// ************* MAIN *************** //

// DOM
const $homescreen  =  document.querySelector(".homescreen");
const $form        =  document.querySelector("form");
const $card        =  document.querySelector(".player-card")

//INITIATION FUNCTIONS

// Character constructor
function Char() {

    this.nome = undefined,
    this.profissao = undefined,
    this.nivel = 1,
    this.atributos = [0, 0, 0, 0], //[str, dex, int, cha]  
    this.armaCC = 0,
    this.armaLD = 0,
    this.armadura = 0,
    this.escudo = 0,
    this.health = 0

};

function updatedb(char) {
    localStorage.setItem("player", JSON.stringify(char));
}

let char = {};

// *************** HOMESCREEN *************** //

// DOM
const $createBtn   =  $homescreen.querySelector(".create");
const $loadBtn     =  $homescreen.querySelector(".load");

// Event Listeners
$createBtn.addEventListener("click", () => {

    $homescreen.classList.toggle("hide");
    $form.classList.toggle("hide");

})

$loadBtn.addEventListener("click", () => {

    if (db.getItem("player")) {

        char = JSON.parse(db.getItem("player"));
    
        $homescreen.classList.toggle("hide");
        $card.classList.toggle("hide");
    
        getFrontValues();
        getBackValues();

    }

    else {

        alert("You don't have a character saved yet ;-;");

    }


})



// ****************** FORM ****************** //

//DOM
const $profession    =  $form.querySelector(".profession").querySelector("input")
const $advantage     =  $form.querySelector(".advantage").querySelectorAll("input")
const $disadvantage  =  $form.querySelector(".disadvantage").querySelectorAll("input")
const $meleeWeapon   =  $form.querySelector(".melee-weapon").querySelector("select")
const $rangeWeapon   =  $form.querySelector(".range-weapon").querySelector("select")
const $armor         =  $form.querySelector(".armor").querySelector("select")
const $shield        =  $form.querySelector(".shield").querySelector("input")
const $characterName =  $form.querySelector(".name").querySelector("input")
const $level =  $form.querySelector(".level").querySelector("select")
const db             =  localStorage;

// Event Listeners
$form.addEventListener("submit", (e) => {

    e.preventDefault();

    let newChar = new Char();

    newChar.profissao = $profession.value;
    newChar.armaCC    = parseInt($meleeWeapon.value);
    newChar.armaLD    = parseInt($rangeWeapon.value);
    newChar.armadura  = parseInt($armor.value);
    newChar.escudo    = $shield.checked;
    newChar.nome      = $characterName.value;
    newChar.nivel     = parseInt($level.value);
    getAttributes(newChar);
    newChar.health    = newChar.nivel + newChar.atributos[0] + 3;

    if (newChar.escudo == true) { newChar.escudo = 2 }
    else { newChar.escudo = 0};

    updatedb(newChar);
    char = JSON.parse(db.getItem("player"));

    getFrontValues();
    getBackValues();

    //change pages
    $form.classList.toggle("hide");
    $card.classList.toggle("hide");

})

$form.querySelector(".help").addEventListener("click", () => { alert("Not Working YET ;-;") });

// Functions
function getAttributes(char) {
    $advantage.forEach(( atribute, index ) => {
        if(atribute.checked) {
            char.atributos[index] = Math.ceil(char.nivel/2);
        }
    })

    $disadvantage.forEach(( atribute, index ) => {
        if(atribute.checked) {
            char.atributos[index] = -2;
        }
    })
}



// ****************** CARD ****************** //

// DOM
const $cardFront = $card.querySelector(".card-front");
const $cardLevel = $cardFront.querySelector(".level");
const $cardProfession = $cardFront.querySelector(".profession");
const $cardStats = $cardFront.querySelectorAll(".stat");

const $cardBack = $card.querySelector(".card-back");
const editButton = $cardBack.querySelector("button");

// Event Listeners
$card.addEventListener("click", (e) => {

    if(e.target != $cardFront.querySelector(".heal") && e.target != $cardFront.querySelector(".damage") ) {

        $cardFront.classList.toggle("rotate-front");
        $cardBack.classList.toggle("rotate-back");

    }
})

editButton.addEventListener("click", () => {

    $form.classList.toggle("hide");
    $card.classList.toggle("hide");

})

function getFrontValues() {

    //header
    $cardFront.querySelector(".level").textContent = char.nivel;
    $cardFront.querySelector(".profession").textContent = char.profissao;

    

    //stats
    $cardStats.forEach( (stat, i) => {

        switch (i) {
            case 0:
                stat.querySelector(".value").textContent = `${signal(char.armaCC + char.atributos[i])}${char.armaCC + char.atributos[i]}`;
                break;
            case 1:
                stat.querySelector(".value").textContent = `${signal(char.armaLD + char.atributos[i])}${char.armaLD + char.atributos[i]}`;
                break;
            case 2:
                stat.querySelector(".value").textContent = `${signal(char.armadura + char.atributos[1])}${char.armadura + char.atributos[1] + char.escudo}`;
                break;
            default:
                console.log("erro");
        }
    
    } ); 

     getBottomAttribute(); 
     getCover(); 
     healthSlide();
     getCardColor();

}

function getBackValues() {

    const stats = $cardBack.querySelectorAll(".stat")

    stats.forEach((stat, index) => {
        stat.querySelector(".value").textContent = signal(char.atributos[index])+char.atributos[index];

    })

    getWeapon();

    setShield();

}

function signal(value) {
    if (value >= 0) { return "+" }
    else { return "" };
 }

 function setShield() {

    if (char.escudo == 0) {
        $cardBack.querySelector(".shield").classList.add("hide");
    }

 }

function getWeapon() {

    $meleeWeapon.querySelectorAll("option").forEach((weapon => {

        if (weapon.selected) {
            $cardBack.querySelector(".melee-weapon").querySelector(".type").textContent = weapon.textContent;
        };
    }))

    $rangeWeapon.querySelectorAll("option").forEach((weapon => {

        if (weapon.selected) {
            $cardBack.querySelector(".range-weapon").querySelector(".type").textContent = weapon.textContent;
        };
    }))

    $armor.querySelectorAll("option").forEach((armor => {

        if (armor.selected) {
            $cardBack.querySelector(".armor").querySelector(".type").textContent = armor.textContent;
        };
    }))

}

function getBottomAttribute(attribute) {


    char.atributos.forEach( (att, index) => {

        if (att > 0) {
            switch (index) {
                case 0:
                    $cardFront.querySelector(".advantage").textContent = `STR +${att}`;
                    break;
                case 1:
                    $cardFront.querySelector(".advantage").textContent = `DEX +${att}`;
                    break;
                case 2:
                    $cardFront.querySelector(".advantage").textContent = `INT +${att}`;
                    break;
                case 3:
                    $cardFront.querySelector(".advantage").textContent = `CHA +${att}`;
                    break;
                default:
                $cardFront.querySelector(".advantage").textContent = "";
            };

        }
        else if( att < 0 ) {

            switch (index) {
                case 0:
                    $cardFront.querySelector(".disadvantage").textContent = `STR ${att}`;
                    break;
                case 1:
                    $cardFront.querySelector(".disadvantage").textContent = `DEX ${att}`;
                    break;
                case 2:
                    $cardFront.querySelector(".disadvantage").textContent = `INT ${att}`;
                    break;
                case 3:
                    $cardFront.querySelector(".disadvantage").textContent = `CHA ${att}`;
                    break;
                default:
                    console.log("advantage error")
            };

        }

    } );

};

function getCover() {

    let reset = $cardFront.querySelector(".cover").querySelectorAll("div");

    reset.forEach((div) => {

        div.parentElement.removeChild(div);

    })

    for (let i = 0; i < char.health; i++) {

        let div = document.createElement("div")
        $cardFront.querySelector(".cover").appendChild(div);

    }
}

function healthSlide() {

    let heal = $cardFront.querySelector(".heal");
    let damage = $cardFront.querySelector(".damage");
    const healthBar = $cardFront.querySelector(".content");
    let numOnly = /[-\+]?[0-9]*\.?[0-9]+/;

    heal.addEventListener("click", () => {

        let currentTranslate = healthBar.style.transform.match(numOnly);

        toMove = parseFloat(currentTranslate[0]) + 100/char.health;

        if(toMove <= 0) {

            healthBar.style.transform = `translateX(${toMove}%)`

        };
        if (toMove > 0) {

            healthBar.style.transform = `translateX(0%)`

        }

    })

    damage.addEventListener("click", () => {

        let currentTranslate = healthBar.style.transform.match(numOnly);

        toMove = parseFloat(currentTranslate[0]) - 100/char.health;

        if (toMove >= -100) {

            healthBar.style.transform = `translateX(${toMove}%)`

        }

        if (toMove < -100) {

            healthBar.style.transform = `translateX(-100%)`

        }
    })
}

function getCardColor() {

    char.atributos.forEach( (att, index) => {

        if (att > 0) {
            switch (index) {
                case 0:
                    $cardFront.querySelector(".stats").style.backgroundColor = `darkred`;
                    $cardBack.querySelector("button").style.backgroundColor = `darkred`;
                    break;
                case 1:
                    $cardFront.querySelector(".stats").style.backgroundColor = `darkgreen`;
                    $cardBack.querySelector("button").style.backgroundColor = `darkgreen`;
                    break;
                case 2:
                    $cardFront.querySelector(".stats").style.backgroundColor = `darkblue`;
                    $cardBack.querySelector("button").style.backgroundColor = `darkblue`;
                    break;
                case 3:
                    $cardFront.querySelector(".stats").style.backgroundColor = `darkgoldenrod`;
                    $cardBack.querySelector("button").style.backgroundColor = `darkgoldenrod`;
                    break;
                default:
                    console.log("advantage error")
            };

        }
    })

}

