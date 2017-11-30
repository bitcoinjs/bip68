let bip68 = require('../')
let fixtures = { valid: [], invalid: [] }

function binary (i) {
  return ('0'.repeat(32) + i.toString(2)).slice(-32)
}

function uint32hex (i) {
  return '0x' + ('00000000' + i.toString(16)).slice(-8)
}

function addSequence (i) {
  let result = {
    description: `${uint32hex(i)} (${binary(i)})`
  }
  Object.assign(result, bip68.decode(i), { sequence: i })
  if (result.blocks === undefined && result.seconds === undefined) {
    result.disabled = true
  }

  fixtures.valid.push(result)
}

for (let i = 0x00000000; i < 0x0000000f; ++i) addSequence(i)
for (let i = 0x0000fffc; i < 0x0001000f; ++i) addSequence(i)
for (let i = 0x003ffffc; i < 0x0040000f; ++i) addSequence(i)
for (let i = 0x0040fffc; i < 0x0041000f; ++i) addSequence(i)
for (let i = 0x7ffffffc; i < 0x8000000f; ++i) addSequence(i)

fixtures.invalid.push({
  blocks: 0x0000ffff,
  exception: 'Expected Number blocks < '
})
fixtures.invalid.push({
  blocks: 0x00010000,
  exception: 'Expected Number blocks < '
})
fixtures.invalid.push({
  blocks: null,
  exception: 'Expected Number blocks'
})
fixtures.invalid.push({
  seconds: 1,
  exception: 'Expected Number seconds as multiple of 512'
})
fixtures.invalid.push({
  seconds: 511,
  exception: 'Expected Number seconds as multiple of 512'
})
fixtures.invalid.push({
  seconds: 513,
  exception: 'Expected Number seconds as multiple of 512'
})
fixtures.invalid.push({
  seconds: 33554432,
  exception: 'Expected Number seconds < 33554432'
})
fixtures.invalid.push({
  seconds: null,
  exception: 'Expected Number seconds'
})

console.log(JSON.stringify(fixtures, null, 2))
