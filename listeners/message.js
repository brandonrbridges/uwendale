const { Listener } = require('discord-akairo')

const User = require('../models/User')

const UwendaleEmbed = require('../helpers/embed')
const levels = require('../helpers/levels')

module.exports = class Message extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message',
      category: 'client'
    })
  }

  async exec(message) {
    if(message.author.bot) return

    // message.channel.send(`Welcome to the server, ${message.author}.`)
    
    const embed = UwendaleEmbed()
    
    const user = await User.findOne({ discordId: message.author.id })

    if(user) {
      await User.findOneAndUpdate(
        { discordId: message.author.id },
        {
          $set: {
            username: message.author.username,
            discriminator: message.author.discriminator
          },
          $inc: {
            experience: (Math.round((Math.round(message.content.length - 2) ^ 0.39) * user.experienceMultiplier))
          }
        },
        { new: true }
      )
      .then(async user => {
        if(user.experience >= levels[user.level + 1].expRequired) {
          await User.findOneAndUpdate(
            { discordId: message.author.id },
            {
              $set: {
                experience: 0
              },
              $inc: {
                balance: levels[user.level + 1].reward,
                level: 1
              }
            },
            { new: true }
          )
          .then(user => {
            embed.setTitle('Level up!')
            embed.setDescription(`${message.author}, you levelled up to ${user.level}!`)
            embed.addField('Rewards', `- ${levels[user.level].reward} money.`)
            
            return message.channel.send(embed)
          })
        }
      })
    } else {
      await new User({
        discordId: message.author.id,
        username: message.author.username,
        discriminator: message.author.discriminator
      }).save()
    }
  }
}