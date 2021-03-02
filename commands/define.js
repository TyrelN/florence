const fetch = require('node-fetch');
const querystring = require('querystring');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'define',
    description: 'urban dictionary definition of args',
    async execute(message, commandArgs, currency) {
        if(!commandArgs.length){
            return;
        }
        const query = querystring.stringify({term: commandArgs.join(' ')});//native node method to make query string using all args as a single string
       const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());//returns an array of objects

       if(!list.length){
           return message.channel.send('No results for your query');
    }
    const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
    const [answer] = list[0]; // gets list[0] as a default and assigns answer as the json object

    const embed = new MessageEmbed()
        .setColor('#EFFF00')
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addFields(
            {name: 'Definition', value: trim(answer.definition, 1024)},
            {name: 'Example', value: trim(answer.example, 1024)}, 
            { name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`},
        );

        message.channel.send(embed);

    },
};