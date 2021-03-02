const { Users } = require('../dbObjects');
module.exports = {
    name: 'remove',
    description: 'removes a sound path from your roster',
    async execute(message, commandArgs) {
        if(commandArgs.includes('mp3')){
            let user = await Users.findOne({ where: { user_id: message.author.id}});
            if(!user){
                return message.channel.send("seems you don't have a database yet!");
            }
            const result = await user.removeItem(commandArgs);
            console.log(`${result} removed`);
        }
    
    },
};