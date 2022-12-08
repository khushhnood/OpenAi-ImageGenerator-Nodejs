const express = require('express');
const app = express()
const dotenv = require('dotenv')
const { Telegraf } = require('telegraf')
dotenv.config()
const { Configuration, OpenAIApi } = require('openai');
const PORT = process.env.PORT || 5000;

// Initiating Telegraf
const bot  = new Telegraf(process.env.BOT_TOKEN);

// Configuring OpenAI with credentials
const configuration = new Configuration({
    organization:process.env.ORG_ID,
    apiKey:process.env.OPENAI_KEY});

// Initiating OpenAI
const openai = new OpenAIApi(configuration);

// Initial reply after bot starts
bot.start((ctx) => {
    try {
      ctx
        .reply(
          "Welcome! This bot can Generate Images based on your input using OpenAI API. type /help for instructions."
        )
        .catch((err) => {
          if (err) {
            console.log("err");
            console.log(err);
            bot.stop("SIGINT");
            bot.stop("SIGTERM");
          }
        });
    } catch (error) {
      console.log("blocked");
      console.log(error);
    }
  });

// /help route for instructions
bot.help((ctx) => ctx.reply("Give image description in input. i.e. cat `driving a car on rainy day`. Character limit 1000" ));

// Getting input from user and making request to openAiAPI 
bot.on("text", async (ctx) => {
    let prompt = ctx.update.message.text;
  
    try {
        console.log(`url : ${prompt}`);
        ctx.reply("Preparing image... wait 5 seconds");
        const imageSize = '512x512'
        const generateImage = await openai.createImage({
            prompt,
            n: 1,
            size: imageSize,
          });
        const imageUrl = await generateImage.data.data[0].url;
        const repy = await ctx.replyWithPhoto(imageUrl);
  
      
    } catch (error) {
      console.log("error: ", error);
    }
  });
  
  bot.launch();

  app.listen(PORT,()=>{
    console.log(`app runnning on port : ${PORT}`);
  })

