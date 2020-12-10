const Schema = require('../mocker/schema');
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
console.log(JSON.stringify(res.summary(), null, 2));

const m = new Mocker(res);
const o = { exlcudeOptional: true };
console.log(JSON.stringify(m.response(o), null, 2));
