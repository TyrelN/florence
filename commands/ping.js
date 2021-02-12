module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, commandArgs, currency) {
        message.channel.send(`${message.author} pong!`).then((reply) => reply.delete({timeout: 30000}));
    },
};