'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('teachers', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Unknown Teacher'
    });
    
    await queryInterface.changeColumn('teachers', 'university_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.changeColumn('teachers', 'user_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('teachers', 'name');

    await queryInterface.changeColumn('teachers', 'university_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('teachers', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  }
};
