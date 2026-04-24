'use strict'

const test = require('ava').default
const licenses = require('../lib/report/licenses')
const spdxIds = require('spdx-license-ids')
const spdxDeprecated = require('spdx-license-ids/deprecated')

// ─── Full SPDX coverage guard ───────────────────────────────────────────────

test('every canonical SPDX identifier classifies to a non-"unknown" bucket', t => {
  const unclassified = []
  for (const id of [...spdxIds, ...spdxDeprecated]) {
    if (licenses.classify(id) === 'unknown') unclassified.push(id)
  }
  t.deepEqual(unclassified, [], `${unclassified.length} SPDX ids fall through to 'unknown'`)
})

test('every canonical SPDX identifier resolves to a concrete pass/fail verdict', t => {
  const noVerdict = []
  for (const id of [...spdxIds, ...spdxDeprecated]) {
    if (licenses.evaluate(id) === null) noVerdict.push(id)
  }
  t.deepEqual(noVerdict, [], `${noVerdict.length} SPDX ids produce null verdicts`)
})

// ─── normalize() ────────────────────────────────────────────────────────────

test('normalize: returns null for nullish/empty input', t => {
  t.is(licenses.normalize(null), null)
  t.is(licenses.normalize(undefined), null)
  t.is(licenses.normalize(''), null)
  t.is(licenses.normalize('   '), null)
})

test('normalize: returns a canonical identifier untouched', t => {
  t.is(licenses.normalize('MIT'), 'MIT')
  t.is(licenses.normalize('Apache-2.0'), 'Apache-2.0')
  t.is(licenses.normalize('GPL-3.0-or-later'), 'GPL-3.0-or-later')
})

test('normalize: trims whitespace and strips enclosing parens', t => {
  t.is(licenses.normalize('  MIT  '), 'MIT')
  t.is(licenses.normalize('(MIT)'), 'MIT')
  t.is(licenses.normalize('( Apache-2.0 )'), 'Apache-2.0')
})

test('normalize: maps deprecated SPDX identifiers to canonical form', t => {
  t.is(licenses.normalize('GPL-2.0'), 'GPL-2.0-or-later')
  t.is(licenses.normalize('GPL-3.0'), 'GPL-3.0-or-later')
  t.is(licenses.normalize('LGPL-2.1'), 'LGPL-2.1-or-later')
  t.is(licenses.normalize('AGPL-3.0'), 'AGPL-3.0-or-later')
  // "+" short form
  t.is(licenses.normalize('GPL-2.0+'), 'GPL-2.0-or-later')
  t.is(licenses.normalize('LGPL-3.0+'), 'LGPL-3.0-or-later')
})

test('normalize: maps common non-canonical aliases', t => {
  t.is(licenses.normalize('MIT/X11'), 'MIT')
  t.is(licenses.normalize('Apache 2.0'), 'Apache-2.0')
  t.is(licenses.normalize('Apache-2'), 'Apache-2.0')
  t.is(licenses.normalize('BSD'), 'BSD-3-Clause')
  t.is(licenses.normalize('zlib/libpng'), 'Zlib')
  t.is(licenses.normalize('Unlicensed'), 'Unlicense')
})

test('normalize: preserves compound expressions and canonicalises each atom', t => {
  t.is(licenses.normalize('MIT OR Apache-2.0'), 'MIT OR Apache-2.0')
  t.is(licenses.normalize('(MIT OR Apache-2.0)'), 'MIT OR Apache-2.0')
  t.is(licenses.normalize('GPL-2.0 OR MIT'), 'GPL-2.0-or-later OR MIT')
  t.is(licenses.normalize('MIT/X11 OR Apache 2.0'), 'MIT OR Apache-2.0')
  // `WITH` keeps the canonical exception name.
  t.is(licenses.normalize('Apache-2.0 WITH LLVM-exception'), 'Apache-2.0 WITH LLVM-exception')
  // Lowercase operators are normalised to upper case.
  t.is(licenses.normalize('MIT or Apache-2.0'), 'MIT OR Apache-2.0')
})

// ─── evaluate() ─────────────────────────────────────────────────────────────

test('evaluate: permissive → pass', t => {
  for (const spdx of ['MIT', 'MIT-0', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause',
                       'Apache-1.0', 'Apache-1.1', 'Apache-2.0', '0BSD',
                       'BSL-1.0', 'PostgreSQL', 'Python-2.0', 'UPL-1.0',
                       'W3C', 'X11', 'Zlib']) {
    t.is(licenses.evaluate(spdx), true, spdx)
  }
})

test('evaluate: public-domain-like → pass', t => {
  t.is(licenses.evaluate('CC0-1.0'), true)
  t.is(licenses.evaluate('Unlicense'), true)
})

test('evaluate: weak copyleft that is accepted → pass', t => {
  t.is(licenses.evaluate('MPL-2.0'), true)
})

