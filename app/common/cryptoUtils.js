import bcrypt from 'bcrypt'
import Promise from 'bluebird'

Promise.promisifyAll(bcrypt)

const ROUNDS = 10

export default {

  hashPassword(password) {
    return bcrypt.hashAsync(password, ROUNDS)
  },

  comparePasswords(password, passwordHash) {
    return bcrypt.compareAsync(password, passwordHash)
  }
}