'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('universityadmin', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Unknown Admin'
    });
    
    await queryInterface.changeColumn('universityadmin', 'university_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.changeColumn('universityadmin', 'user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('universityadmin', 'name');

    await queryInterface.changeColumn('universityadmin', 'university_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('universityadmin', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  }
};
