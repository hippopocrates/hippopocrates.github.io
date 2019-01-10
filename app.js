$(() => {

const playerOrder = [];
const cardOrder = ['ACE', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING']; //value
let currentPosition = 0;
const discardPile = [];

class User {
  constructor() {
    this.deckSize = 18;
    this.deck = [];
    this.isLying = false;
    this.turn = false;
  }
}

class Opponent {
  constructor(){
    this.deckSize = 17;
    this.deck = [];
    this.isLying = false;
    this.turn = false;

  }
}
const user = new User();
const opponent1 = new Opponent();
const opponent2 = new Opponent();

$.ajax({
  url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=52',
  success: (data) => {
    console.log(data);
    buildPlayerDeck(data);
    gamePlay(playerOrder);
  },
  error: () => {
    console.log('bad request');
  }
})

const buildPlayerDeck = (data) => {
  for (let i = 0; i < 18; i++){
    user.deck.push(data.cards[i]);
    if (data.cards[i].code === 'AS') {
      playerOrder.push(user, opponent1, opponent2);
    }
  }
  for (let i = 18; i < 35; i++){
    opponent1.deck.push(data.cards[i]);
    if (data.cards[i].code === 'AS') {
      playerOrder.push(opponent1, opponent2, user);
    }
  }
  for (let i = 35; i < 52; i++){
     opponent2.deck.push(data.cards[i]);
     if (data.cards[i].code === 'AS') {
       playerOrder.push(opponent2, user, opponent1);
     }
  }
}

const cardOrderPosition = () => {
    return cardOrder[currentPosition++];
}

const discard = (player, card) => {
  for (let i = 0; i < player.deckSize; i++){
    if (player.deck[i].value === card){
      
    }
  }
}

const gamePlay = (playerOrderArr) => {
  console.log(playerOrderArr);
  for (let i = 0; i < playerOrderArr.length; i++){
    discard(playerOrderArr[i], cardOrderPosition());
  }
}










})
