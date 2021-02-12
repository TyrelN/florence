//with reference to https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
    name: 'skip',
    description: 'skips the current song playing and goes straight to the next',
    async execute(message, commandArgs, queue, serverQueue) {
        if(!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to mess with the music").then((reply) => reply.delete({timeout: 5000}));
        if(!serverQueue){
            return message.channel.send("There is no song to skip").then((reply) => reply.delete({timeout: 5000}));
        }
        serverQueue.connection.dispatcher.end();
        message.channel.send('skipping current song!').then((reply) => reply.delete({timeout: 5000}));
    }
};