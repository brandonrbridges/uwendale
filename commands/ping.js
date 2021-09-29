const { Command } = require('discord-akairo')

module.exports = class Ping extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping']
    })
  }

  exec(message) {
    return message.reply('pong')
  }
}