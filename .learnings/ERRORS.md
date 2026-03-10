## ERRORS.md

## [ERR-20260306-001] web_search_freshness

**Logged**: 2026-03-06T10:03:00+05:30
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
web_search failed due to unsupported freshness parameter

### Error
```
unsupported_freshness
freshness is only supported by the Brave and Perplexity web_search providers.
```

### Context
- Command/operation attempted: web_search for "OpenAI announced GPT-5.4 release yesterday"
- Input/parameters: freshness=pd
- Environment: OpenClaw web_search tool

### Suggested Fix
Avoid freshness parameter unless provider supports it; retry without freshness.

### Metadata
- Reproducible: yes
- Related Files: N/A

---
