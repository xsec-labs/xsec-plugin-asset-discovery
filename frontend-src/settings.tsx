import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Badge, Button, Dialog, ErrorState, Field, Input, Section, Select, Spinner } from "@xsec/ui-react";
import type { AssetDiscoveryApi } from "./host";
import type { CollectorSettings, CollectorSettingsInput } from "./types";
import { settingsStyles } from "./settings-styles";

type Settings = CollectorSettings;
type Draft = CollectorSettingsInput;
type SecretKind = "hunter" | "fofa" | "tianyan";
type Operation = "load" | "settings" | `store-${SecretKind}` | `clear-${SecretKind}`;
type Failure = { title: string; text: string; mutation: boolean; errorId: string; readError?: string };
const secretKinds: readonly SecretKind[] = ["hunter", "fofa", "tianyan"];
const secretLabels: Record<SecretKind, string> = { hunter: "鹰图 Hunter", fofa: "FOFA", tianyan: "天眼查" };
const configuredFields = { hunter: "hunterApiKeyConfigured", fofa: "fofaApiKeyConfigured", tianyan: "tianyanApiKeyConfigured" } as const;
function toDraft(settings: Settings): Draft {
  return { provider: settings.provider, hunterApiBaseUrl: settings.hunterApiBaseUrl, fofaApiBaseUrl: settings.fofaApiBaseUrl, hunterSkillPath: settings.hunterSkillPath, fofaSkillPath: settings.fofaSkillPath };
}
function sameDraft(a: Draft, b: Draft) {
  return a.provider === b.provider && a.hunterApiBaseUrl === b.hunterApiBaseUrl && a.fofaApiBaseUrl === b.fofaApiBaseUrl && a.hunterSkillPath === b.hunterSkillPath && a.fofaSkillPath === b.fofaSkillPath;
}
function errorText(reason: unknown, secrets: readonly string[] = []) {
  let text = reason instanceof Error ? reason.message : String(reason);
  for (const secret of secrets) {
    if (secret.length) text = text.split(secret).join("[已隐藏]");
    if (secret.trim().length) text = text.split(secret.trim()).join("[已隐藏]");
  }
  return text.slice(0, 1200);
}

