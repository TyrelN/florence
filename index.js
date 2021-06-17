const fs = require('fs');
const { Client, Collection, MessageAttachment} = require('discord.js');
const {prefix, token} = require('./config.json');
const {Users} = require('./dbObjects');
const cron = require('node-cron');
const fetch = require('node-fetch');
const currency = new Collection();
const client = new Client();
const queue = new Map();
const members = new Map();
client.commands = new Collection();
client.music = new Collection();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const createUser = async (id, amount) =>{
    const newUser = await Users.create({user_id: id, balance: amount});
    currency.set(id, newUser);
    return newUser;
};
const randomSelect = (min, max) =>{//ensures a random number between and including max and min
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
module.exports = {
    createUser: createUser,
    currency: currency,
    randomSelect: randomSelect,
    client: client,
};

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
//cron.schedule("5 8 * * *",  () => {//node-cron task scheduler for checking for birthdays
cron.schedule("* * * * *", async () => { 
    const channel = client.channels.cache.get('809529649591353414'); 
    const d = new Date();
    const currentDate = (months[d.getMonth()] + d.getDate()).toLowerCase();

    console.log(`another day! here's todays birthday: ` + currentDate);
    const birthdayPerson = await Users.findOne({ where: { birthday: currentDate}});
    if(birthdayPerson){
        console.log(`there's a birthday today ${birthdayPerson.birthday}`);
        channel.send(`It seems we have a birthday today! ${birthdayPerson.birthday_message}`);
    }else{
        console.log('no birthday found');
    }
    //this is where we can put announcements
    const announcement = fs.readFileSync('announcement.txt', 'utf-8');
    if(announcement){
            channel.send(`${announcement}`);
            fs.writeFile('announcement.txt', '', () => {console.log('announcement wiped')});
        }else{
            console.log('there is no announcement today');
        }
});


//the inspected words are stored in a text file, for easy keyword editing
const words = fs.readFileSync('curses.txt', 'utf-8').split(',');

const retorts = fs.readFileSync('retorts.txt', 'utf-8').split(',');

Reflect.defineProperty(currency, 'add', {
    value: async function add(id, amount){
        const user = currency.get(id);
        if(user){
            user.balance += Number(amount);
            return user.save();
        }
        //if there isn't a user, create one in the database using their discord id as the user_id
       createUser(id, amount);
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
        if(queue.size > 0){//if songs are currently playing, do not disturb with a sound notification
            console.log('a song is currently playing, so no sounds will override it.')
            return;
        }
        const channel = state.member.voice.channel;
        if (channel && channel.members.size > 0) {
            // = members.get(state.member.user.tag).songList.get(randomSelect(1,2));
            let sound = ``;
            const user = await Users.findOne({ where: { user_id: state.member.user.id } });
            if(!user){
                sound = `./sounds/example.mp3`;
            }else{
               const sounds = await user.getItems();
                console.log(`here are this users sounds: ${sounds}`);
                if(!sounds.length){//the default output if no user is found
                    sound = `./sounds/example.mp3`;//will have to create a local folder named sounds and add mp3 files to use yourself
                }else{
                    sound = sounds[randomSelect(0, sounds.length - 1)].item_id;
                    console.log(`HERE'S THE SOUND WE GOT: ${sound}`);
                }
            }
            const connection = await channel.join()
            console.log('ATTEMPTING THE SONG');
            //highwatermark buffers the sound clip before playing for a smoother output
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
                command.execute(message, commandArgs);
            }catch(error){
                console.error(error);
                await message.reply('there was an error trying to execute that command. Big sad');
            }
        }else if(client.music.has(commandName)){
            const serverQueue = queue.get(message.guild.id);
            const command = client.music.get(commandName);
            try{
                command.execute(message, commandArgs, queue, serverQueue );

            }catch(error){
                console.error(error);
                await message.reply('there was an error trying to execute that command. Big sad');
            }  
    }
            await message.delete(({timeout: 10000}));
        }
    //below covers words and phrases the bot will always look out for
    const phrase = message.content.toLowerCase();
    //try to find a word in the array that can be found in the message
    const censored = words.find(word => phrase.includes(word));
    if(censored){
        if(currency.getBalance(message.author.id) > 30){
            await message.delete();
            await message.reply('Uh oh, your swear jar balance is too high! Try buying someone a compliment to lower your swear jar balance.').then((reply) => reply.delete({timeout: 10000}));
            }else if(currency.getBalance(message.author.id) > 25){
            await message.reply(`Your swear jar balance is alarmingly high! Try '-buy'-ing someone a compliment!`);
            }
        currency.add(message.author.id, 1);
        console.log(`new total for ${message.author.username} is ${currency.getBalance(message.author.id)}`);
    }else if(message.content.includes('florence')){
        const retort = retorts.find(comment => phrase.includes(comment));
        if(retort){
            console.log('we got a retort');
            await message.reply(`no you're ${retort}`);
        }
    }
});


client.login(token);