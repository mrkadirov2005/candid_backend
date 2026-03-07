'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('universityadmin', {
      admin_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },

      university_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('universityadmin');
  }
};