const { Command } = require('discord-akairo')

const UwendaleEmbed = require('../../helpers/embed')

const Game = require('../../models/Game')

module.exports = class Remove extends Command {
  constructor() {
    super('remove', {
      aliases: ['remove'],
      args: [
        {
          id: 'member',
          type: 'user'
        }
      ]
    })
  }

  async exec(message, { member }) {
    const embed = UwendaleEmbed()
    const game = await Game.findOne({ status: 'open' })

    if(game) {
      if(game.players.includes(member.id)) {
        await Game.findOneAndUpdate(
          { status: 'open' },
          {
            $pull: {
              players: member.id
            }
          },
          { new: true }
        )
        .then(game => {
          embed.setTitle('Player removed')
          embed.setDescription(`✅ You removed ${member} from the game. There are now ${10 - game.players.length} spaces available.`)
          embed.addField('How to join?', 'Type !join into the chat and hit enter to join.')
          return message.channel.send(embed)
        })
      } else {
        embed.setTitle('There was a problem!')
        embed.setDescription(`❌ ${member} is not listed to play this game.`)
        return message.channel.send(embed)
      }
    } else {
      embed.setTitle('There was a problem!')
      embed.setDescription('❌ There are no open games at this time.')
      return message.channel.send(embed)
    }
  }
}