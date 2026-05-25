import axios from "axios";

// ─── Private state ────────────────────────────────────────────────────────────
let _config = null;

// ─── init ─────────────────────────────────────────────────────────────────────
/**
 * Initialise the Sentinel Logger SDK.
 *
 * @param {Object}  options
 * @param {string}  options.apiKey   - Your developer API key (from the dashboard).
 * @param {string}  options.appName  - The registered application name (no spaces).
 * @param {string} [options.baseUrl] - Backend URL. Defaults to http://localhost:5000.
 *
 * @example
 *   import sentinel from "sentinel-logger-sdk";
 *   sentinel.init({ apiKey: "abc-123", appName: "my-app" });
 */
export function init({ apiKey, appName, baseUrl = "http://localhost:5000" }) {
  if (!apiKey) throw new Error("[Sentinel SDK] apiKey is required");
  if (!appName) throw new Error("[Sentinel SDK] appName is required");

  _config = {
    apiKey,
    appName: appName.toLowerCase().trim(),
    baseUrl: baseUrl.replace(/\/+$/, ""), // strip trailing slashes
  };
}

// ─── log ──────────────────────────────────────────────────────────────────────
/**
 * Send a log entry to Sentinel Logger.
 *
 * @param {Object}  entry
 * @param {string}  entry.message - The log message.
 * @param {string}  entry.level   - One of "INFO", "WARN", or "ERROR".
 * @returns {Promise<Object>} The created/updated log document from the server.
 *
 * @example
 *   await sentinel.log({ message: "User signed in", level: "INFO" });
 */
export async function log({ message, level }) {
  if (!_config) {
    throw new Error(
      "[Sentinel SDK] Call init() before sending logs."
    );
  }

  if (!message) throw new Error("[Sentinel SDK] message is required");
  if (!level) throw new Error("[Sentinel SDK] level is required");

  const upperLevel = level.toUpperCase();
  if (!["INFO", "WARN", "ERROR"].includes(upperLevel)) {
    throw new Error(
      `[Sentinel SDK] level must be INFO, WARN, or ERROR — got "${level}"`
    );
  }

  try {
    const { data } = await axios.post(
      `${_config.baseUrl}/api/applications/${_config.appName}/logs`,
      { message, level: upperLevel },
      {
        headers: { "x-api-key": _config.apiKey },
      }
    );
    return data;
  } catch (err) {
    // Wrap Axios errors with a friendlier message
    const serverMsg =
      err.response?.data?.message || err.message || "Unknown error";
    throw new Error(`[Sentinel SDK] Failed to send log: ${serverMsg}`);
  }
}

// ─── Convenience helpers ──────────────────────────────────────────────────────
/**
 * Send an INFO-level log.
 * @param {string} message
 */
export async function info(message) {
  return log({ message, level: "INFO" });
}

/**
 * Send a WARN-level log.
 * @param {string} message
 */
export async function warn(message) {
  return log({ message, level: "WARN" });
}

/**
 * Send an ERROR-level log.
 * @param {string} message
 */
export async function error(message) {
  return log({ message, level: "ERROR" });
}

// ─── Default export (for `import sentinel from ...`) ──────────────────────────
export default { init, log, info, warn, error };
