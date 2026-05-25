# sentinel-logger-sdk

Node.js SDK for **Sentinel Logger** — send application logs to your Sentinel dashboard with one function call.

## Installation

```bash
npm install sentinel-logger-sdk
```

> **Local monorepo usage:** If you're developing inside the Sentinel monorepo, you can reference the SDK directly:
>
> ```bash
> npm install ../sdk
> ```

## Quick Start

```js
import sentinel from "sentinel-logger-sdk";

// 1. Initialise with your API key and application name
sentinel.init({
  apiKey: "your-api-key-from-dashboard",
  appName: "my-app",
  // baseUrl: "http://localhost:5000",  ← defaults to localhost
});

// 2. Send logs
await sentinel.info("Server started on port 3000");
await sentinel.warn("Disk usage above 80%");
await sentinel.error("Database connection lost");

// Or use the generic log() method
await sentinel.log({ message: "User signed in", level: "INFO" });
```

## API Reference

### `sentinel.init(options)`

Initialise the SDK. **Must be called before sending any logs.**

| Option    | Type   | Required | Default                   | Description                          |
| --------- | ------ | -------- | ------------------------- | ------------------------------------ |
| `apiKey`  | string | ✅        | —                         | Your developer API key (from the dashboard) |
| `appName` | string | ✅        | —                         | The registered application name      |
| `baseUrl` | string | ❌        | `http://localhost:5000`   | The Sentinel backend URL             |

### `sentinel.log({ message, level })`

Send a log entry. Returns the created/updated log document.

| Field     | Type   | Required | Values                    |
| --------- | ------ | -------- | ------------------------- |
| `message` | string | ✅        | Any string                |
| `level`   | string | ✅        | `"INFO"`, `"WARN"`, `"ERROR"` |

### `sentinel.info(message)` / `sentinel.warn(message)` / `sentinel.error(message)`

Convenience shortcuts — equivalent to calling `log()` with the corresponding level.

## How It Works

The SDK sends a `POST` request to:

```
POST {baseUrl}/api/applications/{appName}/logs
Headers: { "x-api-key": "{apiKey}" }
Body:    { "message": "...", "level": "INFO|WARN|ERROR" }
```

If the same `message + level` combination already exists for your app, the backend **increments the count** instead of creating a duplicate — so you get automatic deduplication and occurrence tracking.

## Error Handling

All SDK methods throw descriptive errors prefixed with `[Sentinel SDK]`:

```js
try {
  await sentinel.info("Something happened");
} catch (err) {
  console.error(err.message);
  // → "[Sentinel SDK] Failed to send log: Invalid API key"
}
```

## License

ISC
