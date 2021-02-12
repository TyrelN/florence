const {Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'buy',
    description: 'purchases the item specified as an argument, then activates the item',
    async execute(message, commandArgs, currency) {
        //this returns all sections that aren't like a mention, and assumes this is item to buy
        const complimentType = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        const target = message.mentions.users.first();
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: complimentType } } });
        if (!item) return message.channel.send(`The item you tried to buy doesn't exist!`);
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({ where: { user_id: message.author.id } });
        currency.add(message.author.id, -item.cost);

        switch(item.name){
            case 'compliment':
                if(!target){
                    message.channel.send(`@here, ${message.author} wants you to know that you're all swell as heck`);
                }else{
                    message.channel.send(`${target}, this is a heartfelt compliment coming straight from ${message.author}. You're alright!`);
                }
                break;
            case 'tribute':
                if(!target){
                    message.channel.send(`@here, ${message.author} wants to make a youtube montage out of your greatness. How wonderful!`);
                }else{
                    message.channel.send(`${target}, ${message.author} Is planning an early 2010s tribute video for you. Exciting stuff!`);
                }
                break;
            case 'blessing':
                if(!target){
                    message.channel.send(`@here, ${message.author} sends blessings to all. May god smile upon thee`);
                }else{
                    message.channel.send(`${target}, blessings upon you from ${message.author}. May the boat god bless you with a yacht`);
                }
                break;
            case 'applause':
                if(!target){
                    message.channel.send(`@here, ${message.author} Is really proud of you all, and wants to sing your praises!`);
                }else{
                    message.channel.send(`three cheers for ${target}! ${message.author} is ready to celebrate you!`);
                }
                break;
            case 'respect':
                if(!target){
                    message.channel.send(`@here, ${message.author} thinks you're all champs. Mad respect`);
                }else{
                    message.channel.send(`${target}, mad respect for you coming from ${message.author}.`);
                }
                break;
            case 'butter-up':
                if(!target){
                    message.channel.send(`@here, ${message.author} thinks you're all really smart, and funny, and cute and junk. He really wanted you to know that.`);
                }else{
                    message.channel.send(`${target}, ${message.author} thinks you're really smart, and funny, and other nice things.`);
                }
                break;
        }
    },
};