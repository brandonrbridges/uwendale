const { Command } = require('discord-akairo')

const User = require('../models/User')

const UwendaleEmbed = require('../helpers/embed')

module.exports = class Balance extends Command {
  constructor() {
    super('balance', {
      aliases: ['balance', 'bal'],
      args: [
        {
          id: 'member',
          type: 'user',
          default: message => message.author
        }
      ]
    })
  }

  async exec(message, { member }) {
    const embed = UwendaleEmbed()
    const user = await User.findOne({ discordId: member.id })

    if(user) {
      if(message.author.id == member.id) {
        embed.setDescription(`Your balance is ${user.balance}, ${member}.`)
      } else {
        embed.setDescription(`${member}'s balance is ${user.balance}.`)
      }
      return message.channel.send(embed)
    } else {
      embed.setDescription(`Huh.. I can't seem to find ${member} in the database. Try again?`)
      return message.channel.send(embed)
    }
  }
}