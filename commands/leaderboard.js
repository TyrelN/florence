module.exports = {
    name: 'leaderboard',
    description: 'shows a leaderboard of the 10 richest members',
    execute(message, commandArgs, currency) {
        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                .join('\n'),
            { code: true }
        ).then((reply) => reply.delete({timeout: 30000}));
    },
};