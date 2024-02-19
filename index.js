require("dotenv").config();
const htmlParser = require("node-html-parser");
const { Client, GatewayIntentBits } = require("discord.js");
const { JSDOM } = require("jsdom");
const got = require("got");
const https = require("https");
const jimp = require("jimp");
const fs = require("fs");

const garfieldURLBase = "https://www.gocomics.com/garfield/";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  console.log(`Received interaction: ${interaction.commandName}`);

  if (!interaction.isChatInputCommand()) {
    console.log("Nothing Received");
    return;
  }

  switch (interaction.commandName) {
    case "random":
      await interaction.reply({
        content: "Here's a random Garfield Strip!",
        files: [
          {
            attachment: `${await randomGarfield()}`,
            name: "random-garfield.jpg",
          },
        ],
      });

      break;

    case "pipe":
      await interaction.reply({
        content: `Now where could my pipe be?`,
        files: [
          {
            attachment: `${await getGarfield(new Date(1978, 6, 27))}`,
            name: "garfield-pipe.jpg",
          },
        ],
      });
      break;

    case "window":
      await interaction.reply({
        content: ``,
        files: [
          {
            attachment: `${await getGarfield(new Date(1981, 2, 29))}`,
            name: "garfield-window.jpg",
          },
        ],
      });
      break;

    case "today":
      await interaction.reply({
        content: `Here's Today's Garfield Strip!`,
        files: [
          {
            attachment: `${await getGarfield(new Date(Date.now()))}`,
            name: "todays-garfield.jpg",
          },
        ],
      });
      break;

    case "generate":
      await interaction.deferReply();

      let comicPath = await newComic(
        await randomWeekday(),
        await randomWeekday(),
        await randomWeekday()
      );

      await interaction.editReply({
        content: `Fresh from the lasanga tray!`,
        files: [
          {
            attachment: `${comicPath}`,
            name: "newfield.jpg",
          },
        ],
      });

      break;

    case "make-pipe-random":
      await interaction.deferReply();

      let pipeRandomPath = await newComic(
        await randomWeekday(),
        await randomWeekday(),
        await getGarfield(new Date(1978, 6, 27))
      );

      await interaction.editReply({
        content: `Fresh from the lasanga tray!`,
        files: [
          {
            attachment: `${pipeRandomPath}`,
            name: "pipefield.jpg",
          },
        ],
      });

      break;

    case "make-pipe":
      await interaction.deferReply();

      let pipedImg = await randomWeekday();

      let pipePath = await newComic(
        pipedImg,
        pipedImg,
        await getGarfield(new Date(1978, 6, 27))
      );

      await interaction.editReply({
        content: `Fresh from the lasanga tray!`,
        files: [
          {
            attachment: `${pipePath}`,
            name: "pipefield.jpg",
          },
        ],
      });

      break;

    case "weekday":
      await interaction.reply({
        content: `Here's A 3-Panel Garfield Strip!`,
        files: [
          {
            attachment: `${await randomWeekday()}`,
            name: "3-garfield.jpg",
          },
        ],
      });
      break;

    case "sunday":
      await interaction.reply({
        content: `Here's A Sunday Garfield Strip!`,
        files: [
          {
            attachment: `${await randomSunday()}`,
            name: "sunday-garfield.jpg",
          },
        ],
      });
      break;

    // newSunday() does not work as intended and I do not care enough about Garfield to put more effort into fixing it
    /*case 'make-sunday':
            await interaction.deferReply();

            let sundayPath = await newSunday([]);

            await interaction.editReply(
                {
                    content: `Fresh lasanga!`,
                    files:
                    [
                        {
                            attachment: `${sundayPath}`,
                            name:"pipefield.jpg"
                        }
                    ],
                }
            );
            break; */

    case "make-window-random":
      await interaction.deferReply();

      let windowPath = await newComic(
        await randomWeekday(),
        await randomWeekday(),
        "C:\\git\\GARFIELD\\window.jpg"
      );

      await interaction.editReply({
        content: `Fresh from the lasanga tray!`,
        files: [
          {
            attachment: `${windowPath}`,
            name: "windowfield.jpg",
          },
        ],
      });

      break;

    case "make-window":
      await interaction.deferReply();

      let randomday = await randomWeekday();

      let window2Path = await newComic(
        randomday,
        randomday,
        "C:\\git\\GARFIELD\\window.jpg"
      );

      await interaction.editReply({
        content: `Fresh from the lasanga tray!`,
        files: [
          {
            attachment: `${window2Path}`,
            name: "windowfield.jpg",
          },
        ],
      });

      break;

    case "get-garfield":
      await interaction.deferReply();

      let year = interaction.options.getInteger("year");
      let month = interaction.options.getInteger("month");
      let day = interaction.options.getInteger("day");

      let date;

      try {
        date = new Date(year, month - 1, day);
      } catch {
        interaction.editReply({
          content: `It Looks Like You Entered an Invalid Date!`,
        });
      }

      if (date) {
        if (date.valueOf() < new Date(1978, 5, 19).valueOf()) {
          interaction.editReply({
            content: `Garfield is not that old...`,
          });
        } else if (date.valueOf() > new Date(Date.now())) {
          interaction.editReply({
            content: `I can't get comics from the future, Nermal...`,
          });
        } else {
          interaction.editReply({
            content: `The Lasagna You Ordered:`,
            files: [
              {
                attachment: `${await getGarfield(date)}`,
                name: `${date.toDateString()}.jpg`,
              },
            ],
          });
        }
      }
  }
});

