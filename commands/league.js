const { Command } = require('discord-akairo')

const axios = require('axios')

const UwendaleEmbed = require('../helpers/embed')

module.exports = class League extends Command {
  constructor() {
    super('league', {
      aliases: ['league'],
      args: [
        {
          id: 'username',
          type: 'string'
        }
      ]
    })
  }

  async exec(message, { username }) {
    const embed = UwendaleEmbed()
    
    axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => {
      axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${response.data.id}?api_key=${process.env.RIOT_TOKEN}`)
      .then(response => {
        response.data.map(league => {
          if(league.queueType == 'RANKED_SOLO_5x5') {
            embed.setTitle('~~~ weee')
            embed.setDescription(`${league.summonerName} is in ${league.tier} ${league.rank}.`)
            return message.channel.send(embed)
          }
        })
      })
      .catch(error => {
        console.error(error)
        return message.channel.send('there was an error, please see the console')
      })

      // axios.get(`https://euw1.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${response.data.id}?api_key=${process.env.RIOT_TOKEN}`)
      // .then(response => {
      //   return message.channel.send(JSON.stringify(response.data))
      // })
      // .catch(error => {
      //   if(error.response.status == 404) {
      //     return message.channel.send(`${username} does not have a third-party code on their account`)
      //   }
      // })
    })
    .catch(error => console.error(error))
  }
}