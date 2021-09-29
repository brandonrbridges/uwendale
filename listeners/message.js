const { Listener } = require('discord-akairo')

const User = require('../models/User')

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
            experience: 1
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
            return message.channel.send(`nice one ${message.author}, you levelled up to level ${user.level}. you have been rewarded ${levels[user.level].reward} monies too.`)
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