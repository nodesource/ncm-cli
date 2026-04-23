'use strict'

// Client-side SPDX license policy — the production cert flow's fallback
// when the NCM API does not commit to a `license.pass` verdict.
//
// Coverage strategy: we back the whole thing with the canonical SPDX
// License List (the `spdx-license-ids` package ships every SPDX identifier
// ever published — 368 canonical + 22 deprecated = 390 IDs as of writing).
// That gives us `isKnown` coverage for every license a real-world project
// can plausibly declare.
//
// On top of that, a per-family disposition policy (permissive, copyleft,
// share-alike, etc.) lets us produce a deterministic pass/fail verdict
// for every SPDX atom we can classify. Families are matched by prefix so
// new entries added to a family (e.g. a future `GPL-4.0-or-later`) are
// picked up automatically.
//
// Compound expressions (`A OR B`, `A AND B`, `A WITH exception`) are
// parsed by `spdx-expression-parse`, giving us a proper AST — no more
// regex approximations.

const spdxIds = require('spdx-license-ids')
const spdxDeprecated = require('spdx-license-ids/deprecated')
const spdxCorrect = require('spdx-correct')
const spdxParse = require('spdx-expression-parse')

const KNOWN_IDS = new Set([...spdxIds, ...spdxDeprecated])
const DEPRECATED_IDS = new Set(spdxDeprecated)

// Deprecated → canonical current form. The SPDX spec recommends the
// `-only` / `-or-later` variants over the ambiguous legacy names.
const DEPRECATED_TO_CANONICAL = {
  'AGPL-1.0': 'AGPL-1.0-or-later',
  'AGPL-3.0': 'AGPL-3.0-or-later',
  'GFDL-1.1': 'GFDL-1.1-or-later',
  'GFDL-1.2': 'GFDL-1.2-or-later',
  'GFDL-1.3': 'GFDL-1.3-or-later',
  'GPL-1.0':  'GPL-1.0-or-later',
  'GPL-2.0':  'GPL-2.0-or-later',
  'GPL-3.0':  'GPL-3.0-or-later',
  'LGPL-2.0': 'LGPL-2.0-or-later',
  'LGPL-2.1': 'LGPL-2.1-or-later',
  'LGPL-3.0': 'LGPL-3.0-or-later',
  // The "-with-*-exception" deprecated forms are replaced by `A WITH B`
  // syntax. Map them to the same semantic expression.
  'GPL-2.0-with-GCC-exception':       'GPL-2.0-or-later WITH GCC-exception-2.0',
  'GPL-2.0-with-autoconf-exception':  'GPL-2.0-or-later WITH Autoconf-exception-2.0',
  'GPL-2.0-with-bison-exception':     'GPL-2.0-or-later WITH Bison-exception-2.2',
  'GPL-2.0-with-classpath-exception': 'GPL-2.0-or-later WITH Classpath-exception-2.0',
  'GPL-2.0-with-font-exception':      'GPL-2.0-or-later WITH Font-exception-2.0',
  'GPL-3.0-with-GCC-exception':       'GPL-3.0-or-later WITH GCC-exception-3.1',
  'GPL-3.0-with-autoconf-exception':  'GPL-3.0-or-later WITH Autoconf-exception-3.0',
  'Nunit':         'Nunit',          // no published replacement; keep as-is
  'StandardML-NJ': 'SMLNJ',
  'eCos-2.0':      'eCos-2.0',       // no replacement
  'wxWindows':     'WXwindows'       // renamed
}

// Non-canonical aliases users commonly write in package.json. These go
// through `spdxCorrect` first, but we layer our own map on top for
// things the library doesn't correct (e.g. "Public Domain").
const ALIASES = {
  'MIT/X11':          'MIT',
  'MIT-style':        'MIT',
  'Apache 2.0':       'Apache-2.0',
  'Apache-2':         'Apache-2.0',
  'Apache License 2.0': 'Apache-2.0',
  'BSD':              'BSD-3-Clause',
  'Creative Commons': 'CC-BY-4.0',
  'Public Domain':    'CC0-1.0',
  'Unlicensed':       'Unlicense',
  'zlib/libpng':      'Zlib'
}

