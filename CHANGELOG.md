# CHANGELOG

**v0.2.0:** **⚠️ BREAKING CHANGE**
- **Breaking change**: IDs change. Algorithm has been fine-tuned for better performance [[Issue #11](https://github.com/sqids/sqids-spec/issues/11)]
- Changed minimum Node.js version from 16 to 18
- `alphabet` cannot contain multibyte characters
- `minLength` upper limit has increased from alphabet length to `255`
- Max blocklist re-encoding attempts has been capped at the length of the alphabet - 1
- Minimum alphabet length has changed from 5 to 3
- `minValue()` and `maxValue()` functions have been removed
- Max integer encoding value is `Number.MAX_SAFE_INTEGER`

**v0.1.3:**
- Bug fix: spec update: blocklist filtering in uppercase-only alphabet [[PR #7](https://github.com/sqids/sqids-spec/pull/7)]
- Dev dependencies updated

**v0.1.2:**
- Bug fix: cjs import error [[PR #5](https://github.com/sqids/sqids-javascript/pull/5)]

**v0.1.1:**
- Packaging & cleanup

**v0.1.0:**
- Initial implementation of [the spec](https://github.com/sqids/sqids-spec)