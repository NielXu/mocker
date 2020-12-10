const BASIC_TYPES = [
  'string',
  'boolean',
  'number',
  'integer'
];

class Schema {
  constructor(schema) {
    this._schema = schema;
    this._jsonify = {
      nested: this._nestedAsJson.bind(this),
      object: this._objectAsJson.bind(this),
      array: this._arrayAsJson.bind(this),
    };
  }

  getSchema() {
    return this._schema;
  }

  summary() {
    let result = {}
    const keys = Object.keys(this._schema);
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = this._schema[key];
      if (BASIC_TYPES.includes(val.type)) {
        result[key] = val.type;
      } else {
        result[key] = this._jsonify[val.type](val);
      }
    }
    return result;
  }

  _objectAsJson(val) {
    if (BASIC_TYPES.includes(val.value.type)) {
      return { [val.key.type]: val.value.type };
    } else {
      return { [val.key.type]: this._jsonify[val.value.type](val.value) };
    }
  }

  _nestedAsJson(val) {
    return val.schema.summary();
  }

  _arrayAsJson(val) {
    if (BASIC_TYPES.includes(val.inner.type)) {
      return [val.inner.type];
    } else {
      return [ this._jsonify[val.inner.type](val.inner) ];
    }
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
