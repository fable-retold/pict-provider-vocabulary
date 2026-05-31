# Pict Provider Vocabulary

> Vocabulary and glossary term management for Pict applications

Holds a term index, hands out a resolver callback for [pict-section-content](https://fable-retold.github.io/pict-section-content/)'s markdown auto-linking, and wires hover popovers onto the rendered terms. Works with any term source — filesystem, database, or API.

- **Term Index** — Load `{ slug: { title, short } }` terms from an object, a URL, or your own code
- **Markdown Auto-Linking** — A resolver callback for `parseMarkdown()` that wraps known terms automatically
- **Hover Popovers** — Positioned definition cards with a "Read more" link, wired onto rendered terms
- **Glossary Manager View** — An optional A-Z browse, search, create, and edit UI

[Overview](README.md)
[Quick Start](quickstart.md)
[API Reference](api.md)
[GitHub](https://github.com/fable-retold/pict-provider-vocabulary)
