import type { Message } from 'discord.js-selfbot-v13'
import { Client, Collection } from 'discord.js-selfbot-v13'
import express from 'express'

const app = express()
app.use(express.json())
const client = new Client()
const PREFIX = 'ms-'
const commands = new Collection<string, Function>()

function ping(message: Message) {
  // send a message to the channel the message was sent in
  return message.channel.send('Pong!')
}

commands.set('ping', ping)

app.get('/user', (req, res) => {
  res.json(client.user)
})

app.post('/start', (req, res) => {
  console.log('[LOG] ~ file: handler.ts ~ line 24 ~ req.body', req.body)
  const { channels, mainChannel, token } = req.body
  client.on('ready', async() => {
    // log the user tag that is logged in to the console
    console.log(`${client.user.username} is ready!`)
    res.json(client.user)
  })

  client.on('messageCreate', async(message) => {
    console.log('[LOG] ~ file: main.ts ~ line 76 ~ message.content', message.content)

    // check if the message is not empty
    if (message.content) {
      // regex to check a string is contains a link
      const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
      const isLink = regex.test(message.content)
      console.log('[LOG] ~ file: handler.ts ~ line 39 ~ isLink', isLink)

      // if the message not come from mainChannel
      const isNotMainChannel = message.channel.id !== mainChannel
      // message is coming from source channel
      const fromSourceChannels = channels.includes(message.channel.id)

      if (isNotMainChannel && fromSourceChannels && isLink) {
        const channel = client.channels.cache.get(mainChannel)

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

  client.login(token)
})

app.post('/stop', (req, res) => {
  client.destroy()
  res.json({ message: 'stopped' })
})

export const handler = app