export function SettingsPage({ api }: { api: AssetDiscoveryApi }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [readState, setReadState] = useState<"loading" | "ready" | "failed">("loading");
  const [operation, setOperation] = useState<Operation | null>("load");
  const [error, setError] = useState<Failure | null>(null);
  const [notice, setNotice] = useState<string>();
  const [uncertain, setUncertain] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [secretDrafts, setSecretDrafts] = useState<Record<SecretKind, string>>({ hunter: "", fofa: "", tianyan: "" });
  const [secretErrors, setSecretErrors] = useState<Partial<Record<SecretKind, string>>>({});
  const [confirmation, setConfirmation] = useState<{ kind: SecretKind; action: "clear" | "replace" } | null>(null);
  const confirmClear = confirmation?.action === "clear" ? confirmation.kind : null;
  const confirmReplace = confirmation?.action === "replace" ? confirmation.kind : null;
  const dialogKind = confirmation?.kind ?? null;
  const dialogOpen = dialogKind !== null;
  const secretValues = useRef(secretDrafts);
  secretValues.current = secretDrafts;
  const pending = useRef(false);
  const generation = useRef(0);
  const form = useRef<HTMLDivElement>(null);
  const clearHunter = useRef<HTMLButtonElement>(null), clearFofa = useRef<HTMLButtonElement>(null), clearTianyan = useRef<HTMLButtonElement>(null);
  const hunterInput = useRef<HTMLInputElement>(null), fofaInput = useRef<HTMLInputElement>(null), tianyanInput = useRef<HTMLInputElement>(null);
  const cancelClear = useRef<HTMLButtonElement>(null);
  const dialogReturn = useRef<RefObject<HTMLButtonElement | HTMLInputElement>>(clearHunter);
  const clearButtons = { hunter: clearHunter, fofa: clearFofa, tianyan: clearTianyan };
  const secretInputs = { hunter: hunterInput, fofa: fofaInput, tianyan: tianyanInput };
  const busy = operation !== null;
  const dirty = draft !== null && settings !== null && !sameDraft(draft, toDraft(settings));
  const canWrite = settings !== null && draft !== null && readState === "ready" && !uncertain && !busy;
  const editable = draft !== null && !busy;

  const load = useCallback(async (preserveDraft: boolean) => {
    if (pending.current) return;
    pending.current = true;
    const owner = ++generation.current;
    const operationId = crypto.randomUUID(), started = performance.now();
    console.info("asset-discovery.settings.read.started", { operation_id: operationId });
    setOperation("load");
    setReadState("loading");
    setNotice(undefined);
    try {
      const next = await api.settings();
      if (generation.current !== owner) {
        console.debug("asset-discovery.settings.read.discarded", { operation_id: operationId, outcome: "stale", duration_ms: Math.round(performance.now() - started) });
        return;
      }
      console.info("asset-discovery.settings.read.completed", { operation_id: operationId, outcome: "completed", duration_ms: Math.round(performance.now() - started) });
      setSettings(next);
      if (!preserveDraft) { setDraft(toDraft(next)); setFieldErrors({}); }
      setReadState("ready");
      setUncertain(false);
      setError(previous => previous?.mutation ? { ...previous, readError: undefined } : null);
      setNotice(preserveDraft ? "当前配置状态已重新读取，未保存的设置草稿已保留。" : "资产收集设置已读取。");
    } catch (reason) {
      console.error("asset-discovery.settings.read.failed", { operation_id: operationId, outcome: "failed", duration_ms: Math.round(performance.now() - started) });
      if (generation.current === owner) {
        setReadState("failed");
        setError(previous => previous?.mutation
          ? { ...previous, readError: errorText(reason, Object.values(secretValues.current)) }
          : { title: "读取资产收集设置失败", text: errorText(reason, Object.values(secretValues.current)), mutation: false, errorId: operationId });
      }
    } finally {
      if (generation.current === owner) { pending.current = false; setOperation(null); }
    }
  }, [api]);
  useEffect(() => {
    console.debug("asset-discovery.settings.mounted");
    void load(false);
    return () => { generation.current += 1; pending.current = false; console.debug("asset-discovery.settings.disposed"); };
  }, [load]);

  const mutate = async (kind: Exclude<Operation, "load">, request: () => Promise<Settings>, title: string, success: (next: Settings) => void) => {
    if (pending.current || !canWrite) return;
    pending.current = true;
    const owner = ++generation.current;
    const operationId = crypto.randomUUID(), started = performance.now();
    console.info("asset-discovery.settings.mutation.started", { operation_id: operationId, operation: kind });
    setOperation(kind);
    setNotice(undefined);
    try {
      // Each mutation returns the runtime's complete read-back view.
      const next = await request();
      if (generation.current !== owner) {
        console.debug("asset-discovery.settings.mutation.discarded", { operation_id: operationId, operation: kind, outcome: "stale", duration_ms: Math.round(performance.now() - started) });
        return;
      }
      setSettings(next);
      setError(null);
      setUncertain(false);
      success(next);
      console.info("asset-discovery.settings.mutation.completed", { operation_id: operationId, operation: kind, outcome: "completed", duration_ms: Math.round(performance.now() - started) });
    } catch (reason) {
      console.error("asset-discovery.settings.mutation.failed", { operation_id: operationId, operation: kind, outcome: "failed", duration_ms: Math.round(performance.now() - started) });
      if (generation.current === owner) {
        setUncertain(true);
        setError({ title, text: errorText(reason, Object.values(secretValues.current)), mutation: true, errorId: operationId });
      }
    } finally {
      if (generation.current === owner) { pending.current = false; setOperation(null); }
    }
  };

  const save = async () => {
    if (pending.current || !canWrite || dialogOpen || draft === null) return;
    const errors: Partial<Record<keyof Draft, string>> = {};
    if (!draft.hunterApiBaseUrl.trim()) errors.hunterApiBaseUrl = "请输入鹰图 API Host";
    if (!draft.fofaApiBaseUrl.trim()) errors.fofaApiBaseUrl = "请输入 FOFA API Host";
    setFieldErrors(errors);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      form.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const input: CollectorSettingsInput = {
      provider: draft.provider,
      hunterApiBaseUrl: draft.hunterApiBaseUrl.trim(), fofaApiBaseUrl: draft.fofaApiBaseUrl.trim(),
      hunterSkillPath: draft.hunterSkillPath.trim(), fofaSkillPath: draft.fofaSkillPath.trim(),
    };
    await mutate("settings", () => api.saveSettings(input), "保存资产收集设置失败", next => {
      setDraft(toDraft(next));
      setNotice("资产收集设置已保存。");
    });
  };
  const storeSecret = async (kind: SecretKind, confirmed = false) => {
    if (pending.current || !canWrite || (dialogOpen && (!confirmed || confirmReplace !== kind))) return;
    const value = secretDrafts[kind].trim();
    if (!value) {
      setSecretErrors(current => ({ ...current, [kind]: "请先输入密钥" }));
      secretInputs[kind].current?.focus();
      return;
    }
    if (settings?.[configuredFields[kind]] && !confirmed) {
      dialogReturn.current = secretInputs[kind];
      setConfirmation({ kind, action: "replace" });
      return;
    }
    await mutate(`store-${kind}`, () => api.saveCredential(kind, value), `保存${secretLabels[kind]}密钥失败`, next => {
      if (!next[configuredFields[kind]]) throw new Error("写入后的凭据状态为未配置，请重新读取确认当前配置。");
      setSecretDrafts(current => ({ ...current, [kind]: "" }));
      setConfirmation(null);
      setNotice(`${secretLabels[kind]}密钥已保存到账户凭据库。`);
    });
  };
  const clearSecret = async () => {
    if (confirmClear === null || pending.current || !canWrite) return;
    const kind = confirmClear;
    await mutate(`clear-${kind}`, () => api.clearCredential(kind), `清除${secretLabels[kind]}密钥失败`, next => {
      if (next[configuredFields[kind]]) throw new Error("清除后的凭据状态仍为已配置，请重新读取确认当前配置。");
      setSecretDrafts(current => ({ ...current, [kind]: "" }));
      dialogReturn.current = secretInputs[kind];
      setConfirmation(null);
      setNotice(`${secretLabels[kind]}密钥已清除。`);
    });
  };
  const edit = (key: keyof Draft, value: string) => {
    if (pending.current || dialogOpen) return;
    setDraft(current => current === null ? null : { ...current, [key]: value });
    setFieldErrors(current => ({ ...current, [key]: undefined }));
    setNotice(undefined);
  };
  const pathFields = [
    { key: "hunterApiBaseUrl", label: "鹰图 API Host", placeholder: "https://hunter.qianxin.com/openApi/search", hint: undefined },
    { key: "fofaApiBaseUrl", label: "FOFA API Host", placeholder: "https://fofoapi.com", hint: "可填写镜像或代理网关地址。" },
    { key: "hunterSkillPath", label: "鹰图 Skill 路径（可选）", placeholder: "留空使用应用内置 Skill", hint: !uncertain && readState === "ready" && settings ? `当前解析：${settings.resolvedHunterSkillPath}` : undefined },
    { key: "fofaSkillPath", label: "FOFA Skill 路径（可选）", placeholder: "留空使用应用内置 Skill", hint: !uncertain && readState === "ready" && settings ? `当前解析：${settings.resolvedFofaSkillPath}` : undefined },
  ] as const;

  return <main className="ad-app collector-settings" aria-busy={busy}>
    <style>{settingsStyles}</style>
    <header className="collector-settings-heading"><h1>资产收集</h1></header>
    <div className="collector-settings-toolbar">
      <div>{operation === "load" ? <Spinner label="正在读取资产收集设置…" /> : notice ? <p className="collector-settings-notice" role="status">{notice}</p> : null}</div>
      <Button variant="outline" disabled={busy || dialogOpen} onClick={() => void load(dirty)}>重新读取</Button>
    </div>
    {error && !dialogOpen ? <ErrorState title={error.title} errorId={error.errorId} description={<>{error.text}{error.readError ? <span className="collector-settings-reconcile">重新读取失败：{error.readError}</span> : null}{uncertain ? <span className="collector-settings-reconcile">操作可能已部分完成。请重新读取确认当前配置后再操作。</span> : null}</>} /> : null}
    <Section title="默认数据源与 API Host" className="collector-settings-section">
      <div ref={form} role="form" aria-label="资产收集设置" className="collector-settings-form">
        <Field label="默认收集数据源" hint="用于快速启动与资产发现未指定数据源的收集任务。" error={fieldErrors.provider}>{field => <Select
          {...field} aria-label="默认收集数据源" name="provider" value={draft?.provider ?? null} disabled={!editable || dialogOpen} placeholder="读取后选择数据源"
          options={[{ value: "hunter", label: "鹰图 Hunter（通配符域名 / HackerOne）" }, { value: "fofa", label: "FOFA + 天眼查（企业名称 / 通配符域名）" }]}
          onValueChange={value => { if (value === "hunter" || value === "fofa") edit("provider", value); }}
        />}</Field>
        <div className="collector-settings-fields">{pathFields.map(item => <Field key={item.key} label={item.label} hint={item.hint} error={fieldErrors[item.key]}>{field => <Input
          {...field} name={item.key} value={draft?.[item.key] ?? ""} disabled={!editable || dialogOpen} placeholder={item.placeholder} spellCheck={false}
          required={item.key === "hunterApiBaseUrl" || item.key === "fofaApiBaseUrl"}
          onKeyDown={event => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (!event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229) void save();
          }}
          onChange={event => edit(item.key, event.currentTarget.value)}
        />}</Field>)}</div>
        <div className="collector-settings-form-actions"><Button type="button" onClick={() => void save()} loading={operation === "settings"} disabled={!canWrite || dialogOpen}>保存设置</Button>
          {dirty ? <span className="collector-settings-draft-status">有未保存的设置</span> : null}</div>
      </div>
    </Section>
    <Section title="密钥" className="collector-settings-section">
      <div className="collector-settings-secrets">{secretKinds.map(kind => {
        const label = secretLabels[kind], configured = settings?.[configuredFields[kind]];
        const known = settings !== null && readState === "ready" && !uncertain;
        return <div key={kind} className="collector-settings-secret" data-secret-kind={kind}>
          <div className="collector-settings-secret-heading"><h3>{label} API Key</h3><Badge tone={known && configured ? "success" : "neutral"}>{known ? configured ? "已配置" : "未配置" : "待确认"}</Badge></div>
          {kind === "tianyan" ? <p className="collector-settings-hint">企业名称与区域检索需要；直接收集 FOFA 通配符范围时可选。内置 FOFA Skill 已提供天眼查 CLI。</p> : null}
          <div role="form" aria-label={`${label}密钥设置`} className="collector-settings-secret-form">
            <Field label={`${label} API 密钥`} error={secretErrors[kind]}>{field => <Input {...field} ref={secretInputs[kind]} type="password" aria-label={`${label} API 密钥`}
              value={secretDrafts[kind]} disabled={!editable || dialogOpen} placeholder={known && configured ? "已配置，输入新值可覆盖" : "输入 API Key"}
              autoComplete="new-password" spellCheck={false} autoCapitalize="none"
              onKeyDown={event => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                if (!event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229) void storeSecret(kind);
              }}
              onChange={event => {
                if (pending.current || dialogOpen) return;
                const value = event.currentTarget.value;
                setSecretDrafts(current => ({ ...current, [kind]: value }));
                setSecretErrors(current => ({ ...current, [kind]: undefined }));
                setNotice(undefined);
              }}
            />}</Field>
            <div className="collector-settings-secret-actions"><Button type="button" onClick={() => void storeSecret(kind)} aria-label={`保存${label} API 密钥`} loading={operation === `store-${kind}`} disabled={!canWrite || dialogOpen}>保存</Button>
              <Button ref={clearButtons[kind]} type="button" variant="danger" aria-label={`清除${label} API 密钥`} disabled={!canWrite || !configured || dialogOpen} onClick={() => {
                if (pending.current) return;
                dialogReturn.current = clearButtons[kind];
                setConfirmation({ kind, action: "clear" });
              }}>清除</Button></div>
          </div>
        </div>;
      })}</div>
    </Section>
    <details className="collector-settings-help"><summary>收集完成后如何导入资产</summary><ol>
      <li>在“资产发现”或“快速启动”中启动收集，Agent 按内置 Skill 产出 <code>final_assets.txt</code>。</li>
      <li>Agent 调用 MCP 工具 <code>xsec_asset_import</code>，将最终清单内容写入跨项目资产发现池。</li>
      <li>打开“资产发现”的资产池，筛选并选择目标项目，执行“导入到项目”；已存在资产会跳过。</li>
    </ol><p>凭据与备注在项目资产页补充。</p></details>
    <Dialog open={dialogOpen} title={dialogKind ? `${confirmReplace ? "替换" : "清除"}${secretLabels[dialogKind]}密钥` : "确认密钥操作"}
      description={confirmReplace ? "将使用输入的新密钥替换账户凭据库中的现有密钥。" : "将从账户凭据库移除此密钥，后续收集需要重新配置。"}
      className="collector-settings-dialog" initialFocus={cancelClear}
      finalFocus={() => {
        const target = dialogReturn.current.current;
        return target?.disabled ? target.closest("[data-secret-kind]")?.querySelector<HTMLInputElement>('input[type="password"]') ?? null : target;
      }} preventOutsideDismissal={busy}
      onOpenChange={open => { if (!open && !pending.current) { setConfirmation(null); } }}
      footer={<><Button ref={cancelClear} variant="outline" disabled={busy} onClick={() => { setConfirmation(null); }}>取消</Button>
        <Button variant="danger" loading={dialogKind !== null && operation === `${confirmReplace ? "store" : "clear"}-${dialogKind}`}
          disabled={busy || !canWrite || (confirmClear !== null && !settings?.[configuredFields[confirmClear]])}
          onClick={() => { if (confirmReplace !== null) void storeSecret(confirmReplace, true); else void clearSecret(); }}>{confirmReplace ? "确认替换" : "确认清除"}</Button></>}>
      <p>{dialogKind ? `确认${confirmReplace ? "替换" : "清除"}${secretLabels[dialogKind]}密钥？` : "确认密钥操作？"}</p>
      {error ? <ErrorState title={error.title} errorId={error.errorId} description={<>{error.text}{error.readError ? <span className="collector-settings-reconcile">重新读取失败：{error.readError}</span> : null}{uncertain ? <span className="collector-settings-reconcile">操作可能已部分完成，请重新读取确认当前配置。</span> : null}</>}
        action={uncertain || readState === "failed" ? <Button variant="outline" disabled={busy} onClick={() => void load(dirty)}>重新读取</Button> : undefined} /> : null}
    </Dialog>
  </main>;
}
