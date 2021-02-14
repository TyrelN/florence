const fs = require('fs');
const { Client, Collection, MessageAttachment} = require('discord.js');
const {prefix, token} = require('./config.json');
const {Users} = require('./dbObjects');
const cron = require('node-cron');
const currency = new Collection();
const client = new Client();
const queue = new Map();
const members = new Map();
client.commands = new Collection();
client.music = new Collection();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
//initialize and set the roster of sounds for each member
members.set(`user#0400`, {//this is an object with the properties listed below
    birthday: `february14`,
    birthdayImage : new MessageAttachment('imageexample.jpg'),
    birthdayMessage: `It seems your birthday is today. Happy Birthday! ${this.birthdayImage}`,
    songList: new Map([ [1, 'sounds/ex1.mp3'], [2, 'sounds/ex2.mp3']]),
});

function randomSelect(min, max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

cron.schedule("* * * * *",  () => {
    const d = new Date();
    const currentDate = (months[d.getMonth()] + d.getDate()).toLowerCase();

    console.log(`one minute passed! here's todays birthday: ` + currentDate);
    members.forEach(async (memberData)=>{
        console.log(memberData.birthday);
        if(memberData.birthday === currentDate){
            console.log(`there's a birthday today`);
            const channel = client.channels.cache.get('809529649591353414');
            channel.send(memberData.birthdayMessage);
        }
    });
});


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


client.on('voiceStateUpdate', async ( oldState, state) =>{
        if(oldState.channelID === state.channelID){//this infers that the update was just mute or deafen
            return;
            }
        if (state.member.user.bot) {
            if (!state.connection) {
                console.log('bot disconnected, wiping queue');
                if (queue.size > 0) {
                    queue.delete(state.guild.id);
                }
            }
            return;
        }
        const channel = state.member.voice.channel;
        if (channel && channel.members.size > 1) {
            let sound = members.get(state.member.user.tag).songList.get(randomSelect(1,3));
            if(!sound){
                sound = `sounds/example.mp3`;
            }
            const connection = await channel.join()
            const dispatcher = connection.play(sound, { highWaterMark: 48}, {volume: false})

            dispatcher.on('start', ()=>{
                console.log('soundclip started!');
            });

            dispatcher.on('finish', () => {
                console.log('finished playing!');
                dispatcher.destroy();
                //connection.disconnect();
            });
            dispatcher.on('error', console.error);
            if (queue.size > 0) {
                console.log('there was a queue so we are wiping it');
                queue.delete(state.guild.id);
            }
        }
        else if(!channel && oldState.channel.members.size === 1 ) {
            console.log('disconnecting');
            try {
                await oldState.channel.leave();
            } catch (err) {
                console.log('an error trying to leave occurred');
            }

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
    const phrase = message.content.toLowerCase();
    //try to find a word in the array that can be found in the message
    const censored = words.find(word => phrase.includes(word));
    if(!censored){
        console.log('no problems here');
    }else{
        if(currency.getBalance(message.author.id) > 30){
            await message.delete();
            await message.reply('Oy, that is enough bad language from you! Time to scrub this message').then((reply) => reply.delete({timeout: 10000}));
            }else if(currency.getBalance(message.author.id) > 25){
            await message.reply(`You've been using foul language quite a lot recently! Try to keep it to a minimum`);
        }
        currency.add(message.author.id, 1);
        console.log(`new total for ${message.author.username} is ${currency.getBalance(message.author.id)}`);
    }
    if((phrase.includes(`i'll`) && phrase.includes(`join`)) || phrase.includes(`come on`) || phrase.includes(`coming on`) || phrase.includes(`later`)){
        const attachment = new MessageAttachment(`images/dicaprio.jpg`);
        await message.channel.send(attachment);
    }
});


client.login(token);