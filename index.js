var Botkit = require('botkit');
var Witbot = require('witbot');
var request = require('request');
var util = require('util');

var slackToken = process.env.SLACK_TOKEN;
var witToken = process.env.WIT_TOKEN;

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: slackToken
}).startRTM(function(err, bot, payload) {
  if (err) {

    throw new Error('Error connecting to slack: ', err);
  }
  console.log('Connected to slack');
});

var witbot = Witbot(witToken);

controller.hears('find me a link about (.*)', 'direct_message', function(bot, message) {
  console.log(message.match[1]);
  var apiRequest = util.format('http://api.buzzsumo.com/search/articles.json?q=%s&api_key=x', message.match[1]);

  request.get(apiRequest, function(error, response, body) {
    var jsonBody = JSON.parse(body);

    bot.reply(message, 'not implemented yet');
    //bot.reply(message, jsonBody["results"][0]["og_url"]);
  });
});

controller.hears('.*', ['direct_message, direct_mention'], function(bot, message) {
  var wit = witbot.process(message.text, bot, message);

  wit.hears('find_content', 0.5, function(bot, message, outcome) {
    bot.reply(message, "here it iz bro");
  });

  wit.hears('hello', 0.5, function(bot, message, outcome) {
    bot.reply(message, 'Hi Ross! I’m Reggie, your new social media assistant. I can share or schedule links for sharing online in seconds, check your social media stats, and even find content worth sharing! Try it now, say: Reggie, find me a link about marketing.');
  });

  wit.hears('weather', 0.5, function(bot, message, outcome) {
    console.log(outcome);
  });

});
