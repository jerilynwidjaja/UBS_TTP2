module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Course', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
tableName: 'Course' 
});
  return Courses;
};
