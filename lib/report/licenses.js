'use strict'

// Client-side SPDX license policy.
//
// The authoritative license verdict comes from the NCM API as a score with
// `{ name: 'license', pass: true|false, data: { spdx } }`. Historically the
// CLI simply rendered whatever the server sent and fell back to the literal
// string "UNKNOWN" if `data.spdx` was absent — which meant non-canonical
// SPDX strings (e.g. `MIT/X11`), deprecated identifiers (e.g. `GPL-2.0`),
// compound expressions (e.g. `MIT OR Apache-2.0`) and packages the API had
// no opinion on were all funneled into the same "UNKNOWN" bucket.
//
// This module adds:
//
//   normalize(spdx)       — canonicalise a raw SPDX string
//   classify(spdx)        — bucket the license into a disposition category
//   evaluate(spdx)        — return true / false / null for pass / fail / unknown
//                           under a standard permissive-corporate policy
//   isKnown(spdx)         — whether the identifier is recognised at all
//
// `evaluate` is used as a FALLBACK in the cert flow: when the server does
// not provide a `license.pass` verdict (but does provide an SPDX), the CLI
// can still reach a deterministic decision locally.  When the server does
// provide a verdict, it always wins.

// ─── Disposition buckets ────────────────────────────────────────────────────
// PERMISSIVE + PUBLIC_DOMAIN + DOCS_CC → pass
// WEAK_COPYLEFT_OK                     → pass (permissive enough — MPL-2.0)
// WEAK_COPYLEFT_RESTRICTED             → fail
// STRONG_COPYLEFT                      → fail
// NON_OSI                              → fail
// SHARE_ALIKE                          → fail

const PERMISSIVE = new Set([
  '0BSD', 'Apache-1.0', 'Apache-1.1', 'Apache-2.0',
  'BSD-2-Clause', 'BSD-2-Clause-Patent', 'BSD-2-Clause-Views',
  'BSD-3-Clause', 'BSD-3-Clause-Clear', 'BSD-3-Clause-No-Nuclear-License',
  'BSL-1.0',
  'ISC',
  'Libpng', 'libpng-2.0',
  'MIT', 'MIT-0', 'MITNFA', 'MIT-CMU', 'MIT-feh',
  'MS-PL',
  'NCSA',
  'OpenSSL',
  'PostgreSQL',
  'Python-2.0', 'Python-2.0.1',
  'TCL',
  'UPL-1.0',
  'W3C', 'W3C-19980720', 'W3C-20150513',
  'X11',
  'Zlib', 'Zlib-acknowledgement'
])

const PUBLIC_DOMAIN = new Set([
  'CC0-1.0',
  'Unlicense',
  'WTFPL' // placed here contextually, but see RESTRICTED — org policy often bans it
])

const DOCS_CC = new Set([
  'CC-BY-1.0', 'CC-BY-2.0', 'CC-BY-2.5', 'CC-BY-3.0', 'CC-BY-4.0'
])

const WEAK_COPYLEFT_OK = new Set([
  'MPL-2.0'
])

const WEAK_COPYLEFT_RESTRICTED = new Set([
  'CDDL-1.0', 'CDDL-1.1',
  'EPL-1.0', 'EPL-2.0',
  'LGPL-2.0-only', 'LGPL-2.0-or-later',
  'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later',
  'MPL-1.0', 'MPL-1.1'
])

const STRONG_COPYLEFT = new Set([
  'AGPL-1.0-only', 'AGPL-1.0-or-later',
  'AGPL-3.0-only', 'AGPL-3.0-or-later',
  'GPL-1.0-only', 'GPL-1.0-or-later',
  'GPL-2.0-only', 'GPL-2.0-or-later',
  'GPL-3.0-only', 'GPL-3.0-or-later',
  'SSPL-1.0'
])

const SHARE_ALIKE = new Set([
  'CC-BY-SA-1.0', 'CC-BY-SA-2.0', 'CC-BY-SA-2.5',
  'CC-BY-SA-3.0', 'CC-BY-SA-4.0',
  'EUPL-1.0', 'EUPL-1.1', 'EUPL-1.2',
  'Ruby',
  'OFL-1.0', 'OFL-1.1'
])