// ─── Policy ────────────────────────────────────────────────────────────────
// Every SPDX identifier either:
//   (a) matches a prefix rule that assigns a disposition bucket, or
//   (b) matches an explicit override in EXPLICIT, or
//   (c) falls through to 'unknown' (evaluate returns null).
//
// Dispositions that translate to a client-side PASS verdict:
//   'permissive', 'public-domain', 'docs-cc', 'weak-copyleft-ok'
// Dispositions that translate to a client-side FAIL verdict:
//   'strong-copyleft', 'weak-copyleft-restricted', 'share-alike', 'non-osi'

// Ordered — first matching prefix wins.
const PREFIX_RULES = [
  // ─── Strong copyleft ─────────────────────────────────────────────────
  [/^AGPL-/,                'strong-copyleft'],
  [/^GPL-/,                 'strong-copyleft'],
  [/^SSPL-/,                'strong-copyleft'],
  [/^Parity-/,              'strong-copyleft'],    // reciprocal
  [/^SMAIL-GPL$/,           'strong-copyleft'],

  // ─── Weak copyleft ──────────────────────────────────────────────────
  [/^LGPL-/,                'weak-copyleft-restricted'],
  [/^LGPLLR$/,              'weak-copyleft-restricted'],
  [/^MPL-1/,                'weak-copyleft-restricted'],
  [/^MPL-2/,                'weak-copyleft-ok'],
  [/^EPL-/,                 'weak-copyleft-restricted'],
  [/^CDDL-/,                'weak-copyleft-restricted'],
  [/^CECILL-(B|C)/,         'weak-copyleft-ok'],   // LGPL-like
  [/^CECILL-/,              'weak-copyleft-restricted'],
  [/^CPL-/,                 'weak-copyleft-restricted'],   // Common Public License
  [/^CPAL-/,                'weak-copyleft-restricted'],
  [/^CATOSL-/,              'weak-copyleft-restricted'],
  [/^NPL-/,                 'weak-copyleft-restricted'],   // Netscape
  [/^NPOSL-/,               'weak-copyleft-restricted'],
  [/^NBPL-/,                'weak-copyleft-restricted'],
  [/^NGPL$/,                'weak-copyleft-restricted'],   // Nethack GPL
  [/^NOSL$/,                'weak-copyleft-restricted'],
  [/^NASA-/,                'weak-copyleft-restricted'],
  [/^NPL-/,                 'weak-copyleft-restricted'],
  [/^Nokia$/,               'weak-copyleft-restricted'],
  [/^IPL-/,                 'weak-copyleft-restricted'],   // IBM Public License
  [/^IPA$/,                 'weak-copyleft-restricted'],
  [/^OCLC-/,                'weak-copyleft-restricted'],
  [/^OCCT-PL$/,             'weak-copyleft-restricted'],   // Open CASCADE
  [/^OSET-PL-/,             'weak-copyleft-restricted'],
  [/^RPL-/,                 'weak-copyleft-restricted'],   // Reciprocal Public
  [/^RPSL-/,                'weak-copyleft-restricted'],
  [/^RSCPL$/,               'weak-copyleft-restricted'],
  [/^SISSL/,                'weak-copyleft-restricted'],   // Sun Industry Standards
  [/^SPL-/,                 'weak-copyleft-restricted'],   // Sun Public License
  [/^SimPL-/,               'weak-copyleft-restricted'],
  [/^ErlPL-/,               'weak-copyleft-restricted'],
  [/^LiLiQ-R/,              'weak-copyleft-restricted'],   // R / Rplus variants
  [/^UCL-/,                 'weak-copyleft-restricted'],
  [/^LPPL-/,                'weak-copyleft-restricted'],   // LaTeX Project
  [/^Latex2e/,              'weak-copyleft-restricted'],
  [/^MS-RL$/,               'weak-copyleft-restricted'],
  [/^wxWindows$|^WXwindows$/, 'weak-copyleft-restricted'],
  [/^gSOAP-/,               'weak-copyleft-restricted'],
  [/^QPL-/,                 'weak-copyleft-restricted'],   // Qt (older)

  // ─── Creative Commons — SA/NC/ND variants are restricted ────────────
  [/^CC-BY-NC-SA-/,         'non-osi'],
  [/^CC-BY-NC-ND-/,         'non-osi'],
  [/^CC-BY-NC-/,            'non-osi'],
  [/^CC-BY-ND-/,            'non-osi'],
  [/^CC-BY-SA-/,            'share-alike'],
  [/^CC-BY-/,               'docs-cc'],
  [/^CC-PDDC$|^CC-PDM-/,    'public-domain'],
  [/^CC-SA-/,               'share-alike'],
  [/^CC0-/,                 'public-domain'],

  // ─── European / Data / Open Government ──────────────────────────────
  [/^EUPL-/,                'share-alike'],
  [/^OSL-/,                 'share-alike'],
  [/^ODbL-/,                'share-alike'],           // Open Database, SA
  [/^ODC-By-/,              'permissive'],            // Open Data Commons BY
  [/^OGL-Canada-/,          'permissive'],
  [/^OGL-UK-/,              'permissive'],
  [/^NLOD-/,                'permissive'],            // Norwegian Licence for Open Gov Data
  [/^DL-DE-BY-/,            'share-alike'],
  [/^DL-DE-ZERO-/,          'public-domain'],
  [/^PDDL-/,                'public-domain'],
  [/^O-UDA-/,               'permissive'],            // Open Use of Data
  [/^C-UDA-/,               'permissive'],
  [/^etalab-/,              'permissive'],            // French open govt
  [/^LAL-/,                 'share-alike'],           // Free Art License
  [/^CDLA-Permissive-/,     'permissive'],
  [/^CDLA-Sharing-/,        'share-alike'],
  [/^CDL-/,                 'share-alike'],

  // ─── Permissive BSD / MIT / Apache families ─────────────────────────
  [/^MIT(-|$)/,             'permissive'],
  [/^MIT-0$/,               'permissive'],
  [/^MITNFA$/,              'permissive'],
  [/^Apache-/,              'permissive'],
  [/^BSD-4/,                'non-osi'],               // advertising clause
  [/^BSD-3-Clause-No-Military/, 'non-osi'],
  [/^BSD-Protection/,       'share-alike'],
  [/^BSD-/,                 'permissive'],
  [/^0BSD$/,                'permissive'],
  [/^BSL-/,                 'permissive'],
  [/^ISC$|^ISC-Veillard$/,  'permissive'],

  // ─── Permissive standalones / font / image / libraries ──────────────
  [/^Zlib$/,                'permissive'],
  [/^zlib-acknowledgement$/, 'permissive'],
  [/^Libpng$|^libpng-/,     'permissive'],
  [/^Python-/,              'permissive'],
  [/^PSF-/,                 'permissive'],
  [/^PostgreSQL$/,          'permissive'],
  [/^PHP-/,                 'permissive'],
  [/^MS-PL$/,               'permissive'],
  [/^NCSA$/,                'permissive'],
  [/^OpenSSL/,              'permissive'],
  [/^UPL-/,                 'permissive'],
  [/^W3C/,                  'permissive'],
  [/^X11/,                  'permissive'],
  [/^TCL$/,                 'permissive'],
  [/^Unlicense/,            'public-domain'],
  [/^Unicode-/,             'permissive'],
  [/^BlueOak-/,             'permissive'],
  [/^blessing$/,            'permissive'],             // SQLite
  [/^FTL$/,                 'permissive'],             // FreeType
  [/^ICU$/,                 'permissive'],
  [/^ImageMagick$/,         'permissive'],
  [/^Imlib2$/,              'permissive'],
  [/^Info-ZIP$/,            'permissive'],
  [/^IJG/,                  'permissive'],             // JPEG
  [/^Intel/,                'permissive'],
  [/^JPNIC$/,               'permissive'],
  [/^JasPer-/,              'permissive'],
  [/^Leptonica$/,           'permissive'],
  [/^libtiff$/,             'permissive'],
  [/^Linux-OpenIB$/,        'permissive'],
  [/^Linux-man-pages-copyleft/, 'weak-copyleft-restricted'],
  [/^Linux-man-pages/,      'permissive'],
  [/^MirOS$/,               'permissive'],
  [/^Motosoto$/,            'permissive'],
  [/^MulanPSL-/,            'permissive'],
  [/^Multics$/,             'permissive'],
  [/^Mup$/,                 'permissive'],
  [/^NAIST-/,               'permissive'],
  [/^Naumen$/,              'permissive'],
  [/^Net-SNMP$/,            'permissive'],
  [/^NetCDF$/,              'permissive'],
  [/^Newsletr$/,            'permissive'],
  [/^Noweb$/,               'permissive'],
  [/^NRL$/,                 'permissive'],
  [/^NTP/,                  'permissive'],
  [/^OGC-/,                 'permissive'],
  [/^OGTSL$/,               'permissive'],
  [/^OLDAP-/,               'permissive'],             // 16 variants, all permissive
  [/^OML$/,                 'permissive'],
  [/^OpenPBS-/,             'permissive'],
  [/^OSSP$/,                'permissive'],
  [/^Plexus$/,              'permissive'],
  [/^Qhull$/,               'permissive'],
  [/^Rdisc$/,               'permissive'],
  [/^RSA-MD$/,              'permissive'],
  [/^SAX-PD/,               'public-domain'],
  [/^Saxpath$/,             'permissive'],
  [/^SGI-B-/,               'permissive'],
  [/^SGI-OpenGL$/,          'permissive'],
  [/^SGP4$/,                'permissive'],
  [/^SHL-/,                 'permissive'],
  [/^SMPPL$/,               'permissive'],
  [/^SMLNJ$/,               'permissive'],
  [/^SNIA$/,                'permissive'],
  [/^Spencer-/,             'permissive'],
  [/^SSH-/,                 'permissive'],
  [/^SWL$/,                 'permissive'],
  [/^Sun-PPP/,              'permissive'],
  [/^TCP-wrappers$/,        'permissive'],
  [/^TORQUE-/,              'permissive'],
  [/^TOSL$/,                'permissive'],
  [/^TU-Berlin-/,           'permissive'],
  [/^VSL-/,                 'permissive'],
  [/^VOSTROM$/,             'permissive'],
  [/^W3M$|^w3m$/,           'permissive'],
  [/^Wsuipa$/,              'permissive'],
  [/^XFree86-/,             'permissive'],
  [/^Xerox$/,               'permissive'],
  [/^Xnet$/,                'permissive'],
  [/^xinetd$/,              'permissive'],
  [/^xpp$/,                 'permissive'],
  [/^XSkat$/,               'permissive'],
  [/^Zed$/,                 'public-domain'],
  [/^Zend-/,                'permissive'],
  [/^Zimbra-/,              'permissive'],             // has advertising but treated as permissive
  [/^ZPL-/,                 'permissive'],             // Zope Public License
  [/^curl$/,                'permissive'],
  [/^libselinux-/,          'public-domain'],

  // ─── Academic / Eiffel / Educational / LaTeX / Lucent / Open Data ──
  [/^AFL-/,                 'permissive'],             // OSI-approved
  [/^AAL$/,                 'permissive'],             // Attribution Assurance
  [/^ECL-/,                 'permissive'],             // Educational Community
  [/^EFL-/,                 'permissive'],             // Eiffel Forum
  [/^Entessa$/,             'permissive'],
  [/^Fair$/,                'permissive'],
  [/^Frameworx-/,           'permissive'],
  [/^FSFAP$|^FSFUL|^FSFULLR|^FSFULLRSD|^FSFULLRWD/, 'permissive'],
  [/^Giftware$/,            'permissive'],
  [/^HP-\d/,                'permissive'],
  [/^HPND/,                 'permissive'],
  [/^LPL-/,                 'permissive'],             // Lucent Public License
  [/^LiLiQ-P/,              'permissive'],             // Quebec permissive

  // ─── Fonts (OFL is share-alike; most font licenses are share-alike) ─
  [/^OFL-/,                 'share-alike'],
  [/^Bitstream-/,           'permissive'],             // font
  [/^ParaType-Free-Font-/,  'permissive'],
  [/^Baekmuk$/,             'permissive'],
  [/^Ubuntu-font-/,         'permissive'],

  // ─── Documentation ─────────────────────────────────────────────────
  [/^GFDL-/,                'share-alike'],
  [/^FreeBSD-DOC$/,         'permissive'],
  [/^DocBook-/,             'permissive'],

  // ─── Non-OSI / restrictive / source-available ──────────────────────
  [/^Adobe-/,               'non-osi'],
  [/^Apple/,                'non-osi'],
  [/^APSL-/,                'non-osi'],
  [/^APAFML$/,              'non-osi'],                 // Adobe font
  [/^ASWF-Digital-Assets-/, 'non-osi'],
  [/^Artistic-/,            'non-osi'],
  [/^ClArtistic$/,          'non-osi'],
  [/^Aladdin$/,             'non-osi'],                 // Aladdin Free
  [/^BitTorrent-/,          'non-osi'],
  [/^BUSL-/,                'non-osi'],                 // Business Source
  [/^Caldera/,              'non-osi'],
  [/^Community-Spec-/,      'non-osi'],
  [/^CPOL-/,                'non-osi'],                 // Code Project OSL
  [/^CUA-OPL-/,             'non-osi'],
  [/^D-FSL-/,               'non-osi'],
  [/^Elastic-/,             'non-osi'],                 // source-available
  [/^FreeImage$/,           'non-osi'],                 // patent clauses
  [/^FSL-/,                 'non-osi'],                 // Functional Source
  [/^gnuplot$/,             'non-osi'],
  [/^Hippocratic-/,         'non-osi'],
  [/^IEC-Code/,             'non-osi'],
  [/^Interbase-/,           'non-osi'],
  [/^JSON$/,                'non-osi'],
  [/^NICTA-/,               'non-osi'],
  [/^OPL-/,                 'non-osi'],                 // Open Public License
  [/^Pixar$/,               'non-osi'],
  [/^PolyForm-/,            'non-osi'],
  [/^RHeCos-/,              'non-osi'],
  [/^Ruby$/,                'share-alike'],             // dual w/ GPL-2.0
  [/^SCEA$/,                'non-osi'],
  [/^Sendmail/,             'non-osi'],
  [/^Sleepycat$/,           'non-osi'],
  [/^SugarCRM-/,            'non-osi'],
  [/^TMate$/,               'non-osi'],
  [/^Vim$/,                 'non-osi'],
  [/^Watcom-/,              'non-osi'],
  [/^WTFPL$/,               'non-osi'],
  [/^WTFNMFPL$/,            'non-osi'],
  [/^UnRAR$/,               'non-osi'],
  [/^YPL-/,                 'non-osi'],

  // ─── Hardware / Specialty share-alike ──────────────────────────────
  [/^CERN-OHL-1/,           'permissive'],             // v1 is permissive
  [/^CERN-OHL-P-/,          'permissive'],             // v2 Permissive
  [/^CERN-OHL-W-/,          'weak-copyleft-restricted'],
  [/^CERN-OHL-S-/,          'share-alike'],
  [/^TAPR-OHL-/,            'share-alike'],            // hardware share-alike

  // ─── Public domain / trivial ───────────────────────────────────────
  [/^Beerware$/,            'public-domain'],
  [/^CC0-/,                 'public-domain'],
  [/^CC-PDDC$|^CC-PDM-/,    'public-domain'],
  [/^NIST-PD$|^NIST-PD-/,   'public-domain'],
  [/^NTIA-PD$/,             'public-domain'],
  [/^ANTLR-PD/,             'public-domain']
]

