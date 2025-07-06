export default (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    starterCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 63, // JavaScript
    },
    expectedOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING,
      defaultValue: 'easy',
    },
    testCases: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('testCases');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('testCases', JSON.stringify(value));
      }
    },
  }, {
    tableName: 'Question'
  });

  return Question;
};