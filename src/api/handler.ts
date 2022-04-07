import type { Handler } from 'vite-plugin-mix'
import type { Message } from 'discord.js-selfbot-v13'
import { Client, Collection } from 'discord.js-selfbot-v13'

const RECEIVED_CHANNEL_ID = '960927218769473618'
const PREFIX = 'ms-'
const client = new Client()
const commands = new Collection<string, Function>()

function ping(message: Message) {
  // send a message to the channel the message was sent in
  return message.channel.send('Pong!')
}

function pingOther(message: Message) {
  // send a message to the channel the message was sent in
  return message.channel.send('Pong!')
}

commands.set('ping', ping)
commands.set('pingOther', pingOther)

client.on('ready', async() => {
  // log the user tag that is logged in to the console
  console.log(`${client.user.username} is ready!`)
})

client.on('messageCreate', async(message) => {
  console.log('[LOG] ~ file: main.ts ~ line 76 ~ message', message)

  // check if the message is not empty
  if (message.content) {
    // if the message not come from RECEIVED_CHANNEL_ID
    if (message.channel.id !== RECEIVED_CHANNEL_ID) {
      const channel = client.channels.cache.get(RECEIVED_CHANNEL_ID)

      setTimeout(
        () => channel.send(message.content),
        1000 + Math.floor(Math.random() * 1000),
      )
    }

    // check if the message starts with the prefix from the .env file
    if (message.content.startsWith(PREFIX)) {
      // if it does, then get the command from the message
      // and remove the prefix from the message
      const command = message.content.slice(PREFIX.length).split(/ +/g)[0]
      // get the arguments from the message
      const args = message.content.slice(PREFIX.length).split(/ +/g).slice(1)

      // check if the command is in the commands collection
      if (commands.has(command)) {
        // check if the command is a function
        if (typeof commands.get(command) === 'function') {
          // if it is, then bind the function to the client
          // first, use try catch to catch any errors
          try {
            // before calling the command, send typing to the channel
            await message.channel
              .sendTyping()
              .then(() => {
                // wait for 1 seconds before calling the command
                // plus a random millisecond to make it look more natural to the user
                // and pass the message and arguments as arguments
                setTimeout(
                  () => commands.get(command)(message, args),
                  1000 + Math.floor(Math.random() * 1000),
                )
              })
              .then(() => {
                // after the command is called, log the command
                console.log(`${message.author.tag} (${message.author.id}) ran the command ${command}`)
              })
          }
          catch (error) {
            console.error(`Error: ${error}`)
          }

          // if the command is not a function
        }
        else {
          console.error(`Error: ${command} is not a function`)
        }
      }
      else {
        console.error(`Error: ${command} is not a command`)
      }
    }
  }
})

const token = 'MzUwNTc3NjgyMDM3MDgwMDY1.YkxXvA._vSKbZ7JDOU53IiHXX7hOgxgi0c'

client.login(token)

export const handler: Handler = (req, res, next) => {
  if (req.path === '/hi')
    return res.end('hello')

  next()
}
