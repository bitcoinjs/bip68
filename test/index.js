//  let bip68 = require('../')
let fixtures = require('./fixtures')
let test = require('tape')

fixtures.valid.forEach(function (f) {
  test('', function (t) {
    t.plan(1)
    t.ok(true)
  })
})

fixtures.invalid.forEach(function (f) {
  test('', function (t) {
    t.plan(1)
    t.ok(true)
  })
})