const NON_OSI = new Set([
  // Licenses with clauses that standard corporate policies reject.
  'Artistic-1.0', 'Artistic-1.0-cl8', 'Artistic-1.0-Perl', 'Artistic-2.0',
  'BSD-4-Clause', 'BSD-4-Clause-UC', // advertising clause — GPL-incompatible
  'CC-BY-NC-1.0', 'CC-BY-NC-2.0', 'CC-BY-NC-2.5', 'CC-BY-NC-3.0', 'CC-BY-NC-4.0',
  'CC-BY-NC-ND-1.0', 'CC-BY-NC-ND-2.0', 'CC-BY-NC-ND-2.5', 'CC-BY-NC-ND-3.0', 'CC-BY-NC-ND-4.0',
  'CC-BY-NC-SA-1.0', 'CC-BY-NC-SA-2.0', 'CC-BY-NC-SA-2.5', 'CC-BY-NC-SA-3.0', 'CC-BY-NC-SA-4.0',
  'CC-BY-ND-1.0', 'CC-BY-ND-2.0', 'CC-BY-ND-2.5', 'CC-BY-ND-3.0', 'CC-BY-ND-4.0',
  'JSON',                         // "good, not evil" clause
  'Sleepycat',
  'Vim',                          // charitable-donation clause
  'WTFPL'                         // borderline; many orgs reject it
])

// ─── Deprecated / non-canonical → canonical aliases ────────────────────────
// Left side is what we might see in the wild; right side is the canonical
// SPDX identifier we normalise to.
const ALIASES = {
  // Legacy naming (dropped in SPDX 3.0+, still emitted by older tools).
  'GPL-1.0': 'GPL-1.0-or-later',
  'GPL-2.0': 'GPL-2.0-or-later',
  'GPL-2.0+': 'GPL-2.0-or-later',
  'GPL-3.0': 'GPL-3.0-or-later',
  'GPL-3.0+': 'GPL-3.0-or-later',
  'LGPL-2.0': 'LGPL-2.0-or-later',
  'LGPL-2.0+': 'LGPL-2.0-or-later',
  'LGPL-2.1': 'LGPL-2.1-or-later',
  'LGPL-2.1+': 'LGPL-2.1-or-later',
  'LGPL-3.0': 'LGPL-3.0-or-later',
  'LGPL-3.0+': 'LGPL-3.0-or-later',
  'AGPL-1.0': 'AGPL-1.0-or-later',
  'AGPL-3.0': 'AGPL-3.0-or-later',
  'AGPL-3.0+': 'AGPL-3.0-or-later',
  // Common aliases people still write.
  'MIT/X11': 'MIT',
  'Apache 2.0': 'Apache-2.0',
  'Apache-2': 'Apache-2.0',
  'BSD': 'BSD-3-Clause',         // ambiguous; default to the most common form
  'Creative Commons': 'CC-BY-4.0',
  'Public Domain': 'CC0-1.0',
  'Unlicensed': 'Unlicense',     // typo; note: `UNLICENSED` (all-caps) is npm's
                                 // convention for private packages — kept as-is
  'zlib/libpng': 'Zlib'
}

// Stripped before any lookup: leading/trailing parens, trailing "+" marker,
// and whitespace.
function strip (s) {
  return s.replace(/^\s*\(\s*/, '').replace(/\s*\)\s*$/, '').trim()
}

function normalize (spdx) {
  if (spdx == null) return null
  let s = String(spdx).trim()
  if (!s) return null

  // Compound: leave operators but canonicalise each part.
  if (isCompound(s)) {
    return normalizeCompound(s)
  }

  s = strip(s)
  if (ALIASES[s]) return ALIASES[s]
  // "GPL-2.0+" → "GPL-2.0-or-later" style shortcut
  const plusMatch = s.match(/^([A-Za-z0-9.-]+?)\+$/)
  if (plusMatch) {
    const orLater = plusMatch[1] + '-or-later'
    if (isKnown(orLater)) return orLater
  }
  return s
}

function isCompound (s) {
  return /\s+(OR|AND|WITH)\s+/i.test(s)
}

function normalizeCompound (s) {
  return strip(s).replace(/\s+(OR|AND|WITH)\s+/gi, (_, op) => ` ${op.toUpperCase()} `)
    .split(/(\s+(?:OR|AND|WITH)\s+)/)
    .map(part => /^\s+(?:OR|AND|WITH)\s+$/.test(part) ? part : normalize(part))
    .join('')
}

