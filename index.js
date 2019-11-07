// load token from env
// init
// let console know you're alive
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

// Fisher-Yates (aka Knuth) Shuffle.
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

client.on('message', msg => {
    // set !randi as trigger
    var stringToArr = msg.content.split(' ');
    if (stringToArr[0] === '!randi') {
        // get author as guild member
        var gmAuthor = msg.guild.members.get(msg.author.id);
        if (gmAuthor.voiceChannelID == undefined) {
            msg.channel.send('Not in a voice channel buddy');
        } else {
            // get voice channel
            var voiceChannel = msg.guild.channels.get(gmAuthor.voiceChannelID);
            // put all users in channel into array
            var arr = [];
            for (const [_, channel] of voiceChannel.members) {
                arr.push(channel.user.id);
            }
            if (arr.length <= 1) {
                msg.channel.send('More than one hoe required');
            } else {
                // shuffle array
                // split in 2
                // create 2 arrays for each team one contains id, other contains names
                // print teams
                shuffle(arr)
                var slice = Math.floor(arr.length / 2);
                var first = arr.slice(0, slice);
                var firstNamed = [];
                for (var person of first) {
                    firstNamed.push(msg.guild.members.get(person.toString()).user.username);
                }
                var second = arr.slice(slice);
                var secondNamed = [];
                for (var person of second) {
                    secondNamed.push(msg.guild.members.get(person.toString()).user.username);
                }
                const printTeams = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('randomized teams')
                    .addBlankField()
                    .addField('TSM', firstNamed, true)
                    .addField('SKT', secondNamed, true);
                // if -voice move 2nd team to first empty voice channel
                if (stringToArr.includes('-voice')) {
                    var guildChannels = msg.guild.channels;
                    for (const [sf, channel] of guildChannels) {
                        if (channel.type == 'voice' && channel.members.size == 0) {
                            for (var person of second) {
                                msg.guild.members.get(person.toString()).setVoiceChannel(sf.toString());
                            }
                            break;
                        }
                    }
                    printTeams.setDescription('use -voice to move players to different channels');
                }
                msg.channel.send(printTeams);
            }
        }

    }
})

client.login(process.env.BOT_TOKEN);