const BASIC_TYPES = [
  'string',
  'boolean',
  'number',
  'integer'
];

class Schema {
  constructor(schema) {
    this.schema = schema;
  }

  getSchema() {
    return this.schema;
  }

  asJson() {
    return JSON.stringify(this.schema, null, 2);
  }

  static string(required=true, min=1, max=9) {
    return { type: 'string', required: required, min: min, max: max };
  }

  static boolean(required=true) {
    return { type: 'boolean', required: required};
  }

  static number(required=true, min=1, max=9) {
    return { type: 'number', required: required, min: min, max: max };
  }

  static integer(required=true, min=1, max=9) {
    return { type: 'integer', required: required, min: min, max: max };
  }

  static array(e, required=true, min=1, max=9) {
    return { type: 'array', inner: e, required: required, min: min, max: max };
  }

  static object(k, v, required=true) {
    if (!BASIC_TYPES.includes(k.type)) {
      throw `Object key must be a basic type, one of ${BASIC_TYPES.join(',')}`;
    }
    return { type: 'object', key: k, value: v, required: required };
  }

  static nested(s, required=true) {
    return { type: 'nested', schema: s, required: required };
  }
}

module.exports = Schema;
