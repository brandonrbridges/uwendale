const { Command } = require('discord-akairo')

const User = require('../models/User')

const UwendaleEmbed = require('../helpers/embed')

module.exports = class Leaderboard extends Command {
  constructor() {
    super('leaderboard', {
      aliases: ['leaderboard', 'lb']
    })
  }

  async exec(message) {
    const embed = UwendaleEmbed()
    const users = await User.find({}).sort({ level: -1, experience: -1 }).limit(5)

    embed.setDescription('Leaderboard')

    users.map((user, i) => embed.addField(`#${i + 1}: ${user.username}#${user.discriminator}`, `${user.username}#${user.discriminator} is level ${user.level} and has ${user.experience} xp.`))

    return message.channel.send(embed)
  }
}