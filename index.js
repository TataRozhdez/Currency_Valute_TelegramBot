const Telegraf = require('telegraf')
const axios = require('axios')
const cc = require('currency-codes')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '1294844504:AAGbBtTXuprBIw1Cr2M2_1NUr98TuiBEQ38'

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

bot.start(ctx => {
  return ctx.reply('Welcome to Currency_Valute_Bot')
})

bot.hears(/^[A-Z]+$/i, (async ctx => {
  const clientCode = ctx.message.text.toUpperCase() 
  const currency = cc.code(clientCode)
  
  if (!currency) {
    return ctx.reply('Currency didn`t found')
  }

  try {
    const currencyObj = await axios.get('https://api.monobank.ua/bank/currency')

    const foundCurrency = currencyObj.data.find(cur => {
      return cur.currencyCodeA.toString() === currency.number
    })

    if (!foundCurrency || !foundCurrency.rateBuy || !foundCurrency.rateSell) {
      return ctx.reply('Currency didnt found in MonoBank API')
    }

    return ctx.replyWithMarkdown(`
      Currency: ${currency.code}
Rate BUY: ${foundCurrency.rateBuy}
Rate SELL: ${foundCurrency.rateSell}
    `)
  } catch (error) {
    return ctx.reply(error)
  }
}))

bot.startPolling()
