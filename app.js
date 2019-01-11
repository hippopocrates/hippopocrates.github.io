$(() => {

let userTurn = true;
const cardOrder = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'] //value
let currentPosition = 0
const discardPile = []

class Player {
  constructor(name, size) {
    this.name = name;
    this.deckSize = size
    this.deck = []
    this.images = []
    this.isLying = false
  }
}

const user = new Player('You', 18)
const opponent1 = new Player('Opponent 1', 17)
const opponent2 = new Player('Opponent 2',17)
const playerOrder = [user, opponent1, opponent2]

$.ajax({
  url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=52',
  success: (data) => {
    buildPlayerDeck(data)
    gameStart()
    oneRound(playerOrder)
  },
  error: () => {
    console.log('bad request')
  }
})

const buildPlayerDeck = data => {
  for (let i = 0; i < 18; i++){
    user.deck.push(data.cards[i])
    $('#cardDiv').append($('<img>').attr('src', data.cards[i].image))
  }
  for (let i = 18; i < 35; i++){
    opponent1.deck.push(data.cards[i])
    $('#opponent1').append($('<img>').attr('src', 'playing-card-back.jpg').addClass('cardBackEnemy1'))
  }
  for (let i = 35; i < 52; i++){
     opponent2.deck.push(data.cards[i])
     $('#opponent2').append($('<img>').attr('src', 'playing-card-back.jpg').addClass('cardBackEnemy2'))

  }
}

const cardOrderPosition = () => cardOrder[currentPosition++]

const discard = (player, card) => {
  for (let i = 0; i < player.deckSize; i++){
    if (player.deck[i].value === card){
      discardPile.push(player.deck.splice(i, 1))
      player.deckSize--
      if (player.name === 'Opponent 1'){
        $('.cardBackEnemy1').first().remove()
      } else if (player.name === 'Opponent 2'){
        $('.cardBackEnemy2').first().remove()
      }
    }
  }
}


const oneRound = playerOrderArr => {
  for (let i = 0; i < playerOrderArr.length; i++){
      discard(playerOrderArr[i], cardOrderPosition())
  }
}










})
