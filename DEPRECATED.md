# Deprecation Notice

This document provides migration information for anyone who was using or evaluating this version of the Dab Rite companion app.

## Why This Was Deprecated

`dabwithme-mobile` was an early prototype built during the exploration phase of connecting Dab Rite IR thermometers to mobile devices. While it proved the concept, it had limitations we wanted to address:

- UI was React Native standard components — we wanted Skia-native rendering for smoother, more precise custom gauges and temperature displays
- No voice/Siri integration — the new app adds Siri Bridge for hands-free temperature queries
- Expo SDK 53 was current at the time, but SDK 54 brought significant performance improvements
- Architecture lessons learned from this prototype were baked into the redesign

## Migration Path

### If You Were Evaluating This Repo

**Switch to [quartzos-app](https://github.com/joshuapointer/quartzos-app)**

- All active development has moved there
- It is the production-ready successor
- Same author, same project goals, better execution

### If You Forked or Cloned This Repo

1. **Do not open PRs here** — this repo is archived for reference
2. **Fork [quartzos-app](https://github.com/joshuapointer/quartzos-app) instead** — that's where contributions are welcome
3. **Key differences to expect:**
   - Different repo name (`quartzos-app` vs `dabwithme-mobile`)
   - Skia UI instead of standard React Native views
   - Expo SDK 54 instead of 53
   - Additional Siri Bridge and Shortcuts integration

### If You Need Something From This Version

This repo will remain readable but unmodifiable. If you need to reference specific implementation details:

- BLE permission setup: see `app.json` iOS/Android `permissions` blocks
- EAS configuration: see `eas.json`
- Expo Updates setup: see `app.json` `updates` and `runtimeVersion` fields

These patterns are largely preserved in `quartzos-app` but modernized.

## Timeline

- **Original development:** Early 2025
- **Deprecated in favor of quartzos-app:** May 2025
- **Repository status:** Archived for reference (not actively maintained)

## Questions?

For the actively maintained project, issues, and support, see [quartzos-app](https://github.com/joshuapointer/quartzos-app).

---

*This deprecation notice was added as part of a portfolio audit. The original code remains available for historical reference.*
