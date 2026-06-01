# API Reference

## Module exports

```javascript
const libPictVocabulary = require('pict-provider-vocabulary');
```

| Export | Description |
|--------|-------------|
| `libPictVocabulary` | The `PictProviderVocabulary` class (the module's `main`). |
| `libPictVocabulary.default_configuration` | Default options object. Currently `{}`. |
| `libPictVocabulary.VocabularyManagerView` | The glossary manager view class (see [Vocabulary Manager View](#vocabulary-manager-view)). |

## Class: PictProviderVocabulary

Extends [`pict-provider`](https://fable-retold.github.io/pict-provider/). Service type: `'PictProviderVocabulary'`.

```javascript
new PictProviderVocabulary(pFable, pOptions, pServiceHash)
```

Register it on a Pict instance rather than constructing it directly:

```javascript
_Pict.addProvider('Vocabulary', libPictVocabulary.default_configuration, libPictVocabulary);
let pictVocabulary = _Pict.providers.Vocabulary;
```

The constructor sets up an empty term index and, when a `pict.CSSMap` with an `addCSS` method is present, registers the provider's CSS under the hash `Pict-Provider-Vocabulary` at priority `500`. All [pict-provider](https://fable-retold.github.io/pict-provider/) lifecycle methods and properties are inherited.

---

## Loading terms

### loadIndex(pIndex)

Replace the term index with a pre-built object.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pIndex` | object | A term index: `{ slug: { title, short } }`. A falsy value resets the index to `{}`. |

**Returns:** `undefined`.

```javascript
pictVocabulary.loadIndex(
	{
		vae:  { title: 'VAE',  short: 'Variational Autoencoder.' },
		lora: { title: 'LoRA', short: 'Low-Rank Adaptation.' }
	});
```

---

### loadFromURL(pURL, fCallback)

Fetch a term index from a URL using the global `fetch`. The response is parsed as JSON and its `Index` property becomes the new index.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pURL` | string | The endpoint to fetch. Expected response shape: `{ Index: { slug: { title, short } } }`. |
| `fCallback` | function | *(optional)* `(pError)` - called with `null` on success, or the error on failure. |

**Returns:** `undefined`.

Behavior notes:

- If `fetch` is undefined (server-side / test context), the index is left untouched and `fCallback` is called with no error.
- On a failed fetch, a warning is logged via `this.log` (when available) and `fCallback` receives the error. The index is **not** changed.
- If the response has no `Index` property, the index becomes `{}`.

```javascript
pictVocabulary.loadFromURL('/api/vocabulary/index', (pError) =>
{
	if (pError) { /* fetch failed */ return; }
	// index is loaded
});
```

---

## The resolver

### getResolver()

Return a resolver callback for [pict-section-content](https://fable-retold.github.io/pict-section-content/)'s `parseMarkdown()`.

**Returns:** `function | null`

- Returns `null` when the index is empty. (`parseMarkdown` accepts `null` and skips vocabulary linking.)
- Otherwise returns a function with the signature below.

#### Resolver signature

```javascript
function (pWord) => { slug, title, short } | null
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pWord` | string | A candidate word to resolve. |

| Returns | When |
|---------|------|
| `{ slug, title, short }` | `pWord` is a known term. `slug` is `pWord` itself; `title` and `short` come from the matched index entry. |
| `null` | `pWord` is not in the index. |

The resolver does a direct lookup of `pWord` against the index keys. pict-section-content lowercases each candidate word before calling the resolver, so **index slugs should be lowercase** to match.

#### Wiring it into parseMarkdown

The resolver is the **4th argument** to pict-section-content's `parseMarkdown`:

```javascript
parseMarkdown(pMarkdown, pLinkResolver, pImageResolver, pVocabularyResolver)
```

```javascript
let tmpHTML = pictContent.parseMarkdown(tmpMarkdown, null, null, pictVocabulary.getResolver());
```

pict-section-content matches whole words 3-31 characters long and wraps the **first occurrence** of each known term. See [pict-section-content](https://fable-retold.github.io/pict-section-content/) for the full matching rules.

---

## Term access

These methods let glossary UIs read the index. They do not mutate it.

### getTerms()

Return all terms as a slug-sorted array.

**Returns:** `Array<{ slug, title, short }>`

Each entry's `title` falls back to the slug and `short` falls back to `''` if missing from the index entry.

```javascript
let tmpTerms = pictVocabulary.getTerms();
// [ { slug: 'lora', title: 'LoRA', short: '...' }, { slug: 'vae', title: 'VAE', short: '...' } ]
```

---

### getTerm(pSlug)

Return a single term by slug.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pSlug` | string | The term slug to look up. |

**Returns:** `{ slug, title, short } | null` - `null` if the slug is not in the index. As with `getTerms()`, `title` falls back to the slug and `short` to `''`.

---

### getIndex()

Return the raw index object (for serialization or debugging).

**Returns:** `object` - the live `{ slug: { title, short } }` index.

---

## Popover wiring

### wirePopovers(pContainerSelector, pOptions)

Attach hover handlers to every `.pict-vocab-term` element inside a container. On hover, a positioned popover shows the term title, short definition, and a "Read more" link.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pContainerSelector` | string | CSS selector for the container to search for `.pict-vocab-term` elements. |
| `pOptions` | object | *(optional)* See below. |

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vocabularyRoute` | string | `'#/vocabulary'` | Route prefix for the "Read more" link. The link href is `<vocabularyRoute>/<slug>`. |

**Returns:** `undefined`.

Behavior notes:

- No-op when `document` is undefined (server-side / tests), when the container is not found, or when it contains no `.pict-vocab-term` elements.
- Each term is wired at most once - already-wired elements are skipped, so calling `wirePopovers()` again after a re-render is safe.
- The popover reads its content from the element's `data-vocab-slug`, `data-vocab-title`, and `data-vocab-short` attributes (see below). `data-vocab-title` falls back to the slug and `data-vocab-short` to `''`.
- Only one popover is shown at a time; opening a new one removes any existing `.vocab-popover`. The popover dismisses (with a short grace delay) once the pointer leaves both the term and the popover.

#### Rendered term element

`wirePopovers()` is designed to pair with the markup pict-section-content emits when it auto-links a term through the resolver:

```html
<span class="pict-vocab-term"
      data-vocab-slug="vae"
      data-vocab-title="VAE"
      data-vocab-short="Variational Autoencoder.">VAE</span>
```

Any element carrying class `pict-vocab-term` and these data attributes will be wired, regardless of how it was produced.

#### Popover markup

The popover injected on hover is appended to `document.body`:

```html
<div class="vocab-popover">
	<div class="vocab-popover-title">VAE</div>
	<div class="vocab-popover-short">Variational Autoencoder.</div>
	<a class="vocab-popover-link" href="#/vocabulary/vae">Read more &rarr;</a>
</div>
```

---

## CSS

The provider registers a single CSS fragment into the Pict CSS cascade at construction (hash `Pict-Provider-Vocabulary`, priority `500`). It styles:

- The term marker - `.pict-vocab-term` (a dotted underline + help cursor).
- The hover popover - `.vocab-popover`, `.vocab-popover-title`, `.vocab-popover-short`, `.vocab-popover-link`.
- The [Vocabulary Manager View](#vocabulary-manager-view) chrome - the `.vocab-*` layout, list, toolbar, editor, and create-modal classes.

Every color and font is a `var(--theme-color-*)` / `var(--theme-typography-*)` token with a hard-coded hex fallback, so the UI re-skins with [pict-provider-theme](https://fable-retold.github.io/pict-provider-theme/) but stays readable without a theme provider. The cascade is injected via the framework's `injectCSS()`; views that render lazily should call `this.pict.CSSMap.injectCSS()` in `onAfterRender()` (the manager view does this).

---

## Vocabulary Manager View

A glossary management view (A-Z browse, filter, create, edit, delete) exported as `libPictVocabulary.VocabularyManagerView`. Register it as a Pict view:

```javascript
_Pict.addView(
	'Vocabulary',
	libPictVocabulary.VocabularyManagerView.default_configuration,
	libPictVocabulary.VocabularyManagerView);
```

It reads its term list from the vocabulary provider (looked up by the `VocabularyProviderHash` option), so it shows whatever the host app loaded. The view is `AutoInitialize: false` / `AutoRender: false` - the host mounts and renders it explicitly.

### Options

Defaults are merged with any options passed to `addView`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ViewIdentifier` | string | `'Pict-VocabularyManager'` | The view identifier. |
| `DefaultRenderable` | string | `'VocabMgr-Display'` | The renderable rendered by default. |
| `DefaultDestinationAddress` | string | `'#PictVocabularyManager'` | The DOM target the view renders into. |
| `VocabularyIndexURL` | string | `'/api/vocabulary/index'` | URL the view passes to the provider's `loadFromURL` when refreshing the list. |
| `VocabularyTermURL` | string | `'/api/vocabulary/term'` | Base URL for per-term GET / PUT / DELETE requests. The slug is appended (`<url>/<slug>`). |
| `VocabularyRoute` | string | `'#/vocabulary'` | Route prefix used by editor-navigation fallbacks. |
| `VocabularyProviderHash` | string | `'Vocabulary'` | The hash under which the vocabulary provider is registered. |
| `VocabularyFolderPath` | string | `'vocabulary/'` | Folder prefix used to build the file path passed to `onEditTerm` (`<folder><slug>.md`). |
| `onEditTerm` | function \| null | `null` | `(pSlug, pFilePath) => void`. Called when the user edits a term, so the host app can open it in its own editor. If `null`, the view falls back to `PictApplication.navigateToFile(pFilePath)`, then to hash navigation. |

### Methods

| Method | Description |
|--------|-------------|
| `refreshTermList(fCallback)` | Reload the index from `VocabularyIndexURL` via the provider, then re-render. `fCallback` receives an error string if no provider is found, otherwise the provider's load error. |
| `loadTerm(pSlug, fCallback)` | Fetch a single term's body from `VocabularyTermURL/<slug>` (expects `{ Body }`), select it, and re-render. |
| `editTerm(pSlug)` | Invoke `onEditTerm(slug, filePath)` if provided; otherwise fall back to `PictApplication.navigateToFile`, then to hash navigation. |
| `deleteTerm(pSlug)` | Confirm (via `pict-section-modal`'s `confirm()` when available), then `DELETE` the term and refresh. |
| `createTerm()` / `showCreateModal()` / `hideCreateModal()` | Open and close the "new term" modal. |
| `setFilter(pText)` | Filter the term list by slug or title substring (case-insensitive) and re-render the list. |

> The view's `VocabularyIndexURL`, `VocabularyTermURL`, and the `loadFromURL` integration assume a REST endpoint for terms. Apps that load the index from a non-URL source (a database, an in-memory object) can still browse via the provider, but the view's create/edit/delete actions are wired to those URLs.
