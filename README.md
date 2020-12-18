# Mocker
Mocker is a lightweight tool for mocking backend responses based on different schemas.

# Usage
Define a schema for the mocker and run it.

```javascript
const Schema = require('mocker/schema');
const Mocker = require('../mocker/mocker');

const user = new Schema({
  first_name: Schema.string(),
  last_name: Schema.string(),
  address: Schema.string(),
  code: Schema.array(Schema.integer(false)),
});

const res = new Schema({
  mapping: Schema.object(Schema.string(true, 1, 1), Schema.boolean()),
  status: Schema.integer(),
  data: Schema.array(Schema.nested(user)),
});

let mocker = new Mocker(res);
let response = mocker.response({ exlcudeOptional: true });
```

The output will be:
```javascript
{
  "mapping": {
    "incididunt": true
  },
  "status": 7,
  "data": [
    {
      "first_name": "proident officia adipisicing minim",
      "last_name": "minim",
      "address": "sunt ut sunt",
      "code": []
    },
    {
      "first_name": "labore quis amet",
      "last_name": "nulla mollit occaecat nostrud minim laboris",
      "address": "amet aute excepteur",
      "code": []
    },
    {
      "first_name": "do sunt ad",
      "last_name": "aute ex laborum occaecat aute tempor nisi qui ipsum",
      "address": "enim",
      "code": []
    },
    {
      "first_name": "deserunt pariatur aute esse quis",
      "last_name": "dolore labore",
      "address": "deserunt mollit exercitation",
      "code": []
    },
    {
      "first_name": "in nisi amet nulla sint",
      "last_name": "nisi qui deserunt non",
      "address": "excepteur proident in cillum non",
      "code": []
    }
  ]
}
```

# Options
There are some options that you can use in this way

```javascript
mocker.response({ option_name: option_value, ... });
```

- `delay`: Return the response wrapped in a `Promise` after the given amount of milliseconds
- `exlcudeOptional=false`: Do not include fields in the response that are not required in the schema.


# Schema Types
- `Schema.string(required=true, min=1, max=9)`: The field type represents a string. The default implementation uses [Lorem-Ipsum](https://github.com/knicklabs/lorem-ipsum.js) to generate a random string with a random number of words within the given range.
  - `required=true`: Whether or not this field is required in the response
  - `min=1`: Min length of the random generated string (inclsuive)
  - `max=9`: Max length of the random generated string (inclusive)

- `Schema.boolean(required=true)`: The field type represents a boolean. The default implementation generates a number within 0~1 and return `true` if it is greater than 0.5.
  - `required=true`: Whether or not this field is required in the response

- `Schema.number(required=true, min=1, max=9)`: The field type represents a float number. The default implementation generates a number based on `Math.random()`. **Note:** the min value cannot be less than 0.
  - `required=true`: Whether or not this field is required in the response
  - `min=1`: Min value, cannot be less than 0 (inclusive)
  - `max=9`: Max value (inclusive)

- `Schema.integer(required=true, min=1, max=9)`: The field type represents an integer. The default implementation generates an integer based on `Math.random()`, `Math.ceil()` and `Math.floor()`.
  - `required=true`: Whether or not this field is required in the response
  - `min=1`: Min value (inclusive)
  - `max=9`: Max value (inclusive)

- `Schema.array(e, required=true, min=1, max=9)`: The field type represents an array. A type must be passed in as a required parameter and the generation of the array will be based on it. The array will have a random length within the given range.
  - `e`: A schema type. Can be any type even the `Schema.array` itself.
  - `required=true`: Whether or not this field is required in the response
  - `min=1`: Min length of the generated array (inclsuive)
  - `max=9`: Max length of the generated array (inclusive)

- `Schema.object(k, v, required=true)`: The field type represents an object. A key type and a value type must be passed in as the required parameters. The generation of the object will be based on the types, the key will be based on the key type and the value will be based on the value type. **Note:** The key type must be a simple type, i.e. `Schema.string`, `Schema.boolean`, `Schema.number` and `Schema.integer`.
  - `k`: A simple schema type.
  - `v`: A schema type. Can be any type even the `Schema.object` itself.
  - `required=true`: Whether or not this field is required in the response


# Customization

### Generator
Generator will be used to generate the mock responses based on the schema types. `DefaultGenerator` is provided if no generator is specified.

To use a custom generator, simply implement the `Generator` class:

```javascript
const { Generator, DefaultGenerator } = require('./generator');

class CustomGenerator extends Generator {
  constructor(schema) {
    super(schema);
  }
  ...
}

or 

class ExtendGenerator extends DefaultGenerator {
  constructor(schema) {
    super(schema);
  }
  ...
}
```

There are some functions that need to be implemented if extending the `Generator` class since it is only an abstract class.

- `generateInt`
- `generateNum`
- `generateBoolean`
- `generateString`
- `generateArray` 
- `generateObject`
- `generateNested`

To apply a custom generator to the mocker:

```javascript
let mocker = new Mocker(schema, CustomGenerator);
let response = mocker.response();
```

### Types
TODO: Custom types