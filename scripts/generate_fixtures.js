let bip68 = require('../')
let fixtures = { valid: [], invalid: [] }

function binary (i) {
  return ('0'.repeat(32) + i.toString(2)).slice(-32)
}

function uint32hex (i) {
  return '0x' + ('00000000' + i.toString(16)).slice(-8)
}

function addFail (object) {
  try {
    bip68.encode(object)
  } catch (e) {
    fixtures.invalid.push(Object.assign({
      exception: e
    }, object))
    return
  }

  throw new Error(`No fail ${JSON.stringify(object)}`)
}

function addSequence (i) {
  let result = {
    description: `${uint32hex(i)} (${binary(i)})`
  }
  Object.assign(result, bip68.decode(i), { sequence: i })
  if (result.blocks === undefined && result.seconds === undefined) {
    result.disabled = true
  }

  if (!(i & ~0x0040ffff)) {
    result.strict = true
    bip68.encode(result) // enforces no throw
  }

  fixtures.valid.push(result)
}

for (let i = 0x00000000; i < 0x0000000f; ++i) addSequence(i)
for (let i = 0x0000fffc; i < 0x0001000f; ++i) addSequence(i)
for (let i = 0x003ffffc; i < 0x0040000f; ++i) addSequence(i)
for (let i = 0x0040fffc; i < 0x0041000f; ++i) addSequence(i)
for (let i = 0x7ffffffc; i < 0x8000000f; ++i) addSequence(i)
addSequence(0xffffffff)

addFail({ blocks: 0x00010000 })
addFail({ blocks: null })
addFail({ seconds: 1 })
addFail({ seconds: 511 })
addFail({ seconds: 513 })
addFail({ seconds: 33554431 })
addFail({ seconds: 33554432 })
addFail({ seconds: 33554433 })
addFail({ seconds: null })

console.log(JSON.stringify(fixtures, null, 2))
