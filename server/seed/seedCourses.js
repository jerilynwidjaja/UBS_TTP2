const db = require('../models');

const seed = async () => {
  await db.sequelize.sync({ force: true });

  const course = await db.Course.create({
    title: 'C++ DSA Course',
    description: 'Learn DSA using C++ with hands-on problems',
  });

  await db.Question.bulkCreate([
    {
      title: 'Two Sum',
      description: 'Return indices of two numbers adding up to target.',
      starter_code: `vector<int> twoSum(vector<int>& nums, int target) {
  // Write your code here
}`,
      language_id: 54, 
      courseId: course.id
    },
    {
      title: 'Reverse Array',
      description: 'Reverse an array in-place.',
      starter_code: `void reverseArray(vector<int>& nums) {
  // Write your code here
}`,
      language_id: 54,
      courseId: course.id
    }
  ]);

  console.log('Seeding complete!');
};

seed();
