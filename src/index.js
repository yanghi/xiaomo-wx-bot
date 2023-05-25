import { WechatyBuilder } from 'wechaty'
import { Configuration, OpenAIApi } from "openai"
import QR from 'qrcode-terminal'
import config from './config.js'

import { basePropmpts } from './chat-gpt.js'
import { executeMessageAction } from './executor.js'

const configuration = new Configuration({
  apiKey: config.openai.API_KEY,
})

const openai = new OpenAIApi(configuration)


async function gptChat(ques) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      ...basePropmpts,
      {
        role: 'user',
        content: ques
      }
    ]
  })
  console.log('gpt answer:', response.data.choices[0].message.content)

  return response
}

async function answserQuestion(talker, question, ...contacts) {
  try {
    let res = await gptChat(question)

    let ans = res.data.choices[0]

    if (ans && ans.message.role == 'assistant') {
      talker.say(ans.message.content, ...contacts)
    }

  } catch (error) {
    console.log('answer error', error)
  }

}


const wechaty = WechatyBuilder.build() // get a Wechaty instance
wechaty
  .on('scan', (qrcode, status) => {
    console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
    QR.generate(qrcode)
  }

  )
  .on('login', user => console.log(`User ${user} logged in`))
  .on('message', async (message) => {

    await executeMessageAction(wechaty, message, {
      room: async () => {
        await answserQuestion(message.room(), message.text(), 
        
        )
      },
      person: async () => {
        await answserQuestion(message.talker(), message.text())
      }
    })

  })

wechaty.start()
