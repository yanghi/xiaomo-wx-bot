let slient = true


async function executeOrder(order, talker, ...contacts) {
  if (order == 'slient') {
    slient = true
    talker.say('好的,再见', ...contacts)
  } else if (order == '') {
    slient = false
    talker.say(`已解除禁言`)
  } else {
    return false
  }

  return true
}

/**
 * 
 * @param {import('wechaty').Message} message 
 * @param {*} action 
 * @returns 
 */
export async function executeMessageAction(message, actions = {}) {
  if (slient) return

  const text = message.text()

  const talker = message.talker()
  const isText = message.type() === wechaty.Message.Type.Text // 消息类型是否为文本
  if (talker.self() || !isText || (talker.name() === '微信团队' && isText)) {
    return
  }

  const room = message.room()

  console.log(`Message: ${message} msg: "${message.text()}" from ${talker.name()}`)

  const order = text.startsWith('order:') && text.substring(6)

  if (room) {
    if (await message.mentionSelf()) {
      console.log('mention self', message.text())

      if (order && await executeOrder(order, room, talker)) {
        console.log(`execute order: ${order}`)
      } else {
        actions.room && await actions.room(message)
      }
    }

  } else {
    actions.person && await actions.person(message)
  }
}