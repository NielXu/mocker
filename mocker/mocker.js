const { Generator } = require('./generator');

/**
 * Instantiate Mocker class to create a new mocker for each schema.
 * Mocker can generate mock responses or compare them with
 * the actual responses from the backend.
 */
class Mocker {

  /**
   * Construct a new Mocker with schema. The generated responses will
   * be based on this.
   * 
   * @param {Schema} schema The schema for the response
   */
  constructor(schema) {
    this.schema = schema;
    this.generator = new Generator(schema);
  }

  /**
   * Generate a mock response based on the schema provided to
   * this mocker, with some options.
   * 
   * `options.delay` `Number`: Return the response as a promise with delay
   * 
   * `options.exlcudeOptional` `Boolean`: Do not generate values for optional keys.
   * By default the mock response will include optional value for each
   * optional key. If `options.onlyIncludeOptional` is pvodied, this
   * option will have no effect.
   * 
   * **[NOT IMPL YET]** `options.onlyIncludeOptional` `Array`: An array of optional keys, the mock response
   * will generate values for them only but not the other optional keys. If the keys are
   * nested in schema, they should be in format `"foo.bar"`. An example will be 
   * `["key1", "key3", "out.in.key4", ...]`.
   * 
   * @param {Object} options Options for the response generation
   */
  response(options={}) {
    if (options.delay) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.generator.generate(options));
        }, options.delay);
      });
    } else {
      return this.generator.generate(options);
    }
  }
}

module.exports = Mocker;
