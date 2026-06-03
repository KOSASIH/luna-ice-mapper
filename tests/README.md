# Tests

## Unit Tests

Unit tests for individual software modules.

```bash
# Python
pytest tests/unit/ -v --cov=software

# Firmware (host build)
cd firmware/build && ctest -R unit_ --output-on-failure
```

**Coverage targets:**
- Flight software: 95% MC/DC
- Data processing: 85% line
- Ground station backend: 80% line

## Integration Tests

```bash
pytest tests/integration/ -v --sim-mode
```

Requires flat-sat simulator or software simulation harness.

## System Tests

Full end-to-end system tests run against the flat-sat testbed (Phase 4+).

See `docs/testing/test-plan.md` for full details.

---
*Owned by VERITAS • Luna Ice Mapper*
