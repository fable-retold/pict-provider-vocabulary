/**
 * Vocabulary popover + manager CSS — injected by the provider into the
 * Pict CSS cascade so any app that registers the provider gets the
 * popover styles and the manager-view chrome for free.
 *
 * Every color/background/border reads a `var(--theme-color-*)` token
 * from pict-provider-theme — apps using a theme provider get a
 * vocabulary UI that re-skins coherently with the rest of their chrome
 * (warm beige under retold-content-system, GitHub grey under
 * retold-manager, magenta/cyan under cyberpunk, etc.).  Each var()
 * carries a sensible hex fallback so apps without a theme provider
 * still get a readable panel.
 *
 * Typography flows through `--theme-typography-family-mono` / `-body`
 * for the same reason — themes that swap font families pick this up
 * without further code.
 */
module.exports = `
/* ── Vocabulary term marker ─────────────────────────── */
.pict-vocab-term {
	border-bottom: 1px dotted var(--theme-color-brand-primary, #2a8a7a);
	cursor: help;
}

/* ── Popover ────────────────────────────────────────── */
.vocab-popover {
	position: fixed;
	z-index: 10000;
	max-width: 320px;
	padding: 12px 16px;
	background: var(--theme-color-background-panel,    #FFFFFF);
	border: 1px solid var(--theme-color-border-default, #DDD6CA);
	border-radius: 6px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
	font-size: 0.85em;
	line-height: 1.5;
	color: var(--theme-color-text-primary, #3D3229);
}

.vocab-popover-title {
	font-weight: bold;
	margin-bottom: 6px;
	color: var(--theme-color-brand-primary, #2a8a7a);
}

.vocab-popover-short {
	margin-bottom: 8px;
	color: var(--theme-color-text-secondary, #5E5549);
}

.vocab-popover-link {
	color: var(--theme-color-brand-primary, #2a8a7a);
	text-decoration: none;
	font-size: 0.85em;
}
.vocab-popover-link:hover {
	text-decoration: underline;
}

/* ── Vocabulary Manager View ────────────────────────── */
.vocab-layout {
	display: flex;
	height: calc(100vh - 80px);
	gap: 0;
}

.vocab-sidebar {
	width: 260px;
	min-width: 200px;
	border-right: 1px solid var(--theme-color-border-default, #DDD6CA);
	overflow-y: auto;
	background: var(--theme-color-background-secondary, #F5F0E8);
	display: flex;
	flex-direction: column;
}

.vocab-sidebar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 14px;
	color: var(--theme-color-text-primary, #3D3229);
	border-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);
}

.vocab-content {
	flex: 1;
	overflow-y: auto;
	padding: 0;
	display: flex;
	flex-direction: column;
}

.vocab-list {
	flex: 1;
	overflow-y: auto;
	padding: 6px 0;
}

.vocab-item {
	padding: 6px 14px;
	cursor: pointer;
	font-size: 0.85em;
	color: var(--theme-color-text-secondary, #5E5549);
	border-left: 3px solid transparent;
}
.vocab-item:hover {
	background: var(--theme-color-background-hover, #EAE3D8);
}
.vocab-item-active {
	background: var(--theme-color-background-hover, #EAE3D8);
	color: var(--theme-color-text-primary, #3D3229);
	border-left-color: var(--theme-color-brand-primary, #2a8a7a);
}

.vocab-item-title {
	font-weight: 600;
	color: var(--theme-color-text-primary, #3D3229);
}
.vocab-item-short {
	font-size: 0.78em;
	color: var(--theme-color-text-muted, #8A7F72);
	margin-top: 2px;
	line-height: 1.3;
}

.vocab-filter {
	margin: 8px 10px;
	padding: 6px 10px;
	border: 1px solid var(--theme-color-border-default, #DDD6CA);
	border-radius: 4px;
	background: var(--theme-color-background-panel, #FFFFFF);
	color: var(--theme-color-text-primary, #3D3229);
	font-size: 0.85em;
}
.vocab-filter::placeholder {
	color: var(--theme-color-text-muted, #8A7F72);
}
.vocab-filter:focus {
	border-color: var(--theme-color-brand-primary, #2a8a7a);
	outline: none;
	box-shadow: 0 0 0 2px var(--theme-color-brand-primary-tint, rgba(42, 138, 122, 0.15));
}

.vocab-toolbar {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 16px;
	border-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);
	background: var(--theme-color-background-secondary, #F5F0E8);
}

.vocab-slug {
	flex: 1;
	font-family: var(--theme-typography-family-mono, 'SF Mono', Menlo, Monaco, monospace);
	font-size: 0.82em;
	color: var(--theme-color-text-muted, #8A7F72);
}

.vocab-btn {
	padding: 4px 12px;
	border: 1px solid var(--theme-color-border-default, #DDD6CA);
	border-radius: 4px;
	background: var(--theme-color-background-panel, #FFFFFF);
	color: var(--theme-color-text-secondary, #5E5549);
	cursor: pointer;
	font-size: 0.82em;
}
.vocab-btn:hover {
	background: var(--theme-color-background-hover, #EAE3D8);
	color: var(--theme-color-text-primary, #3D3229);
}
.vocab-btn-primary {
	background: var(--theme-color-brand-primary, #2a8a7a);
	border-color: var(--theme-color-brand-primary, #2a8a7a);
	color: var(--theme-color-text-on-brand, var(--theme-color-background-panel, #FFFFFF));
}
.vocab-btn-primary:hover {
	background: var(--theme-color-brand-primary-hover, var(--theme-color-brand-primary, #2a8a7a));
	border-color: var(--theme-color-brand-primary-hover, var(--theme-color-brand-primary, #2a8a7a));
}
.vocab-btn-danger {
	color:        var(--theme-color-status-error, #D9534F);
	border-color: var(--theme-color-status-error, #D9534F);
	background:   var(--theme-color-background-panel, #FFFFFF);
}
.vocab-btn-danger:hover {
	background:   var(--theme-color-status-error, #D9534F);
	border-color: var(--theme-color-status-error, #D9534F);
	color:        var(--theme-color-text-on-status, var(--theme-color-background-panel, #FFFFFF));
}

.vocab-rendered {
	flex: 1;
	padding: 20px 24px;
	overflow-y: auto;
	line-height: 1.6;
	color: var(--theme-color-text-primary, #3D3229);
}

.vocab-editor {
	flex: 1;
	width: 100%;
	padding: 16px 20px;
	border: none;
	background: var(--theme-color-background-panel, #FFFFFF);
	color: var(--theme-color-text-primary, #3D3229);
	font-family: var(--theme-typography-family-mono, 'SF Mono', Menlo, Monaco, monospace);
	font-size: 0.85em;
	line-height: 1.5;
	resize: none;
}
.vocab-editor:focus {
	outline: none;
}

.vocab-empty {
	padding: 40px 24px;
	text-align: center;
	color: var(--theme-color-text-muted, #8A7F72);
	font-size: 0.9em;
}

/* ── Term preview (expanded active item) ───────────── */
.vocab-item-preview-short {
	margin-top: 6px;
	padding: 6px 0;
	color: var(--theme-color-text-secondary, #5E5549);
	font-size: 0.8em;
	line-height: 1.4;
	border-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);
}
.vocab-item-preview-body {
	margin-top: 6px;
	padding: 8px 10px;
	background: var(--theme-color-background-tertiary, #F0ECE4);
	border-radius: 4px;
	color: var(--theme-color-text-muted, #8A7F72);
	white-space: pre-wrap;
	font-family: var(--theme-typography-family-mono, 'SF Mono', Menlo, Monaco, monospace);
	font-size: 0.72em;
	line-height: 1.4;
	max-height: 200px;
	overflow-y: auto;
}
.vocab-item-preview-actions {
	margin-top: 6px;
	padding-bottom: 2px;
}

/* ── Create-term modal overlay ─────────────────────── */
.vocab-create-overlay {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10001;
	background: rgba(0, 0, 0, 0.35);
}
.vocab-create-overlay.open {
	display: flex;
	align-items: center;
	justify-content: center;
}
.vocab-create-panel {
	background: var(--theme-color-background-panel, #FFFFFF);
	border: 1px solid var(--theme-color-border-default, #DDD6CA);
	border-radius: 10px;
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
	width: 360px;
	max-width: 90vw;
	overflow: hidden;
}
.vocab-create-body {
	padding: 24px 22px 16px;
}
.vocab-create-title {
	font-size: 0.95rem;
	font-weight: 600;
	color: var(--theme-color-text-primary, #3D3229);
	margin-bottom: 12px;
	text-align: center;
}
.vocab-create-input {
	display: block;
	width: 100%;
	box-sizing: border-box;
	padding: 8px 12px;
	border: 1px solid var(--theme-color-border-default, #DDD6CA);
	border-radius: 5px;
	background: var(--theme-color-background-secondary, #F5F0E8);
	color: var(--theme-color-text-primary, #3D3229);
	font-size: 0.88rem;
	font-family: var(--theme-typography-family-mono, 'SF Mono', Menlo, Monaco, monospace);
}
.vocab-create-input:focus {
	border-color: var(--theme-color-brand-primary, #2a8a7a);
	outline: none;
	box-shadow: 0 0 0 2px var(--theme-color-brand-primary-tint, rgba(42, 138, 122, 0.15));
}
.vocab-create-actions {
	display: flex;
	gap: 10px;
	justify-content: center;
	padding: 0 22px 16px;
}
.vocab-create-footer {
	padding: 10px 22px;
	border-top: 1px solid var(--theme-color-border-default, #DDD6CA);
	font-size: 0.72rem;
	color: var(--theme-color-text-muted, #8A7F72);
	text-align: center;
}
.vocab-create-footer kbd {
	display: inline-block;
	padding: 1px 5px;
	font-size: 0.68rem;
	font-family: var(--theme-typography-family-mono, 'SF Mono', Menlo, Monaco, monospace);
	background: var(--theme-color-background-tertiary, #F0ECE4);
	border: 1px solid var(--theme-color-border-default, #DDD6CA);
	border-radius: 3px;
	color: var(--theme-color-text-secondary, #5E5549);
}
`;
