// Storage helpers — supports both S3 (Manus Forge) and local filesystem
// In local dev mode (no BUILT_IN_FORGE_API_URL), files are saved to ./uploads/

import { ENV } from './_core/env';
import fs from 'fs';
import path from 'path';

// ============================================================
// Mode detection
// ============================================================

const isLocalStorage = !ENV.forgeApiUrl || !ENV.forgeApiKey;

// ============================================================
// Local filesystem storage
// ============================================================

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

async function localPut(
  relKey: string,
  data: Buffer | Uint8Array | string
): Promise<{ key: string; url: string }> {
  ensureUploadsDir();
  const key = relKey.replace(/^\/+/, '');
  const filePath = path.join(UPLOADS_DIR, key);

  // Create subdirectories if needed
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const buffer = typeof data === 'string' ? Buffer.from(data) : data;
  fs.writeFileSync(filePath, buffer);

  return { key, url: `file://${filePath}` };
}

async function localGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, '');
  const filePath = path.join(UPLOADS_DIR, key);
  return { key, url: `file://${filePath}` };
}

// ============================================================
// S3 / Forge storage (original)
// ============================================================

type StorageConfig = { baseUrl: string; apiKey: string };

function getStorageConfig(): StorageConfig {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(
  baseUrl: string,
  relKey: string,
  apiKey: string
): Promise<string> {
  const downloadApiUrl = new URL(
    "v1/storage/downloadUrl",
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey),
  });
  return (await response.json()).url;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function toFormData(
  data: Buffer | Uint8Array | string,
  contentType: string,
  fileName: string
): FormData {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

async function s3Put(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

async function s3Get(relKey: string): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey),
  };
}

// ============================================================
// Public API — automatically selects local or S3
// ============================================================

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  if (isLocalStorage) {
    console.log(`[Storage] Saving locally: ${relKey}`);
    return localPut(relKey, data);
  }
  return s3Put(relKey, data, contentType);
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  if (isLocalStorage) {
    return localGet(relKey);
  }
  return s3Get(relKey);
}

export async function storageDelete(relKey: string): Promise<void> {
  if (isLocalStorage) {
    console.log(`[Storage] Deleting locally: ${relKey}`);
    return localDelete(relKey);
  }
  return s3Delete(relKey);
}

// ============================================================
// Internal delete helpers
// ============================================================

async function localDelete(relKey: string): Promise<void> {
  const key = relKey.replace(/^\/+/, '');
  const filePath = path.join(UPLOADS_DIR, key);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    console.warn(`[Storage] File not found for deletion: ${filePath}`);
  }
}

async function s3Delete(relKey: string): Promise<void> {
  // Attempt to delete from S3/Forge if supported
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  
  const deleteUrl = new URL(
    "v1/storage/delete", 
    ensureTrailingSlash(baseUrl)
  );
  deleteUrl.searchParams.set("path", key);
  
  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: buildAuthHeaders(apiKey),
    });

    if (!response.ok) {
      // If 404, maybe it's already gone, so strict error might not be needed.
      // But if 403 or 500, we should know.
      console.warn(`[Storage] Cloud delete failed: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.warn("[Storage] Cloud delete error:", err);
  }
}
