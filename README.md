# pict-provider-vocabulary

A Pict provider for vocabulary/glossary term management. It holds a term index in memory, hands out a resolver callback that [pict-section-content](https://fable-retold.github.io/pict-section-content/)'s `parseMarkdown()` uses to auto-link known terms, and wires popover hover handlers onto the rendered term elements.

The provider is source-agnostic: terms can come from a pre-built object, a URL, or any application-specific code (a Meadow database query, a filesystem scan, etc.). It only cares about the resulting index shape.

## Installation

```bash
npm install pict-provider-vocabulary
```

## What it does

- **Term index** — Loads and serves a `{ slug: { title, short } }` index. Load it from an object (`loadIndex`) or a URL (`loadFromURL`).
- **Markdown auto-linking** — `getResolver()` returns the callback you pass as the 4th argument to pict-section-content's `parseMarkdown()`. Known terms in the rendered HTML are wrapped in `<span class="pict-vocab-term">` with the popover content baked into data attributes.
- **Popovers** — `wirePopovers()` attaches hover handlers to those rendered `.pict-vocab-term` elements, showing a positioned card with the term title, short definition, and a "Read more" link.
- **Glossary manager view** — Ships a `VocabularyManagerView` (an A-Z browse/search/create/edit UI) that host apps can register and mount.

## Quick example

```javascript
const libPictVocabulary = require('pict-provider-vocabulary');

// Register the provider on a Pict instance
let _Pict = new libPict();
_Pict.addProvider('Vocabulary', libPictVocabulary.default_configuration, libPictVocabulary);

let pictVocabulary = _Pict.providers.Vocabulary;

// 1. Load a term index
pictVocabulary.loadIndex(
	{
		vae:  { title: 'VAE', short: 'Variational Autoencoder — compresses images into a latent space.' },
		lora: { title: 'LoRA', short: 'Low-Rank Adaptation — a lightweight fine-tuning technique.' }
	});

// 2. Auto-link terms while parsing markdown (via pict-section-content)
let pictContent = _Pict.providers.Content;
let tmpHTML = pictContent.parseMarkdown(tmpMarkdown, null, null, pictVocabulary.getResolver());
_Pict.ContentAssignment.assignContent('#Article', tmpHTML);

// 3. Wire popovers onto the rendered terms
pictVocabulary.wirePopovers('#Article', { vocabularyRoute: '#/vocabulary' });
```

## Documentation

Full documentation lives in [`docs/`](docs/README.md):

- [Overview](docs/README.md)
- [Quick Start](docs/quickstart.md)
- [API Reference](docs/api.md)

## Related Modules

- [pict-provider](https://fable-retold.github.io/pict-provider/) — the base class this provider extends.
- [pict-section-content](https://fable-retold.github.io/pict-section-content/) — supplies `parseMarkdown()`, which consumes the resolver this provider hands out.
- [pict](https://fable-retold.github.io/pict/) — the MVC framework the provider plugs into.

## License

MIT
