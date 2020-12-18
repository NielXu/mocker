const loremIpsum = require("lorem-ipsum").loremIpsum;

class Generator {
  constructor(schema) {
    this.schema = schema;
    this.typeGenerators = {
      string: this.generateString.bind(this),
      boolean: this.generateBoolean.bind(this),
      number: this.generateNum.bind(this),
      integer: this.generateInt.bind(this),
      array: this.generateArray.bind(this),
      object: this.generateObject.bind(this),
      nested: this.generateNested.bind(this),
    };
  }

  generateInt({ min, max }) {
    throw "generateInt not implemented in generator";
  }

  generateNum({ min, max }) {
    throw "generateNum not implemented in generator";
  }

  generateBoolean() {
    throw "generateBoolean not implemented in generator";
  }

  generateString({ min, max }) {
    throw "generateString not implemented in generator";
  }

  generateArray({ min, max, inner }, options) {
    throw "generateString not implemented in generator";
  }

  generateObject({ key, value }, options) {
    throw "generateObject not implemented in generator";
  }

  generateNested({ schema }, options) {
    throw "generateObject not implemented in generator";
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
      const generate = this.typeGenerators[val.type];
      result[key] = generate(val, options);
    }
    return result;
  }

  generate(options) {
    return this._generate(this.schema, options);
  }
}

class DefaultGenerator extends Generator {
  constructor(schema) {
    super(schema);
  }

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
  generateInt({ min, max }) {
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
  generateNum({ min, max }) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Get a random boolean, true or false. Determined by
   * `Math.random()`.
   */
  generateBoolean() {
    return Math.random() < 0.5;
  }

  /**
   * Get a sentence with length within the range. Genrated
   * by lorem ipsum.
   * 
   * @param {Number} min Minimum length of the string, inclusive
   * @param {Number} max Maximum length of the string, inclusive
   */
  generateString({ min, max }) {
    return loremIpsum({
      count: this.generateInt({ min, max }),
      units: "words",
    });
  }

  generateArray({ min, max, inner }, options) {
    if (!inner.required && options.exlcudeOptional) {
      return [];
    }
    const innerType = inner.type;
    const generate = this.typeGenerators[innerType];
    const arrLength = this.generateInt({ min, max });
    let arr = [];
    for(let i = 0; i < arrLength; i++) {
      arr.push(generate(inner, options));
    }
    return arr;
  }

  generateObject({ key, value }, options) {
    const keyGenerate = this.typeGenerators[key.type];
    const valueGenerate = this.typeGenerators[value.type];
    const k = keyGenerate(key, options);
    const v = valueGenerate(value, options);
    return { [k]: v };
  }

  generateNested({ schema }, options) {
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
      const generate = this.typeGenerators[val.type];
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
  DefaultGenerator,
}