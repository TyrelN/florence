const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, {foreignKey: 'item_id', as: 'item'});

Users.prototype.addItem = async function(item){
    const userItem = await UserItems.findOne({
        where:{user_id: this.user_id, item_id: item },
    });

    if(userItem){
        //there's already an item with this name, return;
        return;
    }
    return UserItems.create({user_id: this.user_id, item_id: item});

};

Users.prototype.removeItem = async function(item){
    const userItem = await UserItems.findOne({
        where:{user_id: this.user_id, item_id: item },
    });

    if(userItem){
        const pathName =  userItem.item_id;
        //there's already an item with this name, return;
        await userItem.destroy();//removes entry from database
        return pathName;
    }
    return 'Zero results. No path was ';

};

Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: { user_id: this.user_id},
        include: ['item'],
    });
};

module.exports = {Users, CurrencyShop, UserItems};