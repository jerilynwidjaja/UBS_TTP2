const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'mydb',        
  'postgres',    
  'postgres',     
  {
    host: 'db',   
    port: 5432,
    dialect: 'postgres',
    logging: false, 
  }
);

sequelize.sync();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Course = require('./Course')(sequelize, DataTypes);
db.Question = require('./Question')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);

db.Course.hasMany(db.Question, { foreignKey: 'courseId' });
db.Question.belongsTo(db.Course, { foreignKey: 'courseId' });

module.exports = db;
