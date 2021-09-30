const { Command } = require('discord-akairo')

const UwendaleEmbed = require('../../helpers/embed')

const Game = require('../../models/Game')

module.exports = class Create extends Command {
  constructor() {
    super('create', {
      aliases: ['create']
    })
  }

  async exec(message) {
    const embed = UwendaleEmbed()
    const game = await Game.findOne({ status: 'open' })

    if(!game) {
      await new Game({
        creatorId: message.author.id,
        players: [message.author.id]
      })
      .save()
      .then(game => {
        embed.setTitle('Your game has been created!')
        embed.setDescription('✅ Your game is now open to join. Use !join to be placed in the queue.')
        return message.channel.send(embed)
      })
    } else {
      embed.setTitle('There was a problem!')
      embed.setDescription('❌ An open game already exists.')
      return message.channel.send(embed)
    }
  }
}