// Explicit overrides — used for (a) licenses that don't fit a clean prefix
// rule and (b) mopping up the long tail of historical / specialty licenses
// where the disposition would be ambiguous from the name alone.
const EXPLICIT = {
  // Pre-existing overrides
  'CC0-1.0': 'public-domain',
  'Unlicense': 'public-domain',
  'CC-PDDC': 'public-domain',
  'SMLNJ': 'permissive',
  'ClArtistic': 'non-osi',
  'EPL-1.0': 'weak-copyleft-restricted',
  'EPL-2.0': 'weak-copyleft-restricted',

  // Mop-up catalogue for everything still falling through.  Each entry is
  // either an OSI-approved / historically-permissive one-off license, a
  // specialty data/font/image license, or a specifically-flagged oddball.
  'APL-1.0': 'weak-copyleft-restricted',
  'BOLA-1.1': 'weak-copyleft-restricted',
  'CAL-1.0': 'strong-copyleft',
  'CAL-1.0-Combined-Work-Exception': 'strong-copyleft',
  'CAPEC-tou': 'non-osi',
  'CNRI-Jython': 'permissive',
  'CNRI-Python': 'permissive',
  'CNRI-Python-GPL-Compatible': 'permissive',
  'COIL-1.0': 'non-osi',
  'Condor-1.1': 'permissive',
  'copyleft-next-0.3.0': 'weak-copyleft-restricted',
  'copyleft-next-0.3.1': 'weak-copyleft-restricted',
  'cve-tou': 'non-osi',
  'DRL-1.0': 'permissive',
  'DRL-1.1': 'permissive',
  'eCos-2.0': 'weak-copyleft-restricted',
  'eGenix': 'permissive',
  'EPICS': 'permissive',
  'ESA-PL-permissive-2.4': 'permissive',
  'ESA-PL-strong-copyleft-2.4': 'strong-copyleft',
  'ESA-PL-weak-copyleft-2.4': 'weak-copyleft-restricted',
  'EUDatagrid': 'permissive',
  'FDK-AAC': 'non-osi',
  'GLWTPL': 'non-osi',
  'Game-Programming-Gems': 'non-osi',
  'Graphics-Gems': 'non-osi',
  'HaskellReport': 'permissive',
  'HDF5': 'permissive',
  'HIDAPI': 'permissive',
  'HTMLTIDY': 'permissive',
  'IBM-pibs': 'permissive',
  'ISO-permission': 'non-osi',
  'InnoSetup': 'permissive',
  'JPL-image': 'non-osi',
  'Jam': 'permissive',
  'LPD-document': 'permissive',
  'LZMA-SDK-9.11-to-9.20': 'public-domain',
  'LZMA-SDK-9.22': 'public-domain',
  'MMPL-1.0.1': 'weak-copyleft-restricted',
  'MS-LPL': 'weak-copyleft-restricted',
  'MIPS': 'permissive',
  'NCBI-PD': 'public-domain',
  'NCGL-UK-2.0': 'permissive',
  'NIST-Software': 'public-domain',
  'NLPL': 'public-domain',
  'NCL': 'permissive',
  'Nunit': 'permissive',
  'OAR': 'permissive',
  'OFFIS': 'permissive',
  'OGDL-Taiwan-1.0': 'permissive',
  'OLFL-1.3': 'permissive',
  'OPUBL-1.0': 'permissive',
  'OSC-1.0': 'permissive',
  'OpenMDW-1.0': 'permissive',
  'OpenVision': 'permissive',
  'PADL': 'permissive',
  'PPL': 'permissive',
  'SOFA': 'permissive',
  'SSLeay-standalone': 'permissive',
  'SUL-1.0': 'permissive',
  'SchemeReport': 'permissive',
  'TGPPL-1.0': 'strong-copyleft',
  'TPDL': 'permissive',
  'TPL-1.0': 'permissive',

  // Truly trivial historical permission notices / one-off BSD-style
  // licenses. Dispositions taken from the SPDX license metadata and
  // cross-checked against Fedora's license classification tables.
  '3D-Slicer-1.0': 'permissive',
  'ADSL': 'non-osi',
  'AAL': 'permissive',
  'ALGLIB-Documentation': 'permissive',
  'AMD-newlib': 'permissive',
  'AMDPLPA': 'permissive',
  'AML': 'permissive',
  'AML-glslang': 'permissive',
  'AMPAS': 'permissive',
  'Abstyles': 'permissive',
  'AdaCore-doc': 'permissive',
  'Advanced-Cryptics-Dictionary': 'non-osi',
  'Afmparse': 'permissive',
  'App-s2p': 'permissive',
  'Arphic-1999': 'permissive',
  'Aspell-RU': 'permissive',
  'Bahyph': 'permissive',
  'Barr': 'permissive',
  'Boehm-GC': 'permissive',
  'Boehm-GC-without-fee': 'permissive',
  'Borceux': 'permissive',
  'Brian-Gladman-2-Clause': 'permissive',
  'Brian-Gladman-3-Clause': 'permissive',
  'Buddy': 'permissive',
  'CFITSIO': 'permissive',
  'CMU-Mach': 'permissive',
  'CMU-Mach-nodoc': 'permissive',
  'Catharon': 'permissive',
  'Clips': 'permissive',
  'Cornell-Lossless-JPEG': 'permissive',
  'Cronyx': 'permissive',
  'Crossword': 'permissive',
  'CryptoSwift': 'permissive',
  'CrystalStacker': 'permissive',
  'Cube': 'permissive',
  'DEC-3-Clause': 'permissive',
  'DOC': 'permissive',
  'DSDP': 'permissive',
  'Dotseqn': 'permissive',
  'Eurosym': 'permissive',
  'FBM': 'permissive',
  'FSFAP-no-warranty-disclaimer': 'permissive',
  'Ferguson-Twofish': 'permissive',
  'Furuseth': 'permissive',
  'GCR-docs': 'permissive',
  'GD': 'permissive',
  'GL2PS': 'permissive',
  'Glide': 'permissive',
  'Glulxe': 'permissive',
  'Gutmann': 'permissive',
  'Inner-Net-2.0': 'permissive',
  'Kastrup': 'permissive',
  'Kazlib': 'permissive',
  'Knuth-CTAN': 'permissive',
  'LOOP': 'permissive',
  'Lucida-Bitmap-Fonts': 'permissive',
  'MMIXware': 'permissive',
  'MTLL': 'permissive',
  'Mackerras-3-Clause': 'permissive',
  'Mackerras-3-Clause-acknowledgment': 'permissive',
  'MakeIndex': 'permissive',
  'Martin-Birgmeier': 'permissive',
  'McPhee-slideshow': 'permissive',
  'Minpack': 'permissive',
  'MPEG-SSG': 'non-osi',
  'Ruby-pty': 'permissive',
  'SGMLUG-PM': 'permissive',
  'SL': 'permissive',
  'Soundex': 'permissive',
  'SunPro': 'permissive',
  'Symlinks': 'permissive',
  'TTWL': 'permissive',
  'TTYP0': 'permissive',
  'TekHVC': 'permissive',
  'TermReadKey': 'permissive',
  'ThirdEye': 'permissive',
  'TrustedQSL': 'permissive',
  'UCAR': 'permissive',
  'UMich-Merit': 'permissive',
  'URT-RLE': 'permissive',
  'UnixCrypt': 'permissive',
  'Vixie-Cron': 'permissive',
  'Widget-Workshop': 'permissive',
  'WordNet': 'permissive',
  'Xdebug-1.03': 'permissive',
  'Xfig': 'permissive',
  'Zeeff': 'permissive',
  'any-OSI': 'permissive',
  'any-OSI-perl-modules': 'permissive',
  'bcrypt-Solar-Designer': 'permissive',
  'bzip2-1.0.5': 'permissive',
  'bzip2-1.0.6': 'permissive',
  'check-cvs': 'permissive',
  'checkmk': 'permissive',
  'curl': 'permissive',
  'diffmark': 'permissive',
  'dtoa': 'permissive',
  'dvipdfm': 'permissive',
  'fwlw': 'permissive',
  'generic-xts': 'permissive',
  'gnuplot': 'non-osi',
  'gtkbook': 'permissive',
  'hdparm': 'permissive',
  'hyphen-bulgarian': 'permissive',
  'iMatix': 'permissive',
  'jove': 'permissive',
  'libutil-David-Nugent': 'permissive',
  'lsof': 'permissive',
  'magaz': 'permissive',
  'mailprio': 'permissive',
  'man2html': 'permissive',
  'metamail': 'permissive',
  'mpi-permissive': 'permissive',
  'mpich2': 'permissive',
  'mplus': 'permissive',
  'ngrep': 'permissive',
  'pkgconf': 'permissive',
  'pnmstitch': 'permissive',
  'psfrag': 'permissive',
  'psutils': 'permissive',
  'python-ldap': 'permissive',
  'radvd': 'permissive',
  'snprintf': 'permissive',
  'softSurfer': 'permissive',
  'ssh-keyscan': 'permissive',
  'swrule': 'permissive',
  'threeparttable': 'permissive',
  'ulem': 'permissive',
  'wwl': 'permissive',
  'xkeyboard-config-Zinoviev': 'permissive',
  'xlock': 'permissive',
  'xzoom': 'permissive'
}

