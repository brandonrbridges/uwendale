const { Command } = require('discord-akairo')

const items = require('../helpers/shop.json').items
const UwendaleEmbed = require('../helpers/embed')

module.exports = class Shop extends Command {
  constructor() {
    super('shop', {
      aliases: ['shop']
    })
  }

  exec(message) {
    const embed = UwendaleEmbed()

    embed.setDescription(`Welcome to the shop.. I guess?`)
    items.map(item => embed.addField(`${item.name}`, `[${'$' + item.price}] ${item.description}`))
    
    return message.channel.send(embed)   
  }
}