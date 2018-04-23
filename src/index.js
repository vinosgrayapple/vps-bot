const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
const token = config.TOKEN
const bot = new TelegramBot(token, {
  polling: true
})
const mongoose = require('mongoose')
const keyboard = require('./keyboard')
const kb = require('./keyboad-buttons')
const database = require('../database.json')
const os = require('os')
const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

process.on('uncaughtException', function (err) {         log.critical ('Except', err.stack); });


helper.logStart()
mongoose
  .connect(config.DB_URL)
  .then(() => console.log('Mongo DB connected'))
  .catch(err => console.log(err))
//==============================================

require('./models/film.model')
const Film = mongoose.model('films')

// database.films.map(film => {
//   new Film(film).save().catch(e => console.log(e))
// })

/////////////////////////////////////////////////

bot.on('message', msg => {
  const chatId = helper.getChatId(msg)
  switch (msg.text) {
    case kb.home.films:
      // i.log(kb.home.films)
      bot.sendMessage(chatId, 'Выберите жанр', {
        reply_markup: {
          keyboard: keyboard.films
        }
      })
      break
    case kb.film.comedy:
      sendFilmsByQuery(chatId, { type: 'comedy' })
      break
    case kb.film.action:
      sendFilmsByQuery(chatId, { type: 'action' })
      break
    case kb.film.random:
      sendFilmsByQuery(chatId, {})
      break
    case kb.home.cinemas:
      console.log(kb.home.cinemas)
      break
    case kb.home.favorite:
      console.log(kb.home.favorite)
      break
    case kb.back:
      bot.sendMessage(chatId, 'Что хотите посмотреть?', {
        reply_markup: {
          keyboard: keyboard.home
        }
      })
      break
    default:
      break
  }
})

bot.onText(/\/start/, msg => {
  const text = `Здравствуйте, ${
    msg.from.first_name
  }\nВыберите команду для начала работы:`
  bot.sendMessage(helper.getChatId(msg), text, {
    reply_markup: {
      keyboard: keyboard.home
    }
  })
})
bot.onText(/\/f(.+)/, (msg, match) => {
  const id = match[1]
  const chatId = msg.chat.id
  console.log('=============================')
  Film.findOne({ _id: id })
    .then(f => {
      const caption = `Название: ${f.name}\nСтрана: ${f.country}\n`
	console.log(f.name)
      bot
        .sendPhoto(chatId, f.pictures, {
          caption: caption,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '=> Избранное',
                  callback_data: f._id
                },
                {
                  text: '=> Кинотеатры',
                  callback_data: f._id
                }
              ],
              [
                {
                  text: `Kinopoisk.ru  ${f.name}`,
                  url: f.link
                }
              ]
            ]
          }
        })
        .catch(e => console.log(e))
      // sendHTML(chatId, html, 'films')
    })
    .catch(e => console.log(e))
})
//========================================
function sendFilmsByQuery(chatId, query) {
  Film.find(query).then(films => {
    const html = films.reduce((red, f, indx) => {
      return red + `<b>${indx + 1}.</b> <a href="">${f.name}</a> /f${f._id}\n`
    }, ``)
    // console.log(html + '  HTML')
    sendHTML(chatId, html, 'films')
  })
}
function sendHTML(chatId, html, kbName = null) {
  const options = {
    parse_mode: 'HTML'
  }
  if (kbName) {
    options.reply_markup = { keyboard: keyboard['kbName'] }
  }
  bot.sendMessage(chatId, html, options)
}
