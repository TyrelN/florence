const { CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'shop',
    description: 'shows all of the items in the shop',
    async execute(message, commandArgs) {
        const items = await CurrencyShop.findAll();
        return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true }).then((reply) => reply.delete({timeout: 30000}));
    },
};