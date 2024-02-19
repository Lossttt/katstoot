require("dotenv").config();
const {REST, Routes, SlashCommandBuilder, ApplicationCommandOptionType} = require("discord.js");

const commands = commandBuilding();

const rest = new REST({version : '10'}).setToken(process.env.TOKEN);

reg();

async function reg() 
{
    try
    {
        console.log("Refreshing Slash Commands...");

        //await rest.put(Routes.applicationCommands(client.user.tag), {body: commands});
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands}
        )

        console.log("Successfully Refreshed Slash Commands!");
    } catch (e)
    {
        console.error(e);
    }
}

function commandBuilding()
{
    let commandList = 
    [
        {
            name: 'random',
            description: 'Replies with Random Garfield Comic!',
        },
        {
            name: 'pipe',
            description: 'Replies with Garfield Pipe Comic!',
        },
        {
            name: 'window',
            description: 'Replies with Garfield Window Comic!',
        },
        {
            name: 'today',
            description: `Replies with Today's Garfield Comic!`,
        },
        {
            name: 'generate',
            description: `Generates a new Garfield Comic from Existing Panels!`,
        },
        {
            name: 'make-pipe',
            description: `Generates a new Garfield Pipe Comic!`,
        },
        {
            name: 'make-pipe-random',
            description: `Generates a random new Garfield Pipe Comic!`,
        },
        {
            name: 'make-window',
            description: `Generates a new Garfield Window Comic!`,
        },
        {
            name: 'make-window-random',
            description: `Generates random a new Garfield Window Comic!`,
        },
        {
            name: 'weekday',
            description: 'Replies with Random 3-Panel Garfield Comic!',
        },
        {
            name: 'sunday',
            description: 'Replies with Random Sunday Comic!',
        },
        {
            name: 'get-garfield',
            description: 'Replies with Garfield Comic of a Given Date',
            options:
            [
                {
                    name: 'day',
                    description: 'day',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1,
                    max_value: 31,
                },
                {
                    name: 'month',
                    description: 'month',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1,
                    max_value: 12,
                },
                {
                    name: 'year',
                    description: 'year',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1978,
                    max_value: 2023,
                }
            ]
        },
    ];

    /*let getComicCommand = new SlashCommandBuilder()
        .setName('get-garfield')
        .setDescription('Replies with Garfield Comic of a Given Date')
        .addIntegerOption((option) => 
        {
            option.setName('day')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(31)
        })
        .addIntegerOption((option) => 
        {
            option.setName('month')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(12)
        })
        .addIntegerOption((option) => 
        {
            option.setName('Year')
            .setRequired(true)
            .setMinValue(1978)
            .setMaxValue(2023)
        })

    commandList.push(getComicCommand);*/

    return commandList;
}