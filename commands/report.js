const { Command } = require('discord-akairo')

const User = require('../models/User')
const Report = require('../models/Report')

const UwendaleEmbed = require('../helpers/embed')

module.exports = class ReportCommand extends Command {
  constructor() {
    super('report', {
      aliases: ['report'],
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: message => message.channel.send(UwendaleEmbed().setDescription('Please mention the person you would like to report..'))
          }
        },
        {
          id: 'reason',
          type: 'string',
          prompt: {
            start: message => message.channel.send(UwendaleEmbed().setDescription('Please state the reason for your report..'))
          }
        }
      ]
    })
  }

  async exec(message, { member, reason }) {
    const embed = UwendaleEmbed()
    
    if(member && reason) {
      await new Report({
        reportee: member.id,
        reporter: message.author.id,
        reason: reason
      })
      .save()
      .then(report => {
        embed.setTitle('Report submitted successfully')
        embed.setDescription(`Thank you ${message.author}. We have processed your report and it is awaiting attention from the staff.`)
        return message.channel.send(embed)
      })
      .catch(error => {
        embed.setTitle('Something went wrong!')
        embed.setDescription('There appears to be a problem submitting your report. Please try again.')
        return message.channel.send(embed)
      })
    }
  }
}