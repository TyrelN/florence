//with reference to https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
    name: 'stop',
    description: 'stops the music and wipes the queue',
    async execute(message, commandArgs, queue, serverQueue) {
       if(!message.member.voice.channel){
       return message.channel.send("have to be in a voice channel to stop me!").then((reply) => reply.delete({timeout: 30000}));}

       if(!serverQueue) {
           return message.channel.send("There is no song that I could stop!").then((reply) => reply.delete({timeout: 30000}));
       }
       serverQueue.songs = [];
       serverQueue.connection.dispatcher.end();
       await message.reply('Stopping complete. Peace out.').then((reply) => reply.delete({timeout: 10000}));
    }
};