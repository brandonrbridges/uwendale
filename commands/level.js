const { Command } = require('discord-akairo')

const User = require('../models/User')

const levels = require('../helpers/levels.json')

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
    const user = await User.findOne({ discordId: member.id })

    if(user) {
      return message.channel.send(`${member} is level ${user.level}. exp required: ${user.experience}/${levels[user.level + 1].expRequired}`)
    } else {
      return message.channel.send(`cannot find ${member} in the database. perhaps they haven't sent a message.`)
    }
  }
}