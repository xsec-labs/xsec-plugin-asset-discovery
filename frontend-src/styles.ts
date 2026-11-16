// 颜色只取宿主推送的 --xsec-* 变量（Desktop 的 themeVars），缺失时回落到 Desktop 默认值。
// 控件按 Desktop 的“柔和填充”外观覆盖共享组件：静止无描边，聚焦才出现强调色描边和光环。
const LIGHT = "--xui-canvas:var(--xsec-window-background,#f7f7f8);--xui-surface:var(--xsec-content-surface,#fff);--xui-subtle:var(--xsec-bg-subtle,#f0f0f2);--xui-hover:var(--xsec-bg-hover,#eaeaed);--xui-text:var(--xsec-text-primary,#18181b);--xui-muted:var(--xsec-text-secondary,#62626b);--xui-border:var(--xsec-border-default,#dcdce1);--xui-danger:var(--xsec-status-error,#b42318);--xui-success:var(--xsec-status-success,#187344);--xui-warning:var(--xsec-status-warning,#8a5700)";
const DARK = "--xui-canvas:var(--xsec-window-background,#111113);--xui-surface:var(--xsec-content-surface,#19191c);--xui-subtle:var(--xsec-bg-subtle,#232327);--xui-hover:var(--xsec-bg-hover,#2d2d33);--xui-text:var(--xsec-text-primary,#f4f4f5);--xui-muted:var(--xsec-text-secondary,#a1a1aa);--xui-border:var(--xsec-border-default,#35353c);--xui-danger:var(--xsec-status-error,#ff938a);--xui-success:var(--xsec-status-success,#7ad6a0);--xui-warning:var(--xsec-status-warning,#e9bd70)";

