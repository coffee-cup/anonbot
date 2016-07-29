'use strict'

var botkit = require('botkit')
var logger = require('morgan')

// Beep Boop specifies the port you should listen on default to 8080 for local dev
var PORT = process.env.PORT || 8080
// Slack slash command verify token
var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN

var controller = botkit.slackbot()

require('beepboop-botkit').start(controller, { debug: true })

controller.setupWebserver(PORT, function (err, webserver) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  webserver.use(logger('tiny'))
  // Setup our slash command webhook endpoints
  controller.createWebhookEndpoints(webserver)
})

controller.on('slash_command', function (bot, message) {
  // Validate Slack verify token
  if (message.token !== VERIFY_TOKEN) {
    return bot.res.send(401, 'Unauthorized')
  }

  switch (message.command) {
    case '/beepboop':
      bot.replyPrivate(message, 'boopbeep')
      break
    default:
      bot.replyPrivate(message, "Sorry, I'm not sure what that command is")
  }
})