function isKnown (spdx) {
  if (!spdx) return false
  const s = normalize(spdx)
  if (isCompound(s)) {
    return compoundParts(s).every(isKnown)
  }
  return PERMISSIVE.has(s) ||
         PUBLIC_DOMAIN.has(s) ||
         DOCS_CC.has(s) ||
         WEAK_COPYLEFT_OK.has(s) ||
         WEAK_COPYLEFT_RESTRICTED.has(s) ||
         STRONG_COPYLEFT.has(s) ||
         SHARE_ALIKE.has(s) ||
         NON_OSI.has(s)
}

function compoundParts (s) {
  return strip(s).split(/\s+(?:OR|AND|WITH)\s+/i).map(p => strip(p)).filter(Boolean)
}

function compoundOperator (s) {
  const m = strip(s).match(/\s+(OR|AND|WITH)\s+/i)
  return m ? m[1].toUpperCase() : null
}

// Disposition bucket for a SINGLE (non-compound) SPDX identifier.
function classifyAtom (spdx) {
  if (PERMISSIVE.has(spdx)) return 'permissive'
  if (PUBLIC_DOMAIN.has(spdx)) return 'public-domain'
  if (DOCS_CC.has(spdx)) return 'docs-cc'
  if (WEAK_COPYLEFT_OK.has(spdx)) return 'weak-copyleft-ok'
  if (WEAK_COPYLEFT_RESTRICTED.has(spdx)) return 'weak-copyleft-restricted'
  if (STRONG_COPYLEFT.has(spdx)) return 'strong-copyleft'
  if (SHARE_ALIKE.has(spdx)) return 'share-alike'
  if (NON_OSI.has(spdx)) return 'non-osi'
  return 'unknown'
}

// Per-atom verdict. `WTFPL` is deliberately listed in both PUBLIC_DOMAIN
// (categorical) and NON_OSI (policy) — policy wins for the verdict.
function atomVerdict (spdx) {
  if (NON_OSI.has(spdx)) return false
  if (STRONG_COPYLEFT.has(spdx)) return false
  if (SHARE_ALIKE.has(spdx)) return false
  if (WEAK_COPYLEFT_RESTRICTED.has(spdx)) return false
  if (PERMISSIVE.has(spdx)) return true
  if (PUBLIC_DOMAIN.has(spdx)) return true
  if (DOCS_CC.has(spdx)) return true
  if (WEAK_COPYLEFT_OK.has(spdx)) return true
  return null
}

// Compound expressions follow SPDX semantics:
//   A OR B  — licensee picks one, so pass if ANY part passes
//   A AND B — licensee must satisfy all, so pass only if ALL parts pass
//   A WITH E — treat as A (the exception E narrows rights but doesn't change
//              the base license disposition under the default policy)
function evaluate (spdx) {
  const normalized = normalize(spdx)
  if (!normalized) return null
  if (!isCompound(normalized)) return atomVerdict(normalized)

  const parts = compoundParts(normalized).map(evaluate)
  const op = compoundOperator(normalized)

  if (op === 'OR') {
    if (parts.some(v => v === true)) return true
    if (parts.every(v => v === false)) return false
    return null
  }
  if (op === 'AND') {
    if (parts.some(v => v === false)) return false
    if (parts.every(v => v === true)) return true
    return null
  }
  if (op === 'WITH') {
    // `base WITH exception` — use the base license's disposition.
    return parts[0]
  }
  return null
}

function classify (spdx) {
  const n = normalize(spdx)
  if (!n) return 'unknown'
  if (!isCompound(n)) return classifyAtom(n)
  // A compound expression doesn't map to a single bucket cleanly; return
  // the bucket of the first atom for display/telemetry, or 'compound' if
  // callers want to special-case.
  return 'compound'
}

module.exports = {
  normalize,
  classify,
  evaluate,
  isKnown,
  // Exposed for testing / callers that want to inspect the policy tables.
  _buckets: {
    PERMISSIVE, PUBLIC_DOMAIN, DOCS_CC,
    WEAK_COPYLEFT_OK, WEAK_COPYLEFT_RESTRICTED,
    STRONG_COPYLEFT, SHARE_ALIKE, NON_OSI
  },
  ALIASES
}
