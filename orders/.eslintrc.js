module.exports = {
  "env": {
      "es6": true,
      "node": true
  },
  "extends": [
      "airbnb-base",
  ],
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "rules": {
      "import/named": "disable",
      "no-use-before-define": 0,
      "no-underscore-dangle": 0,
      "no-plusplus": 0
  }
};