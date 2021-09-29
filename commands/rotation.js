const { Command } = require('discord-akairo')

const champions = require('../helpers/champions.json')
const UwendaleEmbed = require('../helpers/embed')

const axios = require('axios')

module.exports = class Rotation extends Command {
  constructor() {
    super('rotation', {
      aliases: ['rotation']
    })
  }

  exec(message) {
    const embed = UwendaleEmbed()
    
    axios.get(`https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => {
      embed.setTitle('Free Champions this week')
      let content = ''
      response.data.freeChampionIds.map(id => content += `${champions[id].name}\n`)
      embed.setDescription(content)

      return message.channel.send(embed)
    })
    .catch(error => {
      console.error(error)
    })
  }
}