const { Users } = require('../dbObjects');
const { Op } = require('sequelize');
const fs = require('fs');
const request = require('request');
module.exports = {
    name: 'songlist',
    description: 'shows the songs available for the user',
    async execute(message, commandArgs) {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        if(!user){
            console.log('no user');
            return;
        }
        const items = await user.getItems();
        //console.log(`${items}`);
        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.item_id}`).join(', ')}`).then((reply) => reply.delete({timeout: 10000}));
    },
};