let bip68 = require('../')
let fixtures = require('./fixtures')
let test = require('tape')

fixtures.valid.forEach(function (f) {
  test(f.description, function (t) {
    let decode = bip68.decode(f.sequence)
    let empty = Object.keys(decode).length === 0

    if (f.disabled) {
      t.same(empty, f.disabled, 'disabled')
    } else {
      if (f.blocks !== undefined) t.same(decode.blocks, f.blocks, 'blocks as expected')
      if (f.seconds !== undefined) t.same(decode.seconds, f.seconds, 'seconds as expected')
    }

    if (f.strict) {
      t.same(bip68.encode(f), f.sequence, 'sequence as expected')
    }

    t.end()
  })
})

fixtures.invalid.forEach(function (f) {
  test(f.exception, function (t) {
    t.plan(1)

    t.throws(function () {
      bip68.encode(f)
    }, new RegExp(f.exception))
  })
})
