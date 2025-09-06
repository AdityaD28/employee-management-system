/**
 * User Model - Step 4
 * Represents system users (admins, HR, managers, employees)
 * 
 * Fields:
 * - id: UUID primary key
 * - email: Unique email address
 * - password_hash: Bcrypt hashed password
 * - role: User role (admin, hr, manager, employee)
 * - employee_id: Link to Employee record (nullable)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for the user'
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'User email address (must be unique)'
  },
  
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Bcrypt hashed password'
  },
  
  role: {
    type: DataTypes.ENUM('admin', 'hr', 'manager', 'employee'),
    allowNull: false,
    defaultValue: 'employee',
    comment: 'User role determining permissions'
  },
  
  employee_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Reference to Employee record (nullable for admin users)'
  },
  
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the user account is active'
  },
  
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp of last successful login'
  }
}, {
  tableName: 'users',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    }
  ]
});

// Instance methods
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password_hash; // Never expose password hash
  return values;
};

module.exports = User;
