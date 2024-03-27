import './index.css';
import './'

function createCard({id, className, image}) {

    return {
        id: id,
        image: image,
        className: className,
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function AlphabetGenerator() {
    this.startCharCode = 'A'.charCodeAt(0);
    this.endCharCode = 'D'.charCodeAt(0);
    this.currentCharCode = this.startCharCode;
}

AlphabetGenerator.prototype[Symbol.iterator] = function () {
    return {
        next: () => {
            if (this.currentCharCode <= this.endCharCode) {
                return {done: false, value: String.fromCharCode(this.currentCharCode++)};
            } else {
                return {done: true};
            }
        },
    };
};


const GAME_STATE = {

    clicks: 0,
    flipped: [],
    points: 0,
    deck: [],
    $board: null,

    checkFlippedCards: () => {
        if (GAME_STATE.flipped[0].card.image === GAME_STATE.flipped[1].card.image) {
            GAME_STATE.points += 1;
            //point animation
        } else {
            GAME_STATE.flipped[0].animation.reverse();
            GAME_STATE.flipped[1].animation.reverse();
        }

        GAME_STATE.flipped = [];
        GAME_STATE.updateUI(GAME_STATE.$ui);
    },

    makeCard: ({image, id, className}) => {

        let $div = document.createElement('div'),
            $image = document.createElement('div'),
            $back = document.createElement("div"),
            $content = document.createElement("div");

        $content.classList.add("content");
        $content.dataset.id = id;
        $div.classList.add('card');
        $image.classList.add('front');
        $back.classList.add('back')


        $content.appendChild($image);
        $content.appendChild($back);

        $image.classList.add(className);
        //$image.style.backgroundImage = `url(${image})`;
        //$image.innerText = image;

        $div.appendChild($content);
        return $div;
    },

    addCardEvents: ($card) => {

        $card.addEventListener("click", (e) => {
            console.info('CLICKS')
            const $cardContentWrapper = e.target.parentElement;
            const animation = $cardContentWrapper.animate([{
                transform: "rotateY(180deg)",
                "animation-fill-mode": "forwards"
            }], {
                duration: 300,
                iterations: 1,
                fill: "forwards"
            });
            animation.play();

            const cardObj =
                GAME_STATE.deck.find((obj) => obj.id == $cardContentWrapper.dataset.id);


            GAME_STATE.clicks += 1;
            GAME_STATE.flipped.push({card: cardObj, animation: animation});
            if (GAME_STATE.flipped.length === 2) {
                setTimeout(() => {
                    GAME_STATE.checkFlippedCards();
                }, 333)
            }


        });

        $card.addEventListener("mouseout", (e) => {
            e.stopPropagation()
        })

        $card.addEventListener("mouseover", (e) => {
            e.stopPropagation();
        })
    },

    updateUI: ($ui) => {

        $ui.querySelector('#points').innerText = GAME_STATE.points;
        $ui.querySelector('#clicks').innerText = GAME_STATE.clicks;
        //$ui.innerText = "Pontos: " + GAME_STATE.points + " clicks: " + GAME_STATE.clicks;

    },

    start: ($board, $ui, deck) => {
        deck.forEach((card, index) => {
            const $card = GAME_STATE.makeCard(card);
            GAME_STATE.addCardEvents($card);

            $board.appendChild($card)
        });


        GAME_STATE.$board = $board;
        GAME_STATE.clicks = 0;
        GAME_STATE.flipped = [];
        GAME_STATE.deck = deck;
        GAME_STATE.points = 0;
        GAME_STATE.$ui = $ui;
        GAME_STATE.updateUI(GAME_STATE.$ui);
    }


}

document.addEventListener("DOMContentLoaded", (e) => {

    const $board = document.getElementById("board"),
        $ui = document.getElementById('UI');

    let deck = [];

    // Example usage:
    const alphabet = new AlphabetGenerator();

    let id = 0;
    for (let i = 0; i < 12; i++) {
        deck.push(createCard({id: id, className: `card-${i}`, image: i}))
        id++;
        deck.push(createCard({id: id, className: `card-${i}`, image: i}));
        id++;
    }

    deck = shuffle(deck);

    GAME_STATE.start($board, $ui, deck);


});
