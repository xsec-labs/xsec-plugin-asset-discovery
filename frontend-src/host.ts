import type {
  AssetFilters,
  AssetPage,
  CollectionRun,
  CollectorProvider,
  CollectorSettings,
  CollectorSettingsInput,
  ExecutionDefaults,
  ExecutionLine,
  ExecutionLogPage,
  ExecutionSnapshot,
  PluginHost,
  Project,
} from "./types";

const ASSET_PAGE_LIMIT = 100;

type StartInput = {
  prompt: string;
  name?: string;
  provider: CollectorProvider;
  workdir?: string;
};

type StartResult = {
  collection_run_id: string;
  run_id?: string;
  process: { id: string };
};

type CredentialKind = "hunter" | "fofa" | "tianyan";

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { items?: unknown }).items)) {
    return (value as { items: T[] }).items;
  }
  throw new Error("Host RPC 返回了无效列表数据");
}

function asRecord<T>(value: unknown): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Host RPC 返回了无效对象数据");
  return value as T;
}

function asExecutionLine(value: unknown, index: number, cursor?: string): ExecutionLine {
  if (typeof value === "string") {
    const line = { timestamp: 0, direction: "process" as const, text: value, legacy: true };
    return cursor ? { ...line, identity: `legacy-page-${cursor}-${index}` } : line;
  }
  const line = asRecord<Record<string, unknown>>(value);
  if (typeof line.timestamp !== "number" || !Number.isFinite(line.timestamp) || typeof line.text !== "string") throw new Error("Host RPC 返回了无效日志行");
  if (line.direction !== "client_to_agent" && line.direction !== "agent_to_client" && line.direction !== "process") throw new Error("Host RPC 返回了无效日志方向");
  return { timestamp: line.timestamp, direction: line.direction, text: line.text };
}

function asExecutionLogPage(value: unknown, cursor?: string): ExecutionLogPage {
  const page = asRecord<Record<string, unknown>>(value);
  if (!Array.isArray(page.lines) || (page.next_cursor !== null && typeof page.next_cursor !== "string")) throw new Error("Host RPC 返回了无效日志页");
  if (page.truncated !== undefined && typeof page.truncated !== "boolean") throw new Error("Host RPC 返回了无效日志截断状态");
  return { lines: page.lines.map((line, index) => asExecutionLine(line, index, cursor)), next_cursor: page.next_cursor, truncated: page.truncated };
}

function createRunApi(host: PluginHost) {
  return {
    async defaults(): Promise<ExecutionDefaults> {
      return asRecord<ExecutionDefaults>(await host.request("xsec.asset-discovery.defaults.get", {}));
    },
    async runs(): Promise<CollectionRun[]> {
      return asArray<CollectionRun>(await host.request("xsec.asset-discovery.runs.list", {}));
    },
    async start(input: StartInput): Promise<StartResult> {
      return asRecord<StartResult>(await host.request("xsec.asset-discovery.runs.start", input));
    },
    async stop(runId: string) {
      return host.request("xsec.asset-discovery.runs.stop", { runId });
    },
    async deleteRun(runId: string) {
      return host.request("xsec.asset-discovery.runs.delete", { runId });
    },
    async execution(runId: string): Promise<ExecutionSnapshot> {
      return asRecord<ExecutionSnapshot>(await host.request("xsec.asset-discovery.runs.execution.get", { runId }));
    },
    async logs(runId: string, cursor?: string): Promise<ExecutionLogPage> {
      return asExecutionLogPage(await host.request("xsec.asset-discovery.runs.logs.list", {
        runId,
        cursor,
        limit: 50,
      }), cursor);
    },
  };
}

