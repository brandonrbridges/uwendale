const { Command } = require('discord-akairo')

const User = require('../models/User')

const UwendaleEmbed = require('../helpers/embed')

const axios = require('axios')
const randomstring = require('randomstring')

module.exports = class Verify extends Command {
  constructor() {
    super('verify', {
      aliases: ['verify', 'v'],
      args: [
        {
          id: 'summonerName',
          type: 'string',
          prompt: {
            start: 'What is your summoner name?'
          }
        }
      ]
    })
  }

  async exec(message, { summonerName }) {
    const embed = UwendaleEmbed()
    const codeEmbed = UwendaleEmbed()

    const random = randomstring.generate(8)

    codeEmbed.setTitle('League of Legends Verification')
    codeEmbed.setDescription(`Third-party code: ${random}`)
    codeEmbed.addField('What do I do with this code?', 'Open up League of Legends, head to your settings and scroll to Verification. Please paste the code there and hit save.')
    codeEmbed.addField('What next?', 'Once you have done the above, click the check mark below to proceed.')

    message.channel.send(codeEmbed)
    .then(msg => {
      msg.react('✅').then(() => msg.react('❌'))

      const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id == message.author.id
      }

      msg.awaitReactions(filter, { max: 1, time: 120000 })
      .then(collected => {
        const reaction = collected.first()

        if(reaction.emoji.name == '✅') {
          axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_TOKEN}`)
          .then(summoner => {
            axios.get(`https://euw1.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${summoner.data.id}?api_key=${process.env.RIOT_TOKEN}`)
            .then(response => {
              if(response.data == random) {
                axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}?api_key=${process.env.RIOT_TOKEN}`)
                .then(response => {
                  response.data.map(async league => {
                    if(league.queueType == 'RANKED_SOLO_5x5') {
                      const role = message.guild.roles.cache.find(role => role.name == league.tier)

                      message.member.roles.add(role, 'League of Legends Verification')

                      await User.findOneAndUpdate(
                        { discordId: message.author.id },
                        {
                          $set: {
                            summonerName: summoner
                          }
                        },
                        { new: true }
                      )
                
                      embed.setTitle('Congratulations!')
                      embed.setDescription(`${message.author}, you are successfully verified.`)
                      embed.addField('Rank/Role', role.name)
                      return message.channel.send(embed)
                    } else {
                      embed.setTitle('There was a problem!')
                      embed.setDescription(`${message.author}, you do not seem to have a Solo Queue rank. You need to complete your promotional games before you can set your rank here.`)
                      return message.channel.send(embed)
                    }
                  })
                })
              } else {
                embed.setTitle('There was a problem!')
                embed.setDescription('The code on your League of Legends account did not match the code we provided you. Please try again.')
                return message.channel.send(embed)
              }
            })
            .catch(error => {
              if(error.response.status == 404) {
                embed.setTitle('There was a problem!')
                embed.setDescription('❌ We cannot find a code on your League of Legends account. Please try again.')
                return message.channel.send(embed)
              }
            })
          })
          .catch(error => {
            if(error.response.status == 400) {
              embed.setTitle('There was a problem!')
              embed.setDescription('❌ We encountered an error whilst trying to find your account.')
              embed.addField('Why is this happening?', 'If you have special characters in your name, the Riot API will fail to find your account. We are working desperately on a solution for you.')
              return message.channel.send(embed)
            }
          })
        }

        if(reaction.emoji.name == '❌') {
          embed.setTitle('Verification cancelled')
          embed.setDescription('❌ You have cancelled your verification process.')
          embed.addField('Still want to verify?', 'If you would like to try again, just send !verify [summoner name] at any time.')
          return message.channel.send(embed)
        }
      })
      .catch(collected => {
        embed.setTitle('Verification cancelled')
        embed.setDescription('You did not react to our message within the 2 minute time limit.')
        embed.addField('Still want to verify?', 'If you would like to try again, just send !verify [summoner name] at any time.')
        return message.channel.send(embed)
      })
    })
  }
}