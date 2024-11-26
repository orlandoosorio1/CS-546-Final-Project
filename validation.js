import {ObjectId} from 'mongodb';

const exportedMethods = {
  checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  },
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },
  checkNumber(numVal, varName){
    if (typeof numVal !== "number" || !Number.isInteger(numVal)) {
      throw `Error: '${varName}' is not a valid number or integer.`;
    }
    return numVal;
  },
  checkStringList(strList, varName){
    if(!strList) throw `Error: You must supply a ${varNam}!`;
    if(!Array.isArray(strList)) throw `Error: ${varName} must be a list!`;
    return strList.map((str, index) => {
      try{
        return this.checkString(str, `${varName}[${index}]`)
      }catch(error){
        throw `Error in ${varName}[${index}]`;
      }
    })
  },
  checkUsername(username) {
    username = this.checkString(username, 'Username');
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/; // Only alphanumeric and underscores, 4-20 characters
    if (!usernameRegex.test(username)) {
      throw 'Error: Username must be 4-20 characters long and contain only letters, numbers, or underscores.';
    }
    return username;
  },
  checkPassword(password) {
    password = this.checkString(password, 'Password');
    if (password.length < 8) {
      throw 'Error: Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      throw 'Error: Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      throw 'Error: Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      throw 'Error: Password must contain at least one digit.';
    }
    if (!/[!-_@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw 'Error: Password must contain at least one special character.';
    }
    return password;
  }
};

export default exportedMethods;