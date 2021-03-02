//https://flaviocopes.com/node-download-image/ referenced
const { Users } = require('../dbObjects');
const fs = require('fs');
const fetch = require('node-fetch');
const {createUser}  = require('../index.js');
module.exports = {
    name: 'add',
    description: 'adds a sound for your profile to the notification roster',
    async execute(message, commandArgs) {
        if(message.attachments && commandArgs.length > 0 && !commandArgs.includes('mp3')){
        const url = message.attachments.first().url
        const name = commandArgs;
        const path = `./sounds/${name}.mp3`;
        console.log(`alright a path has been set: ${path}`);
        console.log(`downloading: ${url}`);
        //request.get(url).on('error', console.error).pipe(fs.createWriteStream(path));//.on('close', async () => {
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFile(path, buffer, () => {console.log('download FINISHED')});
        let user = await Users.findOne({ where: { user_id: message.author.id}});
        if(!user){
                user =  await createUser(message.author.id, 0);
                console.log('created and obtained the user');
            }
            await user.addItem(path);
            console.log('songpath added!')
       // });
        }
        else{
            message.channel.send('You need an mp3 file and a simple name to go with this command (example: -add "soundName" (file upload))').then((reply) => reply.delete({timeout: 10000}));
        }
    },
};