client.login(process.env.TOKEN);

async function randomGarfield() {
  let r = false;

  while (r === false) {
    let difference = Date.now().valueOf() - new Date(1978, 5, 19).valueOf();

    let raw =
      new Date(1978, 5, 19).valueOf() + Math.floor(Math.random() * difference);

    let date = new Date(raw);

    r = await getGarfield(date);
  }

  return await r;
}

async function randomWeekday() {
  let r = false;

  while (r === false) {
    let difference = Date.now().valueOf() - new Date(1978, 5, 19).valueOf();

    let raw =
      new Date(1978, 5, 19).valueOf() + Math.floor(Math.random() * difference);

    let date = new Date(raw);

    while (date.getDay() == 0) {
      raw =
        new Date(1978, 5, 19).valueOf() +
        Math.floor(Math.random() * difference);
      date = new Date(raw);
    }

    r = await getGarfield(date);
  }

  return await r;
}

async function randomSunday() {
  let r = false;

  while (r === false) {
    let difference = Date.now().valueOf() - new Date(1978, 5, 19).valueOf();

    let raw =
      new Date(1978, 5, 19).valueOf() + Math.floor(Math.random() * difference);

    let date = new Date(raw);

    while (date.getDay() != 0) {
      raw =
        new Date(1978, 5, 19).valueOf() +
        Math.floor(Math.random() * difference);
      date = new Date(raw);
    }

    r = await getGarfield(date);
  }

  return await r;
}

async function getGarfield(date) {
  let year = date.getYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (year <= 1978) {
    year += 1900;
  }

  let url = `${garfieldURLBase}${year}/${month}/${day}`; //console.log(url);

  let retPromise = new Promise((resolve, reject) => {
    got(url)
      .then((res) => {
        const dom = new JSDOM(res.body);

        //console.log(dom.window.document.querySelector('title').textContent);

        let pictureContainer =
          dom.window.document.querySelector(".item-comic-image");

        let img = pictureContainer.children.item(0);

        let src = img.src;

        resolve(src);
      })
      .catch((e) => {
        console.error(e);
        resolve(false);
      });
  });

  return retPromise;
}

/*let lastDate = new Date(Date.now());
setInterval(() =>
{
    let currentDate = new Date(Date.now());

    if(lastDate.getMinutes() != currentDate.getMinutes())
    {
        sendToMainChannel({
            content: `Here's Today's Garfield Strip @everyone!`,
            files:
            [
                {
                    attachment: `${  getGarfield(new Date(Date.now()))}`,
                    name:"todays-garfield.jpg"
                }
            ],
        });
    }

}, 1000 * 60);*/

async function sendToMainChannel(message) {
  //let main_channel = getChannel(process.env.DAILY_CHANNEL_ID);

  //main_channel.send(message);

  //client.channels.cache.get(process.env.DAILY_CHANNEL_ID).send(message);
  client.guilds.cache
    .get(process.env.GUILD_ID)
    .channels.cache.get(process.env.DAILY_CHANNEL_ID)
    .send(message);
}