test('evaluate: weak copyleft that is restricted → fail', t => {
  for (const spdx of ['CDDL-1.0', 'EPL-1.0', 'EPL-2.0', 'MPL-1.1',
                       'LGPL-2.0-only', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
                       'LGPL-3.0-only', 'LGPL-3.0-or-later']) {
    t.is(licenses.evaluate(spdx), false, spdx)
  }
})

test('evaluate: strong copyleft → fail', t => {
  for (const spdx of ['GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only',
                       'GPL-3.0-or-later', 'AGPL-3.0-only', 'AGPL-3.0-or-later',
                       'SSPL-1.0']) {
    t.is(licenses.evaluate(spdx), false, spdx)
  }
})

test('evaluate: share-alike → fail', t => {
  t.is(licenses.evaluate('CC-BY-SA-3.0'), false)
  t.is(licenses.evaluate('CC-BY-SA-4.0'), false)
  t.is(licenses.evaluate('EUPL-1.2'), false)
  t.is(licenses.evaluate('Ruby'), false)
})

test('evaluate: non-OSI / restrictive clauses → fail', t => {
  for (const spdx of ['JSON', 'BSD-4-Clause', 'Sleepycat', 'Vim',
                       'Artistic-1.0', 'Artistic-1.0-Perl', 'Artistic-2.0',
                       'WTFPL']) {
    t.is(licenses.evaluate(spdx), false, spdx)
  }
})

test('evaluate: unknown SPDX → null', t => {
  t.is(licenses.evaluate('SomeProprietaryLicense-42'), null)
  t.is(licenses.evaluate('not-a-real-license'), null)
})

test('evaluate: nullish input → null', t => {
  t.is(licenses.evaluate(null), null)
  t.is(licenses.evaluate(undefined), null)
  t.is(licenses.evaluate(''), null)
})

test('evaluate: compound OR — any permissive atom passes', t => {
  t.is(licenses.evaluate('MIT OR Apache-2.0'), true)
  t.is(licenses.evaluate('GPL-3.0-only OR MIT'), true) // MIT lets you pick it
  t.is(licenses.evaluate('(WTFPL OR MIT)'), true)
})

test('evaluate: compound OR — all restricted atoms fails', t => {
  t.is(licenses.evaluate('GPL-2.0-only OR GPL-3.0-only'), false)
  t.is(licenses.evaluate('AGPL-3.0-or-later OR Sleepycat'), false)
})

test('evaluate: compound AND — any restricted atom fails', t => {
  t.is(licenses.evaluate('MIT AND GPL-3.0-only'), false)
  t.is(licenses.evaluate('Apache-2.0 AND JSON'), false)
})

test('evaluate: compound AND — all permissive passes', t => {
  t.is(licenses.evaluate('MIT AND Apache-2.0'), true)
  t.is(licenses.evaluate('MIT AND CC-BY-4.0'), true)
})

test('evaluate: compound WITH — takes base license disposition', t => {
  t.is(licenses.evaluate('Apache-2.0 WITH LLVM-exception'), true)
  t.is(licenses.evaluate('GPL-2.0-only WITH Classpath-exception-2.0'), false)
})

test('evaluate: deprecated identifiers resolve through normalize', t => {
  t.is(licenses.evaluate('GPL-2.0'), false)      // → GPL-2.0-or-later
  t.is(licenses.evaluate('GPL-3.0+'), false)     // → GPL-3.0-or-later
  t.is(licenses.evaluate('MIT/X11'), true)       // → MIT
  t.is(licenses.evaluate('Apache 2.0'), true)    // → Apache-2.0
})

// ─── classify() ─────────────────────────────────────────────────────────────

test('classify: returns the disposition bucket', t => {
  t.is(licenses.classify('MIT'), 'permissive')
  t.is(licenses.classify('Apache-2.0'), 'permissive')
  t.is(licenses.classify('CC0-1.0'), 'public-domain')
  t.is(licenses.classify('CC-BY-4.0'), 'docs-cc')
  t.is(licenses.classify('MPL-2.0'), 'weak-copyleft-ok')
  t.is(licenses.classify('LGPL-3.0-only'), 'weak-copyleft-restricted')
  t.is(licenses.classify('GPL-3.0-or-later'), 'strong-copyleft')
  t.is(licenses.classify('CC-BY-SA-4.0'), 'share-alike')
  t.is(licenses.classify('JSON'), 'non-osi')
  t.is(licenses.classify('totally-made-up'), 'unknown')
  t.is(licenses.classify('MIT OR Apache-2.0'), 'compound')
})

// ─── isKnown() ──────────────────────────────────────────────────────────────

test('isKnown: recognises both canonical and aliased identifiers', t => {
  t.true(licenses.isKnown('MIT'))
  t.true(licenses.isKnown('GPL-2.0'))            // aliased
  t.true(licenses.isKnown('MIT/X11'))            // aliased
  t.true(licenses.isKnown('MIT OR Apache-2.0'))  // compound of known atoms
  t.false(licenses.isKnown('NotARealLicense-1.0'))
  t.false(licenses.isKnown(null))
})
