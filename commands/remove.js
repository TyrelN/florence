const { Users } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'remove',
    description: 'removes a sound path from your roster',
    async execute(message, commandArgs) {
        console.log(`the user of this query is: ${message.author.tag}`);
        const target = message.mentions.users.first() || message.author;
        const query = commandArgs.split(' ');
        const term = query.find(word => !word.includes('<@!'));
        if(!term){
            return message.channel.send("You need a proper search term to query!");
        }
        let user = await Users.findOne({ where: { user_id: target.id}});
        if(!user){
             return message.channel.send("seems you don't have a database yet!");
        }
        const result = await user.removeItem(term);
        if(result){
               message.channel.send(`alright this path was removed: ${result}`).then((reply) => reply.delete({timeout: 10000}));
        }else{
               message.channel.send(`There was no path found with your query!`).then((reply) => reply.delete({timeout: 10000}));
         }
    
    },
};