async function getChannel(id) {
  //let guild = client.guilds.cache.find((guild) => guild.id == process.env.GUILD_ID);
  //return guild.channels.cache.find((channel) => channel.id == id);
  return client.channels.cache.get(id);
}

async function newComic(panel1Path, panel2Path, panel3Path) {
  let panel1 = await jimp.read(panel1Path);
  let panel2 = await jimp.read(panel2Path);
  let panel3 = await jimp.read(panel3Path);

  let height = panel1.bitmap.height;
  let third1 = Math.round(panel1.bitmap.width / 3);
  let third2 = Math.round((2 * panel1.bitmap.width) / 3);
  let width = panel1.bitmap.width;

  panel2.resize(width, height);
  panel3.resize(width, height);

  panel2.crop(third1, 0, third2 - 1, height - 1);
  panel3.crop(third2, 0, width - 1, height - 1);

  panel1.composite(panel2, third1, 0);
  panel1.composite(panel3, third2, 0);

  let path = "newfield.jpg";
  panel1.write(path);
  return path;
}

// 1 big sunday, 2 small sunday, 3 normal
async function widthRatio(path) {
  let inputImg = await jimp.read(path);

  let width = inputImg.bitmap.width;
  let height = inputImg.bitmap.height;

  let ratio = Math.floor(width / height);

  if (ratio > 3) {
    ratio = 3;
  }

  return ratio;
}

// I don't care enough to make this workable
/*async function newSunday(panelPaths)
{
    while(panelPaths.length < 6)
    { 
        panelPaths.push( await randomSunday());
    }

    let panels = [];

    for(let i = 0; i < panelPaths.length; ++i)
    {   //console.log(panelPaths[i]);
        let img = await jimp.read(panelPaths[i]);
        panels.push(img);
    }

    let ratio = widthRatio(panelPaths[0]);

    if(ratio == 1 && panels.length < 7) // Big Sunday
    {
        panels.push(randomSunday());

        let height = panels[0].bitmap.height;
        let third1 = Math.round(panels[0].bitmap.width / 3);
        let third2 = Math.round((2 * panels[0].bitmap.width) / 3);
        let width = panels[0].bitmap.width;
        let thirdh1 = Math.round(panels[0].bitmap.height / 3);
        let thirdh2 = Math.round((2 * panels[0].bitmap.height) / 3);

        for(let i = 1; i < panels.length; ++i)
        {
            let panelRatio = widthRatio[panelPaths[i]];

            if(panelRatio == 1)
            {
                panels[i].resize(width, height);
                panels[i].crop(0, thirdh1, width, height);
            } else
            {
                panels[i].resize(width, third2);
            }

            let idx = i - 1;
            let x = idx % 3;
            let y = Math.floor(idx / 3);

            let w = x + 1;
            let h = y + 1;

            panels[i].crop(x * third1, y * thirdh1, w * third1, h * thirdh1,)

            panels[0].composite(panels[i], x * third1, y * thirdh1);

            
        }
    } 
    else // Small Sunday
    {
        let height = panels[0].bitmap.height;
        let third1 = Math.round(panels[0].bitmap.width / 3);
        let third2 = Math.round((2 * panels[0].bitmap.width) / 3);
        let width = panels[0].bitmap.width;
        let thirdh1 = Math.round(panels[0].bitmap.height / 3);
        let thirdh2 = Math.round((2 * panels[0].bitmap.height) / 3);

        for(let i = 1; i < panels.length; ++i)
        {
            let panelRatio = widthRatio[panelPaths[i]];

            if(panelRatio == 1)
            {
                panels[i].resize(width, height);
                panels[i].crop(0, thirdh1, width, height);
            } else
            {
                panels[i].resize(width, third2);
            }

            let idx = i;
            let x = idx % 3;
            let y = Math.floor(idx / 3);

            panels[0].composite(panels[i], x * third1, y * thirdh1);

            
        }
    }

    let path = "newfield.jpg";
    panels[0].write(path);
    return path;
}*/
