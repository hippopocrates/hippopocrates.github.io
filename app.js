$(() => {

const cardOrder = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'] //value
let currentPosition = 0
const discardPile = []
let bullshitCalled = false

class Player {
  constructor(name, turn) {
    this.name = name
    this.turn = turn
    this.deck = []
    this.currentRoundDiscard = 0
    this.numCurrentPositionCards = 0
    this.isLying = false
  }
  checkLying(currentPlayer) {
    for (let i = 0; i < this.deck.length; i++){
      if (this.deck[i].value === cardOrderPosition()){
        this.numCurrentPositionCards++
      }
    }
    if ((currentPlayer.currentRoundDiscard + this.numCurrentPositionCards) > 4){
      bullshitCalled = true;
      $('#text-container').append(this.name + ' accuses ' + currentPlayer.name + ' of lying!<br />')
      if (currentPlayer.isLying){
        $('#text-container').append(currentPlayer.name + ' WAS lying!<br />')
          currentPlayer.deck = currentPlayer.deck.concat(discardPile)
          sortDeck(currentPlayer)
          if(currentPlayer === user){
            insertCardImgUser();
          } else {
            insertCardImgOpponents(currentPlayer)
          }
          discardPile.length = 0;
          $('#card-container').empty()
      } else {
        $('#text-container').append(currentPlayer.name + ' was NOT lying!<br />')
        this.deck = this.deck.concat(discardPile)
        sortDeck(this)
        if(currentPlayer === user){
          insertCardImgUser();
        } else {
          insertCardImgOpponents(currentPlayer)
        }
        discardPile.length = 0;
        $('#card-container').empty()
      }
      this.numCurrentPositionCards = 0
    }
    this.numCurrentPositionCards = 0
  }
}

const user = new Player('My girl', true)
const opponent1 = new Player('Opponent-1', false)
const opponent2 = new Player('Opponent-2', false)
const players = [user, opponent1, opponent2]

$.ajax({
  url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=52',
  success: (data) => {
    buildPlayerDeck(data);
  },
  error: () => {
    console.log('bad request');
  }
})

const nonsense = () => {
  console.log('nonsense');
}

const winner = () => {
  for(let i = 0; i < players.length; i++){
    if (players[i].deck.length === 0){
      $('#text-container').append(players[i].name + ' wins!<br />')
      return true
    } else {
      return false
    }
  }
}

const buildPlayerDeck = data => {
  for (let i = 0; i < 18; i++){
    user.deck.push(data.cards[i])
  }
  sortDeck(user)
  insertCardImgUser()

  for (let i = 18; i < 35; i++){
    opponent1.deck.push(data.cards[i])
  }
  sortDeck(opponent1)
  insertCardImgOpponents(opponent1)

  for (let i = 35; i < 52; i++){
     opponent2.deck.push(data.cards[i])
  }
  sortDeck(opponent2)
  insertCardImgOpponents(opponent2)
}

const sortDeck = (player) => {
  let unsortedDeck = player.deck
  let sortedDeck = []
  for (let i = 0; i < cardOrder.length; i++){
    for (let j = 0; j < unsortedDeck.length; j++){
      if (unsortedDeck[j].value === cardOrder[i])
          sortedDeck.push(unsortedDeck[j])
    }
  }
  player.deck = sortedDeck
}

//displays front of card for user only
const insertCardImgUser = () => {
  $('#cardDiv').empty()
  for (let i = 0; i < user.deck.length; i++){
    $playerCardImg = $('<img>').attr({ src:user.deck[i].image, id:user.deck[i].code}).addClass(user.deck[i].value)

    $playerCardImg.on('click', (event) => {
      if(user.turn){
        user.currentRoundDiscard++
        event.target.remove()
        $('#card-container').append($('<img>').attr('src', 'playing-card-back.jpg'))
        if(event.target.className !== cardOrderPosition()){
          user.isLying = true
        }
        for (let i = 0; i < user.deck.length; i++){
          if (event.target.id === user.deck[i].code){
            discardPile.push(user.deck[i])
            user.deck.splice(i, 1)
          }
        }
      }

    })
    $('#cardDiv').append($playerCardImg)
  }
}

const insertCardImgOpponents = (player) => {
  $('#' + player.name).empty()
  for (let i = 0; i < player.deck.length; i++){
    $('#' + player.name).append($('<img>').attr('src', 'playing-card-back.jpg'))
  }
}

const cardOrderPosition = () => {
  if (cardOrder[currentPosition] === undefined){
    currentPosition = 0
  }
  return cardOrder[currentPosition]
}


const opponentDiscard = (player, card) => {
  for (let i = 0; i < player.deck.length; i++){
    if (player.deck[i].value === card){
      discardPile.push(player.deck[i])
      player.deck.splice(i, 1)
      player.currentRoundDiscard++
      $('#' + player.name).children('img').eq(0).remove()
      $('#card-container').append($('<img>').attr('src', 'playing-card-back.jpg'))
    }
  }
  if (player.currentRoundDiscard === 0){
    discardPile.push(player.deck[0])
    player.deck.splice(0, 1)
    player.currentRoundDiscard++
    player.isLying = true
    $('#' + player.name).children('img').eq(0).remove()
    $('#card-container').append($('<img>').attr('src', 'playing-card-back.jpg'))
  }
}

const alertMove = (player) => {
  if (player.currentRoundDiscard === 0){
    $('#text-container').append(player.name + ' played NO ' + cardOrderPosition() + '\'s! <br />')
  } else if (player.currentRoundDiscard === 1){
    $('#text-container').append(player.name + ' played ' + player.currentRoundDiscard + ' "' + cardOrderPosition() + '"<br />')
  } else {
    $('#text-container').append(player.name + ' played ' + player.currentRoundDiscard + ' ' + cardOrderPosition() + '\'s!<br />')
  }
  if (player.isLying){
    $('#text-container').append(player.name + ' is lying!<br />')
  }

}

const returnCurrentPlayer = () => {
  for (let i = 0; i < players.length; i++){
    if (players[i].turn === true){
      return players[i]
    }
  }
}

const takeTurns = () => {
  let currentPlayer
  let nextPlayer
  for (let i = 0; i < players.length; i++){
    if (players[i].turn === true){
      currentPlayer = players[i]
      if(i === 2){
        nextPlayer = players[0]
      } else{
        nextPlayer = players[i+1]
      }
    }
  }
  for (let i = 0; i < players.length; i++){
    if (players[i] === currentPlayer){
      players[i].currentRoundDiscard = 0
      players[i].turn = false
    }
    if (players[i] === nextPlayer){
      players[i].turn = true;
    }
  }
}

const returnOpponentNotInPlay = () => {
  for (let i = 1; i < players.length; i++){
    if(players[i].turn === false){
      return players[i]
    }
  }
}

const oneRound = () => {
  if(!user.turn){
    let currentPlayer = returnCurrentPlayer()
    opponentDiscard(currentPlayer, cardOrderPosition())
    alertMove(currentPlayer)
    returnOpponentNotInPlay().checkLying(currentPlayer)
    currentPosition++
  }
}

$('#done-btn').on('click', () => {
  if (user.turn && !winner()){
    alertMove(user)

    opponent1.checkLying(user)
    if(!bullshitCalled){
      opponent2.checkLying(user)
    }
    user.currentRoundDiscard = 0
    currentPosition++
    user.isLying = false
    bullshitCalled = false

    if(!winner()){
      takeTurns()
      oneRound()
    }
  }
})

$('#bs-btn').on('click', () => {
  if(bullshitCalled === false && user.turn === false && !winner()){
    $('#text-container').append(user.name + ' accused ' + returnCurrentPlayer().name + ' of lying!<br />')
    if(returnCurrentPlayer().isLying){
      $('#text-container').append(returnCurrentPlayer().name + ' WAS lying!<br />')
      returnCurrentPlayer().deck = returnCurrentPlayer().deck.concat(discardPile)
      sortDeck(returnCurrentPlayer())
      insertCardImgOpponents(returnCurrentPlayer())
      discardPile.length = 0;
      $('#card-container').empty()

    } else {
      $('#text-container').append(returnCurrentPlayer().name + ' was NOT lying!<br />')
      user.deck = user.deck.concat(discardPile)
      sortDeck(user)
      insertCardImgUser()
      discardPile.length = 0;
      $('#card-container').empty()
    }

    if(!winner()){
      takeTurns()
      oneRound()
    }
  }
})

$('#noBS-btn').on('click', () => {
  if(bullshitCalled === false && user.turn === false && !winner()){
    if(!winner()){
      takeTurns()
      oneRound()
    }
  }
})

$('#remove-modal-btn').on('click', () => {
  $('#modal').hide()
})















})
