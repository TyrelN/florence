module.exports = {
    name: 'cat',
    description: 'random cat',
    execute(message, commandArgs, currency) {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
	    message.channel.send(file);
    },
};