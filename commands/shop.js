const { MessageEmbed } = require('discord.js')

const { Command } = require('discord-akairo')

const items = require('../helpers/shop.json').items

module.exports = class Shop extends Command {
  constructor() {
    super('shop', {
      aliases: ['shop']
    })
  }

  exec(message) {
    const embed = new MessageEmbed()

    items.map(item => embed.addField(`${item.name}`, `[${'$' + item.price}] ${item.description}`))
    
    return message.channel.send(embed)   
  }
}