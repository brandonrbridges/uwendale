const { Command } = require('discord-akairo')

const UwendaleEmbed = require('../../helpers/embed')

const Game = require('../../models/Game')

module.exports = class Join extends Command {
  constructor() {
    super('join', {
      aliases: ['join']
    })
  }

  async exec(message) {
    const embed = UwendaleEmbed()
    const game = await Game.findOne({ status: 'open' })

    if(game) {
      if(!game.players.includes(message.author.id)) {
        if(game.players.length < 10) {
          await Game.findOneAndUpdate(
            { status: 'open' },
            {
              $push: {
                players: message.author.id
              }
            },
            { new: true }
          )
          .then(game => {
            embed.setTitle('You joined the game!')
            embed.setDescription(`✅ You're in! There are now ${game.players.length} people waiting to play.`)
            embed.addField('Not ready to play?', 'No problem. Just type !leave and hit enter to leave the game.')
            return message.channel.send(embed)
          })
        } else {
          embed.setTitle('There was a problem!')
          embed.setDescription('❌ This game is full.')
        }
      } else {
        embed.setTitle('There was a problem!')
        embed.setDescription('✅ You are already participating in this game.')
        return message.channel.send(embed)
      }
    } else {
      embed.setTitle('There was a problem!')
      embed.setDescription('❌ There are no open games at this time.')
      return message.channel.send(embed)
    }
  }
}