const Discord = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'displays all songs in the queue currently',
    async execute(message, commandArgs, queue, serverQueue) {
        if(!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to mess with the music").then((reply) => reply.delete({timeout: 5000}));
        if(!serverQueue){
            return message.channel.send("There is no song in the queue!").then((reply) => reply.delete({timeout: 5000}));
        }

        const queueEmbed = new Discord.MessageEmbed()
	    .setColor('#0099ff')
	    .setTitle('Songs in Queue')
        let counter = 1;
        serverQueue.songs.forEach(element => queueEmbed.addField(counter++, element.title, false));
        message.channel.send(queueEmbed).then((reply) => reply.delete({timeout: 20000}));
    }
};