function createAssetApi(host: PluginHost) {
  return {
    async assets(filters: AssetFilters): Promise<AssetPage> {
      const offset = (filters.page - 1) * filters.pageSize;
      return asRecord<AssetPage>(await host.request("xsec.asset-discovery.assets.list", {
        runId: filters.runId,
        provider: filters.provider,
        query: filters.query,
        importedOnly: filters.importedOnly,
        offset,
        limit: Math.min(filters.pageSize, ASSET_PAGE_LIMIT),
      }));
    },
    async projects(): Promise<Project[]> {
      return asArray<Project>(await host.request("xsec.asset-discovery.projects.list", {}));
    },
    async importAssets(ids: string[], projectId: string) {
      return asRecord<{ created: number; skipped: number; failed: number }>(
        await host.request("xsec.asset-discovery.assets.import", { ids, projectId }),
      );
    },
    async deleteAssets(ids: string[]) {
      return asRecord<{ deleted: number }>(await host.request("xsec.asset-discovery.assets.delete", { ids }));
    },
  };
}

/** Validate the complete runtime view before exposing it to any plugin consumer. */
export function parseCollectorSettings(value: unknown): CollectorSettings {
  const view = asRecord<Record<string, unknown>>(value);
  if (view.provider !== "hunter" && view.provider !== "fofa") throw new Error("资产收集数据源响应无效");
  const text = (key: string): string => {
    const result = view[key];
    if (typeof result !== "string") throw new Error(`资产收集设置响应字段 ${key} 无效`);
    return result;
  };
  const configured = (key: string): boolean => {
    const result = view[key];
    if (typeof result !== "boolean") throw new Error(`资产收集设置响应字段 ${key} 无效`);
    return result;
  };
  return {
    provider: view.provider,
    hunterApiBaseUrl: text("hunterApiBaseUrl"),
    fofaApiBaseUrl: text("fofaApiBaseUrl"),
    hunterSkillPath: text("hunterSkillPath"),
    fofaSkillPath: text("fofaSkillPath"),
    resolvedHunterSkillPath: text("resolvedHunterSkillPath"),
    resolvedFofaSkillPath: text("resolvedFofaSkillPath"),
    hunterApiKeyConfigured: configured("hunterApiKeyConfigured"),
    fofaApiKeyConfigured: configured("fofaApiKeyConfigured"),
    tianyanApiKeyConfigured: configured("tianyanApiKeyConfigured"),
  };
}

function settingsInput(input: CollectorSettingsInput): CollectorSettingsInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("资产收集设置输入无效");
  const fields = ["provider", "hunterApiBaseUrl", "fofaApiBaseUrl", "hunterSkillPath", "fofaSkillPath"];
  if (Object.keys(input).length !== fields.length || Object.keys(input).some(key => !fields.includes(key)) ||
    (input.provider !== "hunter" && input.provider !== "fofa") || fields.some(key => typeof input[key as keyof CollectorSettingsInput] !== "string")) {
    throw new Error("资产收集设置输入无效");
  }
  return { provider: input.provider, hunterApiBaseUrl: input.hunterApiBaseUrl, fofaApiBaseUrl: input.fofaApiBaseUrl, hunterSkillPath: input.hunterSkillPath, fofaSkillPath: input.fofaSkillPath };
}

function createSettingsApi(host: PluginHost) {
  return {
    async settings(): Promise<CollectorSettings> {
      return parseCollectorSettings(await host.request("xsec.asset-discovery.settings.get", {}));
    },
    async saveSettings(input: CollectorSettingsInput): Promise<CollectorSettings> {
      return parseCollectorSettings(await host.request("xsec.asset-discovery.settings.set", settingsInput(input)));
    },
    async saveCredential(kind: CredentialKind, value: string): Promise<CollectorSettings> {
      return parseCollectorSettings(await host.request("xsec.asset-discovery.credentials.set", { kind, value }));
    },
    async clearCredential(kind: CredentialKind): Promise<CollectorSettings> {
      return parseCollectorSettings(await host.request("xsec.asset-discovery.credentials.clear", { kind }));
    },
    async openSettings() {
      return host.request("xsec.plugin.settings.open", {});
    },
  };
}

export function createAssetDiscoveryApi(host: PluginHost) {
  return {
    ...createRunApi(host),
    ...createAssetApi(host),
    ...createSettingsApi(host),
  };
}

export type AssetDiscoveryApi = ReturnType<typeof createAssetDiscoveryApi>;
