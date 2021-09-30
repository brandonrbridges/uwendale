const { Command } = require('discord-akairo')

const UwendaleEmbed = require('../../helpers/embed')

const Game = require('../../models/Game')
const User = require('../../models/User')

const moment = require('moment')

module.exports = class GameInfo extends Command {
  constructor() {
    super('game', {
      aliases: ['game']
    })
  }

  async exec(message) {
    const embed = UwendaleEmbed()
    const game = await Game.findOne({ status: 'open' })

    
    if(game) {
      let players = []

      const loop = game.players.map(async playerId => {
        const user = await User.findOne({ discordId: playerId })
        players.push(user)
      })

      return Promise.all(loop).then(() => {
        const playerList = []

        players.map(player => playerList.push(`${player.username + '#' + player.discriminator}`))
        
        embed.setTitle('Game')
        embed.addField('Created', moment(game.createdAt).fromNow())
        embed.addField('Player Count', `${game.players.length}/10`)
        embed.addField('Players', playerList)
        embed.addField('How to join?', 'Type !join into the chat and hit enter to join.')
        return message.channel.send(embed)
      })

    } else {
      embed.setTitle('There was a problem!')
      embed.setDescription('❌ There are no open games at this time.')
      return message.channel.send(embed)
    }
  }
}