const { Command } = require('discord-akairo')

const Report = require('../models/Report')
const User = require('../models/User')

const UwendaleEmbed = require('../helpers/embed')

module.exports = class ReportsCommand extends Command {
  constructor() {
    super('reports', {
      aliases: ['reports'],
      args: [
        {
          id: 'member',
          type: 'member'
        }
      ]
    })
  }

  async exec(message, { member }) {
    const embed = UwendaleEmbed()

    const filter = (member ? { discordId: member.id } : {})

    let reports = await Report.find(filter).lean()

    embed.setTitle('Open Reports')
    embed.setDescription('Please do not allow the public eye to see this.')

    reports = reports.map(async report => {
      const reportee = await User.findOne({ discordId: report.reportee })
      const reporter = await User.findOne({ discordId: report.reporter })

      embed.addField(`Reportee: ${reportee.username + '#' + reportee.discriminator}`, `Reported by ${reporter.username + '#' + reporter.discriminator} for ${report.reason}`)
    })

    return Promise.all(reports).then(() => {
      return message.channel.send(embed)
    })
  }
}