export const styles = `
[data-xui-theme=light] { ${LIGHT}; }
[data-xui-theme=dark] { ${DARK}; }
[data-xui] { --xui-primary:var(--xsec-text-accent,#0169cc); --xui-on-primary:#fff; --ad-accent:color-mix(in srgb,var(--xui-primary) 68%,var(--xui-text)); --xui-focus:var(--ad-accent); --ad-accent-soft:color-mix(in srgb,var(--xui-primary) 12%,transparent); --ad-ring:color-mix(in srgb,var(--xui-primary) 26%,transparent); --ad-fill:color-mix(in srgb,var(--xui-text) 6%,transparent); --ad-fill-hover:color-mix(in srgb,var(--xui-text) 9%,transparent); --ad-fill-pressed:color-mix(in srgb,var(--xui-text) 13%,transparent); --ad-hairline:color-mix(in srgb,var(--xui-text) 10%,transparent); --xui-radius-control:var(--xsec-radius-md,8px); --xui-radius-panel:var(--xsec-radius-lg,12px); --ad-mono:ui-monospace,"SF Mono","Cascadia Mono",Consolas,"Liberation Mono",monospace; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei","Noto Sans CJK SC",system-ui,sans-serif; line-height:1.45; -webkit-font-smoothing:antialiased; }
:root { --ad-page:var(--xsec-content-surface,#fff); }
@media (prefers-color-scheme: dark) { :root { --ad-page:var(--xsec-content-surface,#19191c); } }
* { box-sizing:border-box; }
body { margin:0; background:var(--ad-page); }
button, input, select, textarea { font:inherit; }
[hidden] { display:none !important; }
.ad-sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
.ad-icon { flex:none; }

.xui-button { font-weight:500; padding:0 12px; transition:background-color var(--xui-duration-fast),color var(--xui-duration-fast),box-shadow var(--xui-duration-fast); }
.xui-button[data-size=sm] { padding:0 8px; min-height:26px; font-size:calc(12px * var(--xui-font-scale)); }
.xui-button[data-size=icon] { padding:0; }
.xui-button:not(:disabled):hover { filter:none; }
.xui-button:disabled { opacity:.5; }
.xui-button[data-variant=outline], .xui-button[data-variant=secondary] { border-color:transparent; background:var(--ad-fill); color:var(--xui-text); }
.xui-button[data-variant=outline]:not(:disabled):hover, .xui-button[data-variant=secondary]:not(:disabled):hover { background:var(--ad-fill-hover); }
.xui-button[data-variant=outline]:not(:disabled):active, .xui-button[data-variant=secondary]:not(:disabled):active { background:var(--ad-fill-pressed); }
.xui-button[data-variant=ghost]:not(:disabled):hover { background:var(--ad-fill); color:var(--xui-text); }
.xui-button[data-variant=primary]:not(:disabled):hover { background:color-mix(in srgb,var(--xui-primary) 90%,#000); }
.xui-button[data-variant=primary]:not(:disabled):active { background:color-mix(in srgb,var(--xui-primary) 80%,#000); }
.xui-button[data-variant=danger] { background:var(--ad-fill); color:var(--xui-danger); }
.xui-button[data-variant=danger]:not(:disabled):hover { background:color-mix(in srgb,var(--xui-danger) 12%,transparent); }
.xui-dialog-footer .xui-button[data-variant=danger] { background:var(--xui-danger); color:var(--xui-surface); }
.xui-dialog-footer .xui-button[data-variant=danger]:not(:disabled):hover { background:color-mix(in srgb,var(--xui-danger) 88%,var(--xui-text)); }
.xui-button:focus-visible, .xui-tab:focus-visible, .xui-switch:focus-visible, .xui-checkbox:focus-visible { outline:2px solid var(--ad-accent); outline-offset:1px; }
.xui-input, .xui-select-trigger { border-color:transparent; background:var(--ad-fill); transition:background-color var(--xui-duration-fast),border-color var(--xui-duration-fast),box-shadow var(--xui-duration-fast); }
.xui-input { padding:5px 10px; }
.xui-select-trigger { padding:0 10px; }
.xui-input:not(:disabled):hover, .xui-select-trigger:not([data-disabled]):hover { background:var(--ad-fill-hover); }
.xui-input:focus, .xui-input:focus-visible, .xui-select-trigger:focus-visible, .xui-select-trigger[data-popup-open] { outline:0; border-color:var(--ad-accent); background:var(--xui-surface); box-shadow:0 0 0 3px var(--ad-ring); }
.xui-input::placeholder { opacity:.8; }
.xui-select-trigger svg { color:var(--xui-muted); }
.xui-label { font-weight:500; }
.xui-checkbox { border:1.5px solid color-mix(in srgb,var(--xui-text) 30%,transparent); background:transparent; width:16px; height:16px; border-radius:4px; }
.xui-select-popup, .xui-menu, .xui-popover, .xui-tooltip { border-color:var(--ad-hairline); }
.xui-select-item[data-highlighted] { background:var(--ad-fill); }
.xui-dialog { border-color:var(--ad-hairline); }
.xui-dialog-title { font-size:calc(16px * var(--xui-font-scale)); }
.xui-dialog-footer { border-top-color:var(--ad-hairline); padding:12px 22px; }
.xui-tabs-list { gap:24px; border-bottom-color:var(--ad-hairline); }
.xui-tab { font-weight:500; }
.xui-tab[data-active] { font-weight:600; }
.xui-tab:not([data-active]):hover { color:var(--xui-text); }
.xui-tab-indicator { background:var(--xui-primary); }
.xui-badge { padding:1px 8px; border-radius:999px; background:var(--ad-fill); font-size:calc(12px * var(--xui-font-scale)); font-weight:600; line-height:18px; }
.xui-badge[data-tone=success] { background:color-mix(in srgb,var(--xui-success) 12%,transparent); }
.xui-badge[data-tone=danger] { background:color-mix(in srgb,var(--xui-danger) 12%,transparent); }
.xui-badge[data-tone=warning] { background:color-mix(in srgb,var(--xui-warning) 14%,transparent); }
.xui-table-scroll { border:1px solid var(--ad-hairline); border-radius:var(--xui-radius-panel); background:var(--xui-surface); }
.xui-table-head { background:transparent; }
.xui-table-head .xui-table-cell { font-size:calc(12px * var(--xui-font-scale)); font-weight:600; }
.xui-table-cell { padding:8px 12px; border-bottom-color:var(--ad-hairline); }
.xui-table tbody .xui-table-row:last-child .xui-table-cell { border-bottom:0; }
.xui-table tbody .xui-table-row:hover { background:var(--ad-fill); }
.xui-table-row[data-selected=true], .xui-table tbody .xui-table-row[data-selected=true]:hover { background:var(--ad-accent-soft); }
.xui-table .ellipsis { max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.xui-table td.ellipsis { font-family:var(--ad-mono); font-size:calc(13px * var(--xui-font-scale)); }
.xui-table td.ellipsis strong { font-weight:500; }
.xui-empty { display:grid; place-content:center; justify-items:center; gap:10px; padding:40px 24px; color:var(--xui-muted); }
.xui-empty h3 { font-weight:500; }
.xui-empty p { margin:0; }
.xui-error { padding:12px; }

.ad-app { min-height:100vh; padding:16px 20px 24px; color:var(--xui-text); background:var(--xui-surface); }
.ad-header, .ad-toolbar, .ad-console-header, .ad-section-title, .ad-actions, .ad-filter-row, .ad-form-actions { display:flex; align-items:center; gap:8px; }
.ad-header { justify-content:space-between; gap:16px; margin-bottom:8px; }
.ad-header-copy { display:flex; align-items:baseline; flex-wrap:wrap; gap:4px 16px; min-width:0; }
.ad-title { margin:0; font-size:calc(18px * var(--xui-font-scale)); font-weight:600; line-height:32px; letter-spacing:-.01em; }
.ad-kpis { display:flex; flex-wrap:wrap; gap:4px 14px; color:var(--xui-muted); font-size:calc(12px * var(--xui-font-scale)); }
.ad-kpis strong { margin-left:2px; color:var(--xui-text); font-weight:600; font-variant-numeric:tabular-nums; }
.ad-kpis .live strong { color:var(--ad-accent); }
.ad-kpis .failed strong { color:var(--xui-danger); }
.ad-description, .ad-muted { color:var(--xui-muted); }
.ad-description { margin:2px 0 0; font-size:calc(12px * var(--xui-font-scale)); }
.ad-toast { margin:0 0 8px; padding:6px 10px; border-radius:var(--xui-radius-control); background:color-mix(in srgb,var(--xui-success) 10%,transparent); color:var(--xui-success); font-size:calc(13px * var(--xui-font-scale)); }
.ad-form-note { margin:0 0 12px; font-size:calc(12px * var(--xui-font-scale)); }
.ad-runs, .ad-assets { margin-top:0; }
.ad-toolbar, .ad-filter-row { flex-wrap:wrap; margin-bottom:12px; }
.ad-toolbar { justify-content:space-between; }
.xui-input.ad-search { width:300px; max-width:100%; }
.ad-status-tabs { display:inline-flex; flex:none; gap:2px; padding:2px; border-radius:var(--xui-radius-control); background:var(--ad-fill); }
.xui-button.ad-status-tab { gap:6px; min-height:28px; height:28px; padding:0 10px; border-radius:calc(var(--xui-radius-control) - 2px); background:transparent; color:var(--xui-muted); font-size:calc(13px * var(--xui-font-scale)); }
.xui-button.ad-status-tab:not(:disabled):hover { background:transparent; color:var(--xui-text); }
.xui-button.ad-status-tab strong { font-weight:400; font-variant-numeric:tabular-nums; opacity:.75; }
.xui-button.ad-status-tab.active, .xui-button.ad-status-tab.active:not(:disabled):hover { background:var(--xui-surface); color:var(--xui-text); box-shadow:0 0 0 1px var(--ad-hairline),0 1px 2px color-mix(in srgb,#000 8%,transparent); }
.ad-master-detail { display:grid; grid-template-columns:minmax(260px,30%) minmax(0,1fr); min-height:560px; border:1px solid var(--ad-hairline); border-radius:var(--xui-radius-panel); overflow:hidden; background:var(--xui-surface); }
.ad-run-list { min-height:0; padding:6px; border-right:1px solid var(--ad-hairline); overflow:auto; }
.ad-run-list [role=listbox] { display:grid; gap:2px; }
.xui-button.ad-run-card { display:block; width:100%; height:auto; padding:10px 12px; border:0; border-radius:var(--xui-radius-control); color:var(--xui-text); background:transparent; font-weight:400; text-align:left; white-space:normal; }
.xui-button.ad-run-card:not(:disabled):hover { background:var(--ad-fill); }
.xui-button.ad-run-card.active, .xui-button.ad-run-card.active:not(:disabled):hover { background:var(--ad-accent-soft); }
.xui-button.ad-run-card:focus-visible { outline-offset:-2px; }
.ad-run-card-title, .ad-metadata { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.ad-run-card-title strong { overflow:hidden; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
.ad-run-card p { margin:4px 0; overflow:hidden; color:var(--xui-muted); text-overflow:ellipsis; white-space:nowrap; font:calc(12px * var(--xui-font-scale))/1.5 var(--ad-mono); }
.ad-run-outcome { display:block; margin:0 0 4px; overflow:hidden; color:var(--xui-danger); text-overflow:ellipsis; white-space:nowrap; font-size:calc(12px * var(--xui-font-scale)); }
.ad-metadata { color:var(--xui-muted); font-size:calc(12px * var(--xui-font-scale)); font-variant-numeric:tabular-nums; }
.ad-console { min-width:0; overflow:auto; }
.ad-console-header { justify-content:space-between; align-items:flex-start; gap:16px; padding:14px 16px 12px; border-bottom:1px solid var(--ad-hairline); }
.ad-console-header h2 { margin:0; overflow:hidden; font-size:calc(15px * var(--xui-font-scale)); font-weight:600; line-height:24px; text-overflow:ellipsis; white-space:nowrap; }
.ad-console-header .ad-run-card-title { justify-content:flex-start; }
.ad-console-header .ad-actions { flex:none; }
.ad-console-body { display:grid; gap:16px; padding:16px; }
.ad-flow { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0; padding:2px 0; }
.ad-flow-card { position:relative; min-width:0; padding-right:12px; --ad-stage:var(--xui-muted); }
.ad-flow-card::after { content:""; position:absolute; top:10px; left:28px; right:8px; height:2px; border-radius:2px; background:var(--ad-hairline); }
.ad-flow-card:last-child::after { display:none; }
.ad-flow-card.done::after { background:color-mix(in srgb,var(--xui-success) 45%,transparent); }
.ad-stage-mark { display:grid; place-items:center; width:22px; height:22px; margin-bottom:8px; border-radius:50%; background:var(--ad-fill); color:var(--xui-muted); }
.ad-flow-card.pending .ad-stage-mark { background:transparent; box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--xui-text) 22%,transparent); }
.ad-flow-card.done .ad-stage-mark { background:var(--xui-success); color:var(--xui-surface); }
.ad-flow-card.failed .ad-stage-mark { background:var(--xui-danger); color:var(--xui-surface); }
.ad-flow-card.active .ad-stage-mark { background:var(--ad-accent-soft); box-shadow:inset 0 0 0 1.5px var(--ad-accent); }
.ad-flow-card.active .ad-stage-mark::before { content:""; width:8px; height:8px; border-radius:50%; background:var(--ad-accent); animation:ad-pulse 1.6s ease-in-out infinite; }
.ad-flow-card.active .ad-stage-mark svg { display:none; }
.ad-flow-card strong, .ad-flow-card small { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ad-flow-card strong { font-weight:600; font-size:calc(13px * var(--xui-font-scale)); }
.ad-flow-card.pending strong, .ad-flow-card.skipped strong { color:var(--xui-muted); font-weight:500; }
.ad-flow-card.failed strong { color:var(--xui-danger); }
.ad-flow-card small { margin-top:2px; color:var(--xui-muted); font-size:calc(12px * var(--xui-font-scale)); font-variant-numeric:tabular-nums; }
.ad-section { min-width:0; border:1px solid var(--ad-hairline); border-radius:var(--xui-radius-panel); background:var(--xui-surface); }
.ad-section-title { justify-content:space-between; min-height:40px; padding:4px 8px 0 14px; font-size:calc(13px * var(--xui-font-scale)); }
.ad-section-title strong { font-weight:600; }
.ad-section-title > span { display:flex; align-items:center; padding-right:6px; }
.ad-section-body { padding:6px 14px 14px; }
.ad-split { display:grid; grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr); gap:16px; }
.ad-code { max-height:260px; margin:0; overflow:auto; padding:10px 12px; border-radius:var(--xui-radius-control); color:var(--xui-text); background:var(--ad-fill); font:calc(12px * var(--xui-font-scale))/1.6 var(--ad-mono); white-space:pre-wrap; word-break:break-word; }
.ad-live { display:inline-flex; align-items:center; gap:6px; color:var(--ad-accent); font-size:calc(12px * var(--xui-font-scale)); font-weight:500; }
.ad-live::before { content:""; width:6px; height:6px; border-radius:50%; background:currentColor; animation:ad-pulse 1.6s ease-in-out infinite; }
.ad-process { display:grid; gap:10px; max-height:360px; overflow:auto; }
.ad-process-wrap { display:grid; gap:8px; }
.ad-process-live { margin:0; }
.ad-new-records { justify-self:end; }
.ad-message { padding:0 0 0 12px; border-left:2px solid var(--ad-hairline); }
.ad-message pre { margin:0; overflow:auto; color:var(--xui-text); font:inherit; line-height:1.6; white-space:pre-wrap; word-break:break-word; }
.ad-message pre + pre { margin-top:4px; }
.ad-message pre.ad-thought { color:var(--xui-muted); font-size:calc(13px * var(--xui-font-scale)); }
.ad-tool { border-radius:var(--xui-radius-control); background:var(--ad-fill); }
.ad-tool summary { display:flex; align-items:center; gap:8px; min-height:32px; padding:0 10px; border-radius:var(--xui-radius-control); cursor:pointer; list-style:none; font-size:calc(12px * var(--xui-font-scale)); }
.ad-tool summary::-webkit-details-marker { display:none; }
.ad-tool summary::before { content:""; flex:none; width:6px; height:6px; margin:0 3px; border-right:1.5px solid var(--xui-muted); border-bottom:1.5px solid var(--xui-muted); transform:rotate(-45deg); transition:transform var(--xui-duration-fast); }
.ad-tool[open] summary::before { transform:rotate(45deg); }
.ad-tool summary:hover { background:var(--ad-fill); }
.ad-tool summary:focus-visible { outline:2px solid var(--ad-accent); outline-offset:-2px; }
.ad-tool-name { overflow:hidden; font-family:var(--ad-mono); text-overflow:ellipsis; white-space:nowrap; }
.ad-tool-status { flex:none; margin-left:auto; color:var(--xui-muted); }
.ad-tool .ad-code { max-height:180px; background:var(--xui-surface); }
.ad-tool-value { padding:0 10px 10px; }
.ad-tool-value > strong { display:block; margin-bottom:4px; color:var(--xui-muted); font-size:calc(12px * var(--xui-font-scale)); font-weight:500; }
.ad-inspector { display:grid; grid-template-columns:minmax(88px,max-content) minmax(0,1fr); gap:8px 16px; margin:0; font-size:calc(13px * var(--xui-font-scale)); }
.ad-inspector dt { color:var(--xui-muted); }
.ad-inspector dd { min-width:0; margin:0; overflow-wrap:anywhere; font-variant-numeric:tabular-nums; user-select:text; -webkit-user-select:text; }
.ad-inspector dd.mono { font-family:var(--ad-mono); }
.ad-filter-row > .xui-select-trigger { width:168px; }
.ad-filter-row > .xui-input { width:240px; max-width:100%; }
.ad-pagination { display:flex; align-items:center; justify-content:flex-end; gap:8px; margin-top:12px; color:var(--xui-muted); font-size:calc(12px * var(--xui-font-scale)); font-variant-numeric:tabular-nums; }
.ad-pagination > .xui-select-trigger { width:112px; }
.ad-error { display:grid; justify-items:center; gap:8px; padding:40px 24px; color:var(--xui-danger); text-align:center; }
.ad-notice { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 12px; border:1px solid color-mix(in srgb,var(--xui-warning) 32%,transparent); border-radius:var(--xui-radius-control); color:var(--xui-text); background:color-mix(in srgb,var(--xui-warning) 8%,transparent); font-size:calc(13px * var(--xui-font-scale)); }
.ad-notice .xui-button { margin:-2px -6px -2px 0; flex:none; }
.ad-assets > .ad-notice { margin-bottom:12px; }
.ad-textarea { min-height:132px; font-family:var(--ad-mono); font-size:calc(13px * var(--xui-font-scale)); resize:vertical; }
.ad-field-error { margin:8px 0 0; color:var(--xui-danger); font-size:calc(13px * var(--xui-font-scale)); }
.ad-confirm-detail { margin:0; color:var(--xui-muted); line-height:1.6; }
.ad-shared-dialog { width:min(600px,calc(100vw - 32px)); }
.ad-shared-dialog .xui-field { margin-bottom:14px; }
.ad-shared-dialog .ad-notice { margin-top:12px; }
.ad-settings { max-width:720px; }
.ad-settings .ad-title { margin-bottom:12px; }
.ad-settings-groups { display:grid; gap:16px; }
.ad-group { display:grid; gap:14px; padding:16px; border:1px solid var(--ad-hairline); border-radius:var(--xui-radius-panel); background:var(--xui-surface); }
.ad-group h2 { margin:0; font-size:calc(14px * var(--xui-font-scale)); font-weight:600; }
.ad-credential { display:grid; grid-template-columns:minmax(0,1fr) auto auto; gap:8px; align-items:center; }
.ad-credential .xui-button { min-height:var(--xui-control-height); padding:0 12px; font-size:var(--xui-font-size); }
.ad-credential-label { display:inline-flex; align-items:center; gap:8px; }
.ad-resolved { display:grid; grid-template-columns:max-content minmax(0,1fr); gap:4px 12px; margin:0; color:var(--xui-muted); font-size:calc(12px * var(--xui-font-scale)); }
.ad-resolved dd { margin:0; overflow-wrap:anywhere; font-family:var(--ad-mono); }
@keyframes ad-pulse { 50% { opacity:.35; } }
[data-xui-motion=reduced] .ad-live::before, [data-xui-motion=reduced] .ad-stage-mark::before { animation:none; }
@media (prefers-reduced-motion: reduce) { .ad-live::before, .ad-stage-mark::before { animation:none; } }
@media (max-width: 900px) { .ad-master-detail, .ad-split { grid-template-columns:1fr; } .ad-run-list { max-height:300px; border-right:0; border-bottom:1px solid var(--ad-hairline); } }
@media (max-width: 620px) { .ad-app { padding:12px; } .ad-header, .ad-console-header { flex-wrap:wrap; } .ad-filter-row > .xui-select-trigger { flex:1 1 150px; min-width:0; width:auto; } .ad-filter-row > .xui-input { flex:1 1 220px; width:auto; } .ad-flow { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px 0; } .ad-flow-card:nth-child(2n)::after { display:none; } .ad-credential { grid-template-columns:1fr; } .ad-actions { flex-wrap:wrap; } }
`;
