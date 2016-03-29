var Botkit = require('botkit');
var Witbot = require('witbot');
var request = require('request');
var util = require('util');

var slackToken = process.env.SLACK_TOKEN;
var witToken = process.env.WIT_TOKEN;
var buzzSumoToken = process.env.BUZZ_SUMO_TOKEN;

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
  var apiRequest = util.format('http://api.buzzsumo.com/search/articles.json?q=%s&api_key=%s', message.match[1], buzzSumoToken);

  request.get(apiRequest, function(error, response, body) {
    var jsonBody = JSON.parse(body);

    bot.reply(message, util.format("Here you go: ", jsonBody["results"][0]["og_url"] ));
  });
});

controller.hears('.*', ['direct_message, direct_mention'], function(bot, message) {
  var wit = witbot.process(message.text, bot, message);

  // wit.hears('find_content', 0.5, function(bot, message, outcome) {
  //   bot.reply(message, "here it iz bro");
  // });

  wit.hears('hello', 0.5, function(bot, message, outcome) {
    bot.reply(message, 'Hi Ross! I’m Reggie, your new social media assistant. I can share or schedule links for sharing online in seconds, check your social media stats, and even find content worth sharing! Try it now, say: Reggie, find me a link about marketing.');
  });

  wit.hears('weather', 0.5, function(bot, message, outcome) {
    console.log(outcome);
  });

});


// for heroku
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
 console.log("Request: " + req.method + " to " + req.url);
 res.writeHead(200, "OK");
 res.write("<h1>Hello</h1>Node.js is working");
 res.end();
}).listen(process.env.PORT || 5000);
console.log("RDY");
