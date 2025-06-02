module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Question', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    starter_code: DataTypes.TEXT,
    language_id: DataTypes.INTEGER,
  }, {
tableName: 'Question' 
});
  return Questions;
};
