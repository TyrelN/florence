//https://flaviocopes.com/node-download-image/ referenced
const { Users } = require('../dbObjects');
const fs = require('fs');
const fetch = require('node-fetch');
const {createUser}  = require('../index.js');
module.exports = {
    name: 'add',
    description: 'adds a sound for your profile to the notification roster',
    async execute(message, commandArgs) {
        console.log(`the user of this query is: ${message.author.tag}`);
        if(message.attachments){
        const url = message.attachments.first().url
        const filter = url.split(`/`);
        const name = filter[filter.length - 1];
        const path = `./sounds/${name}`;
        if(!name.includes('mp3')){
            return message.channel.send(`Sorry, the file needs to be an mp3!`);
        }
        console.log(`downloading: ${url}`);
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFile(path, buffer, () => {console.log('download FINISHED')});
        const target = message.mentions.users.first() || message.author;
        let user = await Users.findOne({ where: { user_id: target.id}});
        if(!user){
                user =  await createUser(target.id, 0);
                console.log('created and obtained the user');
            }
            await user.addItem(path);
            console.log(`alright this sound path was added: ${name}`);
            message.channel.send(`alright, this sound file was added to your list: ${name}`).then((reply) => reply.delete({timeout: 10000}));
        }
        else{
            message.channel.send('You need to upload an mp3 file with this command! (example: -add (file upload))').then((reply) => reply.delete({timeout: 10000}));
        }
    },
};