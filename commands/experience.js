const { Command } = require('discord-akairo')

const User = require('../models/User')

module.exports = class Experience extends Command {
  constructor() {
    super('experience', {
      aliases: ['experience', 'exp', 'xp'],
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
      return message.channel.send(`${member} has ${user.experience} experience.`)
    } else {
      return message.channel.send(`cannot find ${member} in the database. perhaps they haven't sent a message.`)
    }
  }
}