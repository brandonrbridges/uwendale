require('dotenv').config()

const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo')

const mongoose = require('mongoose')

class UwendaleClient extends AkairoClient {
  constructor() {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      disableMentions: 'everyone'
    })

    mongoose.connect(process.env.MONGO)
    .then(connection => {
      console.log('** Uwendale is connected **')
    })
    .catch(error => {
      console.error('** Uwendale failed to connect **', error)
    })

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      prefix: '!'
    }).loadAll()

    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners/'
    }).loadAll()
  }
}

const Uwendale = new UwendaleClient()

Uwendale.on('ready', () => Uwendale.user.setPresence({ activity: { name: 'with itself' }, status: 'online' }))

Uwendale.login(process.env.TOKEN)