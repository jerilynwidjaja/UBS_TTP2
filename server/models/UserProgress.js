export default (sequelize, DataTypes) => {
  const UserProgress = sequelize.define('UserProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastAttemptAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'UserProgress',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'questionId']
      }
    ]
  });

  return UserProgress;
};