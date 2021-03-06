const { Command } = require('discord-akairo')

const User = require('../models/User')

const levels = require('../helpers/levels.json')
const UwendaleEmbed = require('../helpers/embed')

module.exports = class Level extends Command {
  constructor() {
    super('level', {
      aliases: ['level', 'lvl'],
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
        embed.setDescription(`You are level ${user.level}, ${member}.`)
        embed.addField('To level up:', `${levels[user.level + 1].expRequired - user.experience} xp away from levelling up to level ${user.level + 1}.`)
      } else {
        embed.setDescription(`${member}'s level is ${user.level}. They are ${levels[user.level + 1].expRequired - user.experience} away from levelling up to level ${user.level + 1}.`)
      }
      return message.channel.send(embed)
    } else {
      embed.setDescription(`Huh.. I can't seem to find ${member} in the database. Try again?`)
      return message.channel.send(embed)
    }
  }
}