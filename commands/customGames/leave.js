const { Command } = require('discord-akairo')

const UwendaleEmbed = require('../../helpers/embed')

const Game = require('../../models/Game')

module.exports = class Leave extends Command {
  constructor() {
    super('leave', {
      aliases: ['leave']
    })
  }

  async exec(message) {
    const embed = UwendaleEmbed()
    const game = await Game.findOne({ status: 'open' })

    if(game) {
      if(game.players.includes(message.author.id)) {
        await Game.findOneAndUpdate(
          { status: 'open' },
          {
            $pull: {
              players: message.author.id
            }
          },
          { new: true }
        )
        .then(game => {
          embed.setTitle('You left the game!')
          embed.setDescription(`✅ You have successfully left the game. There are now ${10 - game.players.length} spaces available.`)
          message.channel.send(embed)

          if(game.players.length == 0) {
            Game.findOneAndDelete({ status: 'open' })
            .then(() => {
              embed.setTitle('Game deleted')
              embed.setDescription('⚠ I have deleted the game as you were the only remaining player in the lobby.')
              embed.addField('Want to play another?', 'Type !create into the chat and hit enter to create one.')
              return message.channel.send(embed)
            })
          }
        })
      } else {
        embed.setTitle('There was a problem!')
        embed.setDescription('❌ You aren\'t participating in any game.')
        return message.channel.send(embed)
      }
    } else {
      embed.setTitle('There was a problem!')
      embed.setDescription('❌ There are no open games at this time.')
      return message.channel.send(embed)
    }
  }
}