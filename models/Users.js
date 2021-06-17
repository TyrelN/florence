module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        // songs: {
        //     type: DataTypes.INTEGER,
        //     defaultValue: 0,
        //     allowNull: false,
        // },
        birthday: {
            type: DataTypes.STRING,
        },
        birthday_message:{
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false,
    });
};