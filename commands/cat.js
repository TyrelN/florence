const fetch = require('node-fetch');


module.exports = {
    name: 'cat',
    description: 'random cat',
    async execute(message, commandArgs) {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
	    message.channel.send(file);
    },
};