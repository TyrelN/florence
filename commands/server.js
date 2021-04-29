module.exports = {
    name: 'server',
    description: 'server info display',
    execute(message, commandArgs) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`).then((reply) => reply.delete({timeout: 30000}));
    },
};