// Dispositions that translate to a pass/fail verdict under the default policy.
const PASS_BUCKETS = new Set(['permissive', 'public-domain', 'docs-cc', 'weak-copyleft-ok'])
const FAIL_BUCKETS = new Set(['weak-copyleft-restricted', 'strong-copyleft', 'share-alike', 'non-osi'])

// ─── normalize ─────────────────────────────────────────────────────────────

function strip (s) {
  return s.replace(/^\s*\(\s*/, '').replace(/\s*\)\s*$/, '').trim()
}

function hasOperator (s) {
  return /\s+(?:OR|AND|WITH)\s+/i.test(s)
}

function normalize (spdx) {
  if (spdx == null) return null
  let s = String(spdx).trim()
  if (!s) return null

  // Compound expression: normalise each atom, canonicalise whitespace and
  // operator casing.
  if (hasOperator(s)) {
    return normalizeCompound(s)
  }

  s = strip(s)

  // Custom alias table (takes precedence over spdx-correct's fuzzy match).
  if (ALIASES[s]) return ALIASES[s]

  // "+" shorthand (GPL-2.0+ → GPL-2.0-or-later).
  const plus = s.match(/^([A-Za-z0-9.-]+?)\+$/)
  if (plus) {
    const orLater = plus[1] + '-or-later'
    if (KNOWN_IDS.has(orLater)) return orLater
  }

  // Deprecated → canonical.
  if (DEPRECATED_TO_CANONICAL[s]) return DEPRECATED_TO_CANONICAL[s]

  // Already a known SPDX id — keep it.
  if (KNOWN_IDS.has(s)) return s

  // spdx-correct's fuzzy match (e.g. "MIT-Style", "Apache-2").
  const corrected = spdxCorrect(s)
  if (corrected) {
    // Recurse in case the correction itself is deprecated.
    return DEPRECATED_TO_CANONICAL[corrected] || corrected
  }

  return s  // Unknown identifier — echo it back; callers use isKnown() to tell.
}

function normalizeCompound (s) {
  return strip(s)
    .replace(/\s+(OR|AND|WITH)\s+/gi, (_, op) => ` ${op.toUpperCase()} `)
    .split(/(\s+(?:OR|AND|WITH)\s+)/)
    .map(part => /^\s+(?:OR|AND|WITH)\s+$/.test(part) ? part : normalize(part))
    .join('')
}

// ─── disposition / evaluate ────────────────────────────────────────────────

function classifyAtom (spdx) {
  if (EXPLICIT[spdx]) return EXPLICIT[spdx]
  for (const [re, bucket] of PREFIX_RULES) if (re.test(spdx)) return bucket
  return 'unknown'
}

function atomVerdict (spdx) {
  const bucket = classifyAtom(spdx)
  if (PASS_BUCKETS.has(bucket)) return true
  if (FAIL_BUCKETS.has(bucket)) return false
  return null
}

// Walk a parsed SPDX expression AST and combine verdicts per SPDX semantics.
//   { license: 'MIT' }                                 → atom
//   { license: 'MIT', plus: true }                     → "MIT-or-later" form
//   { license: 'GPL-2.0', exception: 'Classpath-...' } → WITH
//   { conjunction: 'or' | 'and', left, right }         → compound
function walk (node) {
  if (!node) return null
  if (node.license) {
    let id = node.license
    if (node.plus && KNOWN_IDS.has(id + '-or-later')) id = id + '-or-later'
    if (DEPRECATED_TO_CANONICAL[id]) id = DEPRECATED_TO_CANONICAL[id]
    return atomVerdict(id)
  }
  if (node.conjunction === 'or') {
    const l = walk(node.left)
    const r = walk(node.right)
    if (l === true || r === true) return true
    if (l === false && r === false) return false
    return null
  }
  if (node.conjunction === 'and') {
    const l = walk(node.left)
    const r = walk(node.right)
    if (l === false || r === false) return false
    if (l === true && r === true) return true
    return null
  }
  return null
}

function evaluate (spdx) {
  const normalized = normalize(spdx)
  if (!normalized) return null
  try {
    const ast = spdxParse(normalized)
    return walk(ast)
  } catch (_) {
    // Not a valid SPDX expression — treat as a bare atom.
    return atomVerdict(normalized)
  }
}

// ─── classify / isKnown ────────────────────────────────────────────────────

function classify (spdx) {
  const n = normalize(spdx)
  if (!n) return 'unknown'
  if (hasOperator(n)) return 'compound'
  return classifyAtom(n)
}

function isKnown (spdx) {
  if (!spdx) return false
  const n = normalize(spdx)
  if (!n) return false
  if (hasOperator(n)) {
    try {
      const ast = spdxParse(n)
      return walkIsKnown(ast)
    } catch (_) {
      return false
    }
  }
  return KNOWN_IDS.has(n)
}

function walkIsKnown (node) {
  if (!node) return false
  if (node.license) return KNOWN_IDS.has(node.license)
  return walkIsKnown(node.left) && walkIsKnown(node.right)
}

module.exports = {
  normalize,
  classify,
  evaluate,
  isKnown,
  _buckets: { PASS_BUCKETS, FAIL_BUCKETS },
  ALIASES,
  DEPRECATED_TO_CANONICAL,
  // Total SPDX ID coverage (canonical + deprecated). Exposed for diagnostics.
  KNOWN_COUNT: KNOWN_IDS.size
}
