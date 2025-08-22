const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(name, email, password) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = this.hashPassword(password);
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isActive = true;
    this.loginAttempts = 0;
    this.lastLogin = null;
    this.theme = 'light'; // light or dark
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  updatePassword(newPassword) {
    this.password = this.hashPassword(newPassword);
    this.updatedAt = new Date();
  }

  incrementLoginAttempts() {
    this.loginAttempts++;
    if (this.loginAttempts >= 5) {
      this.isActive = false;
    }
  }

  resetLoginAttempts() {
    this.loginAttempts = 0;
    this.lastLogin = new Date();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.updatedAt = new Date();
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// In-memory storage
const users = [];

class UserModel {
  static create(userData) {
    const user = new User(userData.name, userData.email, userData.password);
    users.push(user);
    return user;
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findAll() {
    return users;
  }

  static update(id, updateData) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    const user = users[userIndex];
    Object.assign(user, updateData);
    user.updatedAt = new Date();
    return user;
  }

  static delete(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  }
}

module.exports = { User, UserModel };