module.exports = {
    name: 'help',
    description: 'displays helpful information about bot commands',
    execute(message, commandArgs, currency) {
        message.channel.send(`Greetings. it's your local bot, here to explain what I can do!\n\n\nIf you want to play music, try the "-play (url)", "-skip", and "-stop" commands\n\nCheck out what to buy with "-shop" and then "-buy (item)" one of them to spend your proverbial cash.\n\nIf you want to know who's been the misbehaving the most, try "-leaderboard"\n\nIf you want to know how much cash you've wracked up, try "-balance"\n\nThere are other small commands that aren't important enough to mention. If you're so inclined, feel free to give your best guesses a shot!
         `).then((reply) => reply.delete({timeout: 30000}));
    },
};