# Pict Provider Vocabulary

A Pict provider for vocabulary/glossary term management. It manages a term index, hands out a resolver callback for [pict-section-content](https://fable-retold.github.io/pict-section-content/)'s markdown auto-linking, and wires hover popovers onto the rendered terms. It also ships an optional glossary manager view.

The provider extends [pict-provider](https://fable-retold.github.io/pict-provider/), so it participates in the standard Pict application lifecycle and is registered with `addProvider()` like any other provider.

## What problem it solves

Glossary-style auto-linking has three moving parts that usually get tangled together:

1. **Where the terms live** - a JSON file, a database table, an API endpoint.
2. **How markdown text gets linked** - scanning rendered HTML for known terms and wrapping them.
3. **What happens on hover** - showing a definition popover.

This provider owns part 1 (the in-memory index and its loaders) and part 3 (the popover wiring), and supplies a small resolver callback that lets pict-section-content do part 2. Because the index is just a plain object, the term source stays the host application's concern - filesystem, database, or API all work the same way.

## The term index shape

Everything keys off a flat index object:

```javascript
{
	vae:  { title: 'VAE',  short: 'Variational Autoencoder.' },
	lora: { title: 'LoRA', short: 'Low-Rank Adaptation.' }
}
```

- The **key** is the term *slug* - the lowercase word that gets matched in markdown text.
- `title` is the display label (shown in popovers and the glossary view).
- `short` is the one-line definition shown in the popover.

> pict-section-content lowercases each candidate word before calling the resolver, so index slugs should be lowercase to match.

## How the pieces fit together

```
host app                                    pict-section-content
  │ loadIndex({...})                              │
  ▼                                               │
PictProviderVocabulary                            │
  │ getResolver()  ──── resolver callback ───────-│ parseMarkdown(md, null, null, resolver)
  │                                               │   wraps known terms in
  │                                               ▼   <span class="pict-vocab-term" data-...>
  │ wirePopovers('#container') ◀──── rendered HTML in the DOM
  ▼
hover popover (.vocab-popover)
```

## Source-agnostic loading

Three ways to populate the index:

| Method | Source |
|--------|--------|
| `loadIndex(pIndex)` | A pre-built object you already have in memory |
| `loadFromURL(pURL, fCallback)` | A JSON endpoint returning `{ Index: { ... } }` |
| Your own code | Build the object however you like, then call `loadIndex()` |

## Styling

The provider injects its CSS into the Pict CSS cascade at construction time (priority `500`), covering both the popover (`.pict-vocab-term`, `.vocab-popover`) and the glossary manager view chrome. Every color and font reads a `var(--theme-color-*)` / `var(--theme-typography-*)` token from [pict-provider-theme](https://fable-retold.github.io/pict-provider-theme/) with a hard-coded hex fallback, so the vocabulary UI re-skins with the rest of an app's theme but stays readable without one.

## Documentation

- [Quick Start](quickstart.md) - Register the provider, load terms, auto-link, and wire popovers.
- [API Reference](api.md) - Every method, the resolver contract, and the rendered-element shape.

## Related Modules

- [pict-provider](https://fable-retold.github.io/pict-provider/) - the base class this provider extends.
- [pict-section-content](https://fable-retold.github.io/pict-section-content/) - supplies `parseMarkdown()`, which consumes the resolver.
- [pict](https://fable-retold.github.io/pict/) - the MVC framework the provider plugs into.
