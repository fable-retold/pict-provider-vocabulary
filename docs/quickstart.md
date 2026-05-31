# Quick Start

This walkthrough registers the provider, loads a term index, auto-links those terms inside markdown rendered by [pict-section-content](https://fable-retold.github.io/pict-section-content/), and wires hover popovers onto the result.

## Install

```bash
npm install pict-provider-vocabulary
```

## 1. Register the provider

The module's `main` export is the provider class, and it carries a `default_configuration`. Register it on a Pict instance with `addProvider()`:

```javascript
const libPict = require('pict');
const libPictVocabulary = require('pict-provider-vocabulary');

let _Pict = new libPict();

_Pict.addProvider('Vocabulary', libPictVocabulary.default_configuration, libPictVocabulary);

let pictVocabulary = _Pict.providers.Vocabulary;
```

The constructor injects the provider's CSS into the Pict CSS cascade automatically — there is nothing else to wire up for styling.

## 2. Load a term index

The index is a flat object keyed by lowercase slug. Each entry has a `title` (display label) and a `short` (one-line definition).

```javascript
pictVocabulary.loadIndex(
	{
		vae:       { title: 'VAE',       short: 'Variational Autoencoder — compresses images into a latent space.' },
		lora:      { title: 'LoRA',      short: 'Low-Rank Adaptation — a lightweight fine-tuning technique.' },
		diffusion: { title: 'Diffusion', short: 'A generative process that denoises random noise into an image.' }
	});
```

### Loading from a URL instead

If your terms live behind an endpoint, use `loadFromURL`. It expects a JSON response shaped `{ Index: { slug: { title, short } } }` and calls back when the fetch completes (or fails):

```javascript
pictVocabulary.loadFromURL('/api/vocabulary/index', (pError) =>
{
	if (pError)
	{
		// fetch failed — the index is left empty
		return;
	}
	// terms are loaded; safe to parse markdown now
});
```

> `loadFromURL` uses the global `fetch`. In a server-side or test context where `fetch` is undefined, it leaves the index untouched and invokes the callback with no error.

## 3. Auto-link terms in markdown

`getResolver()` returns a callback suitable as the **4th argument** to pict-section-content's `parseMarkdown(pMarkdown, pLinkResolver, pImageResolver, pVocabularyResolver)`. Pass `null` for the link and image resolvers if you do not need them:

```javascript
let pictContent = _Pict.providers.Content; // the pict-section-content provider

let tmpResolver = pictVocabulary.getResolver();
let tmpHTML = pictContent.parseMarkdown(tmpMarkdown, null, null, tmpResolver);

_Pict.ContentAssignment.assignContent('#Article', tmpHTML);
```

pict-section-content scans the rendered text for whole words that the resolver recognizes and wraps the **first occurrence** of each in:

```html
<span class="pict-vocab-term"
      data-vocab-slug="vae"
      data-vocab-title="VAE"
      data-vocab-short="Variational Autoencoder — compresses images into a latent space.">VAE</span>
```

> If no terms are loaded, `getResolver()` returns `null`. Passing `null` is fine — pict-section-content simply skips vocabulary linking.

## 4. Wire popovers

After the HTML is in the DOM, call `wirePopovers()` with a selector for the container. It finds every `.pict-vocab-term` inside that container and attaches a hover handler that pops up a definition card:

```javascript
pictVocabulary.wirePopovers('#Article', { vocabularyRoute: '#/vocabulary' });
```

On hover, the popover shows the term title, the short definition, and a **Read more** link pointing at `<vocabularyRoute>/<slug>` (default route `#/vocabulary`). The popover dismisses when the pointer leaves both the term and the popover.

> `wirePopovers()` is idempotent per element — terms it has already wired are skipped, so it is safe to call again after re-rendering content. It is a no-op when `document` is undefined (server-side / tests).

## 5. (Optional) Mount the glossary manager view

The package also exports a `VocabularyManagerView` — an A-Z browse, search, create, and edit UI that reads its terms from this provider. Register it as a Pict view:

```javascript
_Pict.addView(
	'Vocabulary',
	libPictVocabulary.VocabularyManagerView.default_configuration,
	libPictVocabulary.VocabularyManagerView);
```

The view reads terms via the provider (it looks the provider up by the hash in its `VocabularyProviderHash` option, default `'Vocabulary'`), so it works with whatever term source the host app configured. Editing is delegated to the host app through an `onEditTerm(slug, filePath)` callback in the view's options. See the [API Reference](api.md) for the view's options.

## Putting it together

```javascript
const libPict = require('pict');
const libPictVocabulary = require('pict-provider-vocabulary');

let _Pict = new libPict();
_Pict.addProvider('Vocabulary', libPictVocabulary.default_configuration, libPictVocabulary);

let pictVocabulary = _Pict.providers.Vocabulary;
let pictContent = _Pict.providers.Content;

pictVocabulary.loadIndex(
	{
		vae:  { title: 'VAE',  short: 'Variational Autoencoder.' },
		lora: { title: 'LoRA', short: 'Low-Rank Adaptation.' }
	});

let tmpHTML = pictContent.parseMarkdown(tmpMarkdown, null, null, pictVocabulary.getResolver());
_Pict.ContentAssignment.assignContent('#Article', tmpHTML);

pictVocabulary.wirePopovers('#Article');
```
