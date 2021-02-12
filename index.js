const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const {Users} = require('./dbObjects');
const currency = new Discord.Collection();
const client = new Discord.Client();
const queue = new Map();
//const members = new Map();
client.commands = new Discord.Collection();
client.music = new Discord.Collection();

const musicFiles = fs.readdirSync('./music').filter(file => file.endsWith('.js'));
//for every file found in this directory, set it as a known command for the discord client
for(const file of musicFiles){
    const command = require(`./music/${file}`);
    client.music.set(command.name, command);
}
//same process for the generic commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
//the inspected words are stored in a text file, for easy keyword editing
const words = fs.readFileSync('curses.txt', 'utf-8').split(',');

Reflect.defineProperty(currency, 'add', {
    value: async function add(id, amount){
        const user = currency.get(id);
        if(user){
            user.balance += Number(amount);
            return user.save();
        }
        //if there isn't a user, create one in the database using their discord id as the user_id
        const newUser = await Users.create({user_id: id, balance: amount});
        currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(currency, 'getBalance', {
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});
client.once('ready', async () => {
    //words.forEach(word => console.log(word));
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    console.log(`Logged in as ${client.user.tag}!`);
});

client.once('reconnecting', () => {
    console.log('reconnecting!');
});

client.once('disconnect', () =>{
    console.log(`disconnecting:`);

});


client.on('voiceStateUpdate', async state =>{
    if(state.member.user.bot){
        if (!state.connection) {
            console.log('bot disconnected, wiping queue');
            if (queue.size > 0) {
                queue.delete(state.guild.id);
            }
        }
        return;
    }
    const channel = state.member.voice.channel;
    if(channel && channel.members.size > 1) {
        console.log(channel.members.size);
        const connection = await channel.join();
        const dispatcher = connection.play('sounds/hawkwood.mp3', { highWaterMark: 48}, {volume: false});// the highwater mark attribute prepares 36 audio packets before playback (buffer)

        dispatcher.on('start', ()=>{
            console.log('hawkwood is now talking');
        });

        dispatcher.on('finish', () => {
            console.log('finished playing!');
            dispatcher.destroy();
            //connection.disconnect();
        });
        dispatcher.on('error', console.error);
    }
});
client.on('message', async message =>{
    if(message.author.bot) return;//if bot is talking no need to check any of this
    if(message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).trim().split(/ +/);//slice removes the prefix, trim cuts out stray white spaces, then split turns the spaced words into arguments
        const commandName = args.shift().toLowerCase();
        const commandArgs = args.join(' ');//puts the array elements back into one string seperated by a space
        if(!client.commands.has(commandName) && !client.music.has(commandName)) return;
        if(client.commands.has(commandName)){
            const command = client.commands.get(commandName);
            try{
                command.execute(message, commandArgs, currency );
            }catch(error){
                console.error(error);
                await message.reply('there was an error trying to execute that command. Big sad');
            }
        }else{
            const serverQueue = queue.get(message.guild.id);
            const command = client.music.get(commandName);
            try{
                command.execute(message, commandArgs, queue, serverQueue );

            }catch(error){
                console.error(error);
                await message.reply('there was an error trying to execute that command. Big sad');
            }
        }
            await message.delete();
        }
    //below covers words and phrases the bot will always look out for
    const phrase = message.content;
    if(phrase.includes('new bot') || phrase.includes('did you make this')){
        return message.reply(`I am indeed a bot created by Tyrel to perform a variety of functions!\n\nIf you would like to know more ${message.author.username}, type "-help" into any channel.`);
    }
    //try to find a word in the array that can be found in the message
    const censored = words.find(word => message.content.includes(word));
    if(!censored){
        console.log('no problems here');
    }else{
        if(currency.getBalance(message.author.id) > 5){
            await message.delete();
            if(message.author.tag !== 'Bane Üme#8734' && message.author.tag !== 'Toi#0400' && message.author.tag !=='BlackNote#3519') {
                console.log('should be good to change nickname')
                try {
                    message.member.setNickname(`naughty boy ${message.member.nickname}`);
                } catch (err) {
                    console.log(err);
                }
            }
            await message.reply('Oy, that is enough bad language from you! Time to scrub this thread clean of that message!').then((reply) => reply.delete({timeout: 10000}));
            }else{
            await message.reply(`Mind the language! We need to keep this server family-friendly.`);
        }
        currency.add(message.author.id, 1);
        console.log(`new total for ${message.author.username} is ${currency.getBalance(message.author.id)}`);
    }
});


client.login(token);