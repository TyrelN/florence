const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async() => {
    const shop = [
        CurrencyShop.upsert({name: 'compliment', cost: 1}),
        CurrencyShop.upsert({name: 'butter-up', cost: 30}),
        CurrencyShop.upsert({name: 'blessing', cost: 50}),
        CurrencyShop.upsert({name: 'respect', cost: 10}),
        CurrencyShop.upsert({name: 'tribute', cost: 25}),
        CurrencyShop.upsert({name: 'applause', cost: 75}),
    ];
    await Promise.all(shop);
    console.log('Database synced');
    sequelize.close();

}).catch(console.error);