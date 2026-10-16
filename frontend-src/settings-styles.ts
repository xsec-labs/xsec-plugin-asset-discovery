export const settingsStyles = `
.collector-settings { max-width: 960px; margin-inline: auto; }
.collector-settings-heading > h1 { margin: 0; font-size: calc(var(--xui-font-size) + 9px); }
.collector-settings { display: grid; min-width: 0; gap: 24px; color: var(--xui-text); font-size: var(--xui-font-size); }
.collector-settings-toolbar, .collector-settings-form-actions, .collector-settings-secret-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; min-width: 0; }
.collector-settings-toolbar > div { min-width: 0; flex: 1; }
.collector-settings-section { min-width: 0; padding-top: 20px; border-top: 1px solid var(--xui-border); }
.collector-settings-section > h2 { margin: 0 0 18px; font-size: calc(var(--xui-font-size) + 3px); }
.collector-settings-form, .collector-settings-secrets { display: grid; min-width: 0; gap: 20px; }
.collector-settings-fields { display: grid; min-width: 0; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 16px; }
.collector-settings-form-actions { justify-content: flex-start; }
.collector-settings-draft-status, .collector-settings-hint { color: var(--xui-muted); }
.collector-settings-notice { margin: 0; color: var(--xui-success); overflow-wrap: anywhere; }
.collector-settings .xui-field, .collector-settings .xui-field-hint { min-width: 0; overflow-wrap: anywhere; }
.collector-settings .xui-input, .collector-settings .xui-select-trigger { width: 100%; min-width: 0; min-height: 44px; }
.collector-settings .xui-select-trigger { height: auto; text-align: start; white-space: normal; }
.collector-settings .xui-select-trigger > span { min-width: 0; overflow-wrap: anywhere; }
.collector-settings .xui-select-value { overflow: visible; white-space: normal; text-overflow: clip; }
.collector-settings .xui-button, .collector-settings-dialog .xui-button { max-width: 100%; min-height: 44px; height: auto; white-space: normal; }
.collector-settings .xui-error, .collector-settings-dialog .xui-error { min-width: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
.collector-settings .xui-error > div, .collector-settings-dialog .xui-error > div { min-width: 0; }
.collector-settings-reconcile { display: block; margin-top: 8px; }
.collector-settings-secret { min-width: 0; padding-top: 20px; border-top: 1px solid var(--xui-border); }
.collector-settings-secret:first-child { padding-top: 0; border-top: 0; }
.collector-settings-secret-heading { justify-content: flex-start; margin-bottom: 12px; }
.collector-settings-secret-heading > h3 { margin: 0; font-size: var(--xui-font-size); }
.collector-settings-hint { margin: 0 0 12px; line-height: 1.6; }
.collector-settings-secret-form { display: grid; min-width: 0; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 12px; }
.collector-settings-secret-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.collector-settings-help { min-width: 0; border-top: 1px solid var(--xui-border); padding-top: 16px; color: var(--xui-muted); line-height: 1.7; }
.collector-settings-help > summary { width: fit-content; max-width: 100%; min-height: 44px; padding-block: 8px; cursor: pointer; }
.collector-settings-help > summary:focus-visible { outline: 2px solid var(--xui-focus); outline-offset: 3px; border-radius: var(--xui-radius-control); }
.collector-settings-help ol { padding-inline-start: 1.5em; }
.collector-settings-help li + li { margin-top: 8px; }
.collector-settings-help code { overflow-wrap: anywhere; }
.collector-settings-dialog .xui-button[data-size="icon"] { min-width: 44px; }
.collector-settings-dialog .xui-dialog-title { font-size: calc(var(--xui-font-size) + 3px); }
.collector-settings-dialog .xui-dialog-content { overflow-wrap: anywhere; }
@media (max-width: 700px) {
  .collector-settings-fields, .collector-settings-secret-form { grid-template-columns: minmax(0, 1fr); }
  .collector-settings-secret-actions > .xui-button { flex: 1; }
}
@media (max-width: 480px) {
  .collector-settings-toolbar { align-items: stretch; }
  .collector-settings-toolbar > div { flex-basis: 100%; }
  .collector-settings-toolbar > .xui-button, .collector-settings-form-actions > .xui-button { width: 100%; }
  .collector-settings-dialog .xui-dialog-footer { flex-wrap: wrap; }
  .collector-settings-dialog .xui-dialog-footer > .xui-button { flex: 1; }
}
`;
