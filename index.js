const TelegramBot = require('node-telegram-bot-api')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
const PNF = require('google-libphonenumber').PhoneNumberFormat
const token = '512174639:AAFu9hY6BZCdjxl7j8LhYqdfOl_SI8mzQ34'
const bot = new TelegramBot(token, { polling: true })
const os = require('os')
const price = {
  vodka: '19.2',
  beer: '245.3',
  komarichev: '676251858'
}
bot.onText(/\/get (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const resp = match[1]
  //console.log(phoneUtil.OriginalFormat(price[resp], 'UA'))
  if (resp in price) {
    const number = phoneUtil.parseAndKeepRawInput(price[resp], 'UA')
    bot.sendMessage(
      chatId,
      ' 📱 ' + phoneUtil.format(number, PNF.INTERNATIONAL)
    )
  }
})
bot.on('message', msg => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, msg.text)
})
