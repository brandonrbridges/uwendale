const { Command } = require('discord-akairo')

module.exports = class Clear extends Command {
  constructor() {
    super('clear', {
      aliases: ['clear'],
      args: [
        {
          id: 'amount',
          type: 'number'
        },
        {
          id: 'member',
          type: 'member'
        }
      ]
    })
  }

  async exec(message, { amount, member }) {
    await message.delete()

    let messages = await message.channel.messages.fetch({ limit: 100 })

    messages = messages.array()

    if(member) {
      messages = messages.filter(m => m.author.id == member.id)
    }
    
    if(messages.length > amount) {
      messages.length = parseInt(amount, 10)
    }

    messages = messages.filter(m => !m.pinned)
    
    amount++

    message.channel.bulkDelete(messages, true)
  }
}