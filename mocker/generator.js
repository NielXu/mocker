const loremIpsum = require("lorem-ipsum").loremIpsum;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using `Math.round()` will give you a non-uniform distribution!
 * 
 * @param {Number} min The minimum bound, inclusive
 * @param {Number} max The maximum bound, inclusive
 */
function getRandomInt({ min, max }) {
  const bot = Math.ceil(min);
  const top = Math.floor(max);
  return Math.floor(Math.random() * (top - bot + 1)) + bot;
}

/**
 * Get a random number within the given range.
 * 
 * @param {Number} min The minimum bound, inclusive
 * @param {Number} max The maximum bound, exclusive
 */
function getRandomNum({ min, max }) {
  return Math.random() * (max - min) + min;
}

/**
 * Get a random boolean, true or false. Determined by
 * `Math.random()`.
 */
function getRandomBoolean() {
  return Math.random() < 0.5;
}

/**
 * Get a sentence with length within the range. Genrated
 * by lorem ipsum.
 * 
 * @param {Number} min Minimum length of the string, inclusive
 * @param {Number} max Maximum length of the string, inclusive
 */
function getRandomString({ min, max }) {
  return loremIpsum({
    count: getRandomInt({ min, max }),
    units: "words",
  });
}


class Generator {
  constructor(schema) {
    this.schema = schema;
  }

  getGenerators() {
    return {
      string: getRandomString,
      boolean: getRandomBoolean,
      number: getRandomNum,
      integer: getRandomInt,
      array: this._generateArray.bind(this),
      object: this._generateObject.bind(this),
      nested: this._generateNested.bind(this),
    }
  }

  _generateArray({ min, max, inner }, options) {
    if (!inner.required && options.exlcudeOptional) {
      return [];
    }
    const innerType = inner.type;
    const generate = this.getGenerators()[innerType];
    const arrLength = getRandomInt({ min, max });
    let arr = [];
    for(let i = 0; i < arrLength; i++) {
      arr.push(generate(inner, options));
    }
    return arr;
  }

  _generateObject({ key, value }, options) {
    const keyGenerate = this.getGenerators()[key.type];
    const valueGenerate = this.getGenerators()[value.type];
    const k = keyGenerate(key, options);
    const v = valueGenerate(value, options);
    return { [k]: v };
  }

  _generateNested({ schema }, options) {
    return this._generate(schema, options);
  }

  _generate(s, options) {
    let result = {};
    const schema = s.getSchema();
    const keys = Object.keys(schema);
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = schema[key];
      const required = val.required;
      if (!required && options.exlcudeOptional) {
        continue;
      }
      const generate = this.getGenerators()[val.type];
      result[key] = generate(val, options);
    }
    return result;
  }

  generate(options) {
    return this._generate(this.schema, options);
  }
}

module.exports = {
  Generator,
  getRandomInt,
  getRandomNum,
  getRandomString,
  getRandomBoolean
}