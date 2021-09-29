const { MessageEmbed } = require('discord.js')

const UwendaleEmbed = () => {
  const embed = new MessageEmbed()

  embed.setColor('#5865F2')
  embed.setFooter('~~ weeeee, veto is having fun')
  embed.setTimestamp()

  return embed
}

module.exports = UwendaleEmbed