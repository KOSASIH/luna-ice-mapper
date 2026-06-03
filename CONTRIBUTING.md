# Contributing to Luna Ice Mapper

Thank you for your interest in contributing to the Luna Ice Mapper mission. This document provides guidelines for contributing to any aspect of this project — flight software, data processing, documentation, or hardware design.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Commit Standards](#commit-standards)
5. [Branch Naming](#branch-naming)
6. [Pull Request Process](#pull-request-process)
7. [Code Style](#code-style)
8. [Testing Requirements](#testing-requirements)
9. [Security Policy](#security-policy)

---

## Code of Conduct

All contributors must:
- Act professionally and respectfully
- Prioritize mission safety and data integrity above all else
- Follow NASA software engineering best practices where applicable
- Document all design decisions with rationale
- Never commit flight-critical changes without peer review

---

## Getting Started

### Prerequisites

```bash
python --version    # 3.10+
cmake --version     # 3.20+ (for firmware)
git --version       # 2.30+
node --version      # 18+ (for ground station UI)
```

### Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/<your-username>/luna-ice-mapper.git
cd luna-ice-mapper
git remote add upstream https://github.com/KOSASIH/luna-ice-mapper.git
git checkout -b feat/your-feature-name
```

### Install Dependencies

```bash
# Python — data processing
pip install -r software/data-processing/requirements.txt

# Firmware — C/C++
cd firmware && cmake -B build -DCMAKE_BUILD_TYPE=Debug

# Ground station — Node.js
npm install --prefix software/ground-station
```

---

## Development Workflow

1. **Pick an issue** — find one tagged `good first issue` or `help wanted`
2. **Comment** on the issue before starting major work
3. **Branch** — create from `main` using naming conventions below
4. **Develop** — follow code style guides
5. **Test** — ensure all tests pass
6. **Document** — update relevant docs
7. **PR** — open a pull request with the template complete

---

## Commit Standards

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `refactor` | Code change, no feature/fix |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration |
| `chore` | Maintenance tasks |
| `safety` | Flight safety critical change |

### Scopes
`firmware`, `fsw`, `comms`, `adcs`, `thermal`, `payload`, `ground-station`, `mission-control`, `data-processing`, `docs`, `tests`, `ci`

### Examples
```
feat(payload): add NIR camera hyperspectral calibration routine
fix(fsw): correct attitude quaternion normalization edge case
safety(adcs): add reaction wheel desaturation watchdog
docs(ops): update pass planning procedures for eclipse season
```

---

## Branch Naming

```
feat/<description>           # New features
fix/<issue-number>-<desc>    # Bug fixes
docs/<description>           # Documentation
test/<description>           # Tests
safety/<description>         # Flight safety changes (require 2 reviewers)
release/v<version>           # Release branches
hotfix/<description>         # Emergency fixes
```

---

## Pull Request Process

1. Fill out the PR template completely
2. Link the related issue with `Closes #<issue>`
3. All CI checks must pass (build, lint, test)
4. Tag at least one domain expert for review
5. **Safety-critical PRs** require 2 approvals from senior team
6. No force-push on shared branches
7. Squash or rebase before merge

---

## Code Style

### Python (Data Processing, Ground Station)
- Follow **PEP 8** with `black` formatter
- Type hints required for all public functions
- Docstrings in **Google style**
- Max line length: 100 characters

```python
def process_neutron_spectrum(
    raw_counts: np.ndarray,
    integration_time_s: float,
    dead_time_correction: bool = True,
) -> dict[str, float]:
    """Process raw neutron counts into calibrated flux values.

    Args:
        raw_counts: Array of raw detector counts per energy bin.
        integration_time_s: Integration duration in seconds.
        dead_time_correction: Apply dead-time correction if True.

    Returns:
        Dict with calibrated thermal and epithermal neutron fluxes.
    """
    ...
```

### C/C++ (Firmware / Flight Software)
- Follow **NASA C Coding Standard** and **MISRA-C:2012**
- Use `clang-format` with the provided `.clang-format` config
- All safety-critical functions: >90% branch coverage
- No dynamic memory allocation in flight-critical paths
- No recursion in interrupt handlers

### TypeScript (Ground Station UI)
- ESLint + Prettier configuration provided
- TypeScript strict mode enabled
- React functional components with hooks

---

## Testing Requirements

| Component | Minimum Coverage |
|-----------|------------------|
| Flight software (fsw) | 95% branch |
| Data processing pipeline | 85% line |
| Ground station backend | 80% line |
| Ground station UI | 70% line |

```bash
# Python unit tests
pytest tests/unit/ -v --cov=software

# Firmware unit tests (host target)
cd firmware/build && ctest --output-on-failure

# Integration tests
pytest tests/integration/ -v --sim-mode
```

---

## Security Policy

- **Never commit** credentials, API keys, or encryption keys
- Flight software signing keys are managed offline by CODEX only
- Report security issues via GitHub Security Advisories (private)
- Uplink command authentication codes are classified — never in this repo

---

*Luna Ice Mapper — Mapping the Moon's water, enabling humanity's future* 🌙
