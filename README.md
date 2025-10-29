# Web Component POC

A small proof-of-concept that builds React-based web components from source in `src/components` and outputs ES modules into `dist`.

## Prerequisites

- Node.js (LTS) and npm
- A modern browser that supports ES modules for testing the built component

## Setup

Install dependencies:

```powershell
npm install
```

Provide environment variables (example):

- Set `VITE_POLARIS_API_URL` in a `.env` file or your environment. This is read by the `CaseInfoSummary` component to call the API.

## Build

Build the project (the repo includes a custom build script that produces component modules and a bundle):

```powershell
npm run build
```

The build script is `scripts/build.ts`. Output goes to `dist/` (individual component ES modules and a bundled file under `dist/bundle`).

## Serve / Preview

To preview the project locally (serve the built files or run Vite dev server if configured):

```powershell
npm run start
```

## Usage

Include the built component module and the custom element in any HTML page. Example:

```html
<!doctype html>
<html>
	<head></head>
	<body>
		<case-info-summary caseid="123" urn="URN-0001"></case-info-summary>
		<script type="module" src="./dist/src/components/CaseInfoWC/CaseInfoWC.js"></script>
	</body>
</html>
```

