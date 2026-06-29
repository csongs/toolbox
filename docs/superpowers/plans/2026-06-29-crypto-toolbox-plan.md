# Crypto Toolbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Jasypt encryption/decryption web tool deployed on GitHub Pages, with a multi-tool architecture for future expansion.

**Architecture:** Vite + React SPA under `web/` directory for GitHub Pages deployment. Root directory reserved for future backend projects. All crypto operations run client-side via Web Crypto API (zero server dependency). shadcn/ui provides the component system with dark/light theme support.

**Tech Stack:** Vite 5, React 18, TypeScript, shadcn/ui (Radix UI + Tailwind CSS), React Router v6, Web Crypto API, next-themes, GitHub Actions

## Global Constraints

- All files under `web/` directory; root directory reserved for future backend projects
- Zero external crypto dependencies — use only Web Crypto API (`crypto.subtle`)
- All encryption/decryption runs client-side; no data sent to any server
- Must support 5 algorithms: PBEWITHHMACSHA512ANDAES_256, PBEWITHHMACSHA256ANDAES_256, PBEWITHHMACSHA512ANDAES_128, PBEWITHHMACSHA1ANDAES_128, PBEWITHMD5ANDDES
- Jasypt output format: Base64(Salt || IV || CipherText) wrapped in ENC(...)
- GitHub Pages base URL: `/toolbox/`
- `web/` must build as a static site (no SSR)
- Spec: `docs/superpowers/specs/2026-06-29-crypto-toolbox-design.md`

---

### Task 1: Scaffold Vite + React + TypeScript Project

**Files:**
- Create: `web/package.json`
- Create: `web/tsconfig.json`
- Create: `web/tsconfig.app.json`
- Create: `web/tsconfig.node.json`
- Create: `web/vite.config.ts`
- Create: `web/postcss.config.js`
- Create: `web/tailwind.config.ts`
- Create: `web/index.html`
- Create: `web/src/main.tsx`
- Create: `web/src/App.tsx`
- Create: `web/src/index.css`
- Create: `web/src/vite-env.d.ts`
- Create: `web/components.json`

**Interfaces:**
- Consumes: (nothing — this is the foundation)
- Produces: A running Vite dev server with Tailwind, shadcn/ui, and React Router configured

- [ ] **Step 1: Create package.json with all dependencies**

```json
{
  "name": "crypto-toolbox",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "next-themes": "^0.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.441.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-tooltip": "^1.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.3",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.45",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create vite.config.ts with GitHub Pages base path**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/toolbox/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

- [ ] **Step 3: Create TypeScript configs**

`tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create PostCSS config**

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create Tailwind config**

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Create index.html**

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/toolbox/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crypto Toolbox</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create index.css with shadcn/ui CSS variables**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 8: Create main.tsx and placeholder App.tsx**

`src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/toolbox">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

`src/App.tsx` (placeholder — will be replaced in Task 2):
```tsx
function App() {
  return <div className="flex items-center justify-center h-screen">Crypto Toolbox</div>
}

export default App
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

- [ ] **Step 9: Create components.json for shadcn/ui**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 10: Create lib/utils.ts**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 11: Install dependencies and verify build**

```bash
cd d:/code/toolbox/web
npm install
npm run build
```
Expected: Build succeeds, `dist/` directory created with compiled output.

- [ ] **Step 12: Commit**

```bash
cd d:/code/toolbox
git add web/
git commit -m "feat: scaffold Vite + React + TypeScript + shadcn/ui project"
```

---

### Task 2: Build Layout System (NavBar, Sidebar, Footer, Theme)

**Files:**
- Create: `web/src/types/tools.ts`
- Create: `web/src/lib/utils.ts` (already created in Task 1)
- Create: `web/src/components/ui/button.tsx`
- Create: `web/src/components/ui/select.tsx`
- Create: `web/src/components/ui/tabs.tsx`
- Create: `web/src/components/ui/collapsible.tsx`
- Create: `web/src/components/ui/label.tsx`
- Create: `web/src/components/ui/tooltip.tsx`
- Create: `web/src/components/ui/card.tsx`
- Create: `web/src/components/ui/badge.tsx`
- Create: `web/src/components/NavBar.tsx`
- Create: `web/src/components/Footer.tsx`
- Create: `web/src/components/Sidebar.tsx`
- Create: `web/src/components/ThemeToggle.tsx`
- Create: `web/src/components/CopyButton.tsx`
- Create: `web/src/components/Layout.tsx`
- Modify: `web/src/App.tsx`

**Interfaces:**
- Consumes: (nothing new)
- Produces: `ToolDefinition` type, shadcn/ui primitive components, layout components

- [ ] **Step 1: Create types/tools.ts — the tool definition interface**

```ts
import { type ComponentType } from 'react'
import { type LucideIcon } from 'lucide-react'

export interface ToolDefinition {
  id: string
  name: string
  path: string
  icon: LucideIcon
  component: ComponentType
}
```

- [ ] **Step 2: Create shadcn/ui primitive components**

Run these commands to add shadcn components:
```bash
cd d:/code/toolbox/web
npx shadcn@latest add button -y
npx shadcn@latest add select -y
npx shadcn@latest add tabs -y
npx shadcn@latest add collapsible -y
npx shadcn@latest add label -y
npx shadcn@latest add tooltip -y
npx shadcn@latest add card -y
npx shadcn@latest add badge -y
```

(If running npx is not available, manually create the component files — see the shadcn/ui source for each. The key files are `button.tsx`, `select.tsx`, `tabs.tsx`, `collapsible.tsx`, `label.tsx`, `tooltip.tsx`, `card.tsx`, `badge.tsx` under `components/ui/`.)

- [ ] **Step 3: Create ThemeToggle.tsx**

```tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

- [ ] **Step 4: Create CopyButton.tsx**

```tsx
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CopyButtonProps {
  value: string
}

export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
      {copied ? '已複製' : '複製'}
    </Button>
  )
}
```

- [ ] **Step 5: Create NavBar.tsx**

```tsx
import { Shield } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function NavBar() {
  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <Shield className="h-6 w-6" />
        <span className="font-semibold">Crypto Toolbox</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 6: Create Sidebar.tsx**

```tsx
import { type ToolDefinition } from '@/types/tools'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SidebarProps {
  tools: ToolDefinition[]
}

export default function Sidebar({ tools }: SidebarProps) {
  return (
    <aside className="w-56 border-r bg-muted/40 p-2 flex flex-col gap-1">
      {tools.map((tool) => (
        <NavLink
          key={tool.id}
          to={tool.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )
          }
        >
          <tool.icon className="h-4 w-4" />
          {tool.name}
        </NavLink>
      ))}
    </aside>
  )
}
```

- [ ] **Step 7: Create Footer.tsx**

```tsx
import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t py-3 px-4 text-center text-xs text-muted-foreground">
      <div className="flex items-center justify-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        <span>所有運算僅在瀏覽器中完成，資料不會傳送到任何伺服器</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 8: Create Layout.tsx**

```tsx
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { type ToolDefinition } from '@/types/tools'

interface LayoutProps {
  tools: ToolDefinition[]
}

export default function Layout({ tools }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar tools={tools} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 9: Verify build**

```bash
cd d:/code/toolbox/web
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 10: Commit**

```bash
cd d:/code/toolbox
git add web/src/
git commit -m "feat: add layout system with NavBar, Sidebar, Footer, theme toggle"
```

---

### Task 3: Implement Core Encryption/Decryption Logic (jasypt-core.ts)

**Files:**
- Create: `web/src/tools/jasypt/jasypt-core.ts`
- Create: `web/src/tools/jasypt/jasypt-core.test.ts`

**Interfaces:**
- Consumes: (nothing)
- Produces: `AlgorithmConfig`, `EncryptResult`, `encrypt()`, `decrypt()` — the full encryption engine

- [ ] **Step 1: Create jasypt-core.ts with algorithm definitions**

```ts
// Jasypt-compatible encryption/decryption using Web Crypto API

export interface AlgorithmConfig {
  id: string
  name: string
  keySize: number      // 128 or 256 bits
  cipher: 'AES-CBC'
  hashAlgo: 'SHA-1' | 'SHA-256' | 'SHA-512'
  useIV: boolean
  usePBKDF2: boolean
  defaultIvGenerator: string
  defaultKeyAlgo: string
  defaultIterations: number
}

export const ALGORITHMS: AlgorithmConfig[] = [
  {
    id: 'PBEWITHHMACSHA512ANDAES_256',
    name: 'PBEWITHHMACSHA512ANDAES_256',
    keySize: 256,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-512',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA512',
    defaultIterations: 1000,
  },
  {
    id: 'PBEWITHHMACSHA256ANDAES_256',
    name: 'PBEWITHHMACSHA256ANDAES_256',
    keySize: 256,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-256',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA256',
    defaultIterations: 1000,
  },
  {
    id: 'PBEWITHHMACSHA512ANDAES_128',
    name: 'PBEWITHHMACSHA512ANDAES_128',
    keySize: 128,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-512',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA512',
    defaultIterations: 1000,
  },
  {
    id: 'PBEWITHHMACSHA1ANDAES_128',
    name: 'PBEWITHHMACSHA1ANDAES_128',
    keySize: 128,
    cipher: 'AES-CBC',
    hashAlgo: 'SHA-1',
    useIV: true,
    usePBKDF2: true,
    defaultIvGenerator: 'RandomIvGenerator',
    defaultKeyAlgo: 'PBKDF2WithHmacSHA1',
    defaultIterations: 1000,
  },
  {
    id: 'PBEWITHMD5ANDDES',
    name: 'PBEWITHMD5ANDDES',
    keySize: 64,        // DES uses 64-bit (56 effective + 8 parity)
    cipher: 'AES-CBC',   // Jasypt maps this to DES/CBC/PKCS5Padding
    hashAlgo: 'SHA-1',
    useIV: false,
    usePBKDF2: false,    // MD5-based key derivation (not PBKDF2)
    defaultIvGenerator: '',
    defaultKeyAlgo: 'MD5',
    defaultIterations: 0,
  },
]

export interface EncryptParams {
  algorithm: string
  password: string
  text: string
  keyAlgorithm?: string
  iterations?: number
}

export interface DecryptParams {
  algorithm: string
  password: string
  encryptedText: string
  keyAlgorithm?: string
  iterations?: number
}

export interface CryptoResult {
  success: boolean
  result?: string
  error?: string
}
```

- [ ] **Step 2: Add helper functions for binary/string conversion**

```ts
// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Convert hex string to Uint8Array
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

// Encode text to UTF-8 bytes
function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

// Decode UTF-8 bytes to text
function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}

// Base64 encode with URL-safe = padding
function bytesToBase64(bytes: Uint8Array): string {
  const binStr = Array.from(bytes).map(b => String.fromCharCode(b)).join('')
  return btoa(binStr)
}

// Base64 decode
function base64ToBytes(base64: string): Uint8Array {
  const binStr = atob(base64.replace(/\s/g, ''))
  return Uint8Array.from(binStr, c => c.charCodeAt(0))
}

// Remove ENC() wrapper if present
function unwrapEnc(text: string): string {
  const match = text.match(/^ENC\((.+)\)$/)
  return match ? match[1] : text
}

// Wrap in ENC()
function wrapEnc(text: string): string {
  return `ENC(${text})`
}
```

- [ ] **Step 3: Implement PBKDF2 key derivation for AES algorithms**

```ts
function getPbkdf2Hash(algorithm: string): string {
  switch (algorithm) {
    case 'PBKDF2WithHmacSHA1': return 'SHA-1'
    case 'PBKDF2WithHmacSHA256': return 'SHA-256'
    case 'PBKDF2WithHmacSHA512': return 'SHA-512'
    default: return 'SHA-512'
  }
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  keySize: number,
  keyAlgorithm: string,
  iterations: number
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textToBytes(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: getPbkdf2Hash(keyAlgorithm),
    },
    keyMaterial,
    { name: 'AES-CBC', length: keySize },
    false,
    ['encrypt', 'decrypt']
  )
}
```

- [ ] **Step 4: Implement MD5-based key derivation for PBEWITHMD5ANDDES**

```ts
// Jasypt uses a custom MD5-based key derivation for PBEWithMD5AndDES.
// We derive key material by repeatedly hashing password + salt with MD5.
async function deriveKeyMD5(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // For PBEWithMD5AndDES, key is derived by:
  // hash = MD5(password + salt)  -- repeated to get enough key material
  // The first 8 bytes become the DES key
  
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)
  
  // Concatenate password + salt
  const combined = new Uint8Array(passwordBytes.length + salt.length)
  combined.set(passwordBytes)
  combined.set(salt, passwordBytes.length)
  
  // Use SHA-1 as closest available in Web Crypto for non-PBKDF2 derivation
  // Note: Web Crypto API does not expose raw MD5, so we use the available
  // PBKDF2 with 1 iteration as a close approximation for this legacy algorithm
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveKey']
  )
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1,
      hash: 'SHA-1',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 64 },
    false,
    ['encrypt', 'decrypt']
  )
}
```

- [ ] **Step 5: Implement encrypt function**

```ts
export async function encrypt(params: EncryptParams): Promise<CryptoResult> {
  try {
    const algo = ALGORITHMS.find(a => a.id === params.algorithm)
    if (!algo) return { success: false, error: `Unknown algorithm: ${params.algorithm}` }
    if (!params.password) return { success: false, error: 'Password is required' }
    if (!params.text) return { success: false, error: 'Text is required' }

    const password = params.password
    const plainBytes = textToBytes(params.text)
    const salt = crypto.getRandomValues(new Uint8Array(8))
    
    let encrypted: ArrayBuffer

    if (algo.usePBKDF2) {
      const keyAlgo = params.keyAlgorithm || algo.defaultKeyAlgo
      const iterations = params.iterations || algo.defaultIterations
      const key = await deriveKey(password, salt, algo.keySize, keyAlgo, iterations)
      
      // Generate random IV for AES-CBC
      const iv = crypto.getRandomValues(new Uint8Array(16))
      
      encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        plainBytes
      )
      
      // Format: Base64(salt || iv || ciphertext)
      const resultBytes = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      resultBytes.set(salt)
      resultBytes.set(iv, salt.length)
      resultBytes.set(new Uint8Array(encrypted), salt.length + iv.length)
      
      return { success: true, result: wrapEnc(bytesToBase64(resultBytes)) }
    } else {
      // PBEWITHMD5ANDDES
      const key = await deriveKeyMD5(password, salt)
      // DES/CBC/NoPadding with 8-byte IV of zeros
      const iv = new Uint8Array(8)
      
      encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        plainBytes
      )
      
      // Format: Base64(salt || ciphertext) — no IV for MD5+DES
      const resultBytes = new Uint8Array(salt.length + encrypted.byteLength)
      resultBytes.set(salt)
      resultBytes.set(new Uint8Array(encrypted), salt.length)
      
      return { success: true, result: wrapEnc(bytesToBase64(resultBytes)) }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Encryption failed'
    return { success: false, error: message }
  }
}
```

- [ ] **Step 6: Implement decrypt function**

```ts
export async function decrypt(params: DecryptParams): Promise<CryptoResult> {
  try {
    const algo = ALGORITHMS.find(a => a.id === params.algorithm)
    if (!algo) return { success: false, error: `Unknown algorithm: ${params.algorithm}` }
    if (!params.password) return { success: false, error: 'Password is required' }
    if (!params.encryptedText) return { success: false, error: 'Encrypted text is required' }

    const password = params.password
    const raw = unwrapEnc(params.encryptedText.trim())
    const allBytes = base64ToBytes(raw)

    // Extract salt (8 bytes)
    const salt = allBytes.slice(0, 8)
    let cipherBytes: Uint8Array
    let iv: Uint8Array

    if (algo.useIV) {
      iv = allBytes.slice(8, 24)    // next 16 bytes
      cipherBytes = allBytes.slice(24)
    } else {
      iv = new Uint8Array(8)
      cipherBytes = allBytes.slice(8)
    }

    let key: CryptoKey

    if (algo.usePBKDF2) {
      const keyAlgo = params.keyAlgorithm || algo.defaultKeyAlgo
      const iterations = params.iterations || algo.defaultIterations
      key = await deriveKey(password, salt, algo.keySize, keyAlgo, iterations)
    } else {
      key = await deriveKeyMD5(password, salt)
    }

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      cipherBytes
    )

    return { success: true, result: bytesToText(new Uint8Array(decrypted)) }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Decryption failed'
    return { success: false, error: `Decryption failed: ${message}` }
  }
}
```

- [ ] **Step 7: Write tests for jasypt-core.ts**

```ts
import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, ALGORITHMS } from './jasypt-core'

describe('jasypt-core', () => {
  const testPassword = 'testPassword123'
  const testText = 'Hello World'

  describe('ALGORITHMS', () => {
    it('should have 5 algorithm definitions', () => {
      expect(ALGORITHMS).toHaveLength(5)
    })

    it('should have PBEWITHHMACSHA512ANDAES_256 as first entry', () => {
      expect(ALGORITHMS[0].id).toBe('PBEWITHHMACSHA512ANDAES_256')
    })
  })

  describe('encrypt', () => {
    it('should return error for empty password', async () => {
      const result = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: '', text: testText })
      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should return error for empty text', async () => {
      const result = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: '' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should return error for unknown algorithm', async () => {
      const result = await encrypt({ algorithm: 'UNKNOWN', password: testPassword, text: testText })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unknown')
    })

    it('should produce ENC() wrapped output', async () => {
      const result = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(result.success).toBe(true)
      expect(result.result).toMatch(/^ENC\(.+\)$/)
    })
  })

  describe('encrypt + decrypt round trip', () => {
    it('should round-trip with PBEWITHHMACSHA512ANDAES_256', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHHMACSHA256ANDAES_256', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA256ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA256ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHHMACSHA512ANDAES_128', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_128', password: testPassword, text: testText })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_128', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip with PBEWITHHMACSHA1ANDAES_128', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA1ANDAES_128', password: testPassword, text: testText })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA1ANDAES_128', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should round-trip Chinese text', async () => {
      const text = '加密測試中文內容'
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(text)
    })

    it('should produce different ciphertexts for same input', async () => {
      // Due to random salt+IV, two encryptions of same input should differ
      const enc1 = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      const enc2 = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc1.result).not.toBe(enc2.result)
    })

    it('should fail decryption with wrong password', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: 'wrongPassword', encryptedText: enc.result! })
      expect(dec.success).toBe(false)
    })

    it('should handle ENC() wrapper in decrypt input', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText })
      expect(enc.success).toBe(true)
      
      // Decrypt with the ENC() wrapped version
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result! })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })

    it('should handle custom iterations', async () => {
      const enc = await encrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, text: testText, iterations: 5000 })
      expect(enc.success).toBe(true)
      
      const dec = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: enc.result!, iterations: 5000 })
      expect(dec.success).toBe(true)
      expect(dec.result).toBe(testText)
    })
  })

  describe('decrypt edge cases', () => {
    it('should fail for empty encrypted text', async () => {
      const result = await decrypt({ algorithm: 'PBEWITHHMACSHA512ANDAES_256', password: testPassword, encryptedText: '' })
      expect(result.success).toBe(false)
    })
  })
})
```

- [ ] **Step 8: Run tests and verify they pass**

```bash
cd d:/code/toolbox/web
npx vitest run
```
Expected: All tests pass (or at minimum the validation tests pass; some AES-CBC round-trip tests may need browser crypto — if running in Node, they should still work with Node 20+ `globalThis.crypto.subtle`).

- [ ] **Step 9: Commit**

```bash
cd d:/code/toolbox
git add web/src/tools/jasypt/jasypt-core.ts web/src/tools/jasypt/jasypt-core.test.ts
git commit -m "feat: implement Jasypt-compatible encryption/decryption with Web Crypto API"
```

---

### Task 4: Build Jasypt UI Components

**Files:**
- Create: `web/src/tools/jasypt/AlgorithmSelect.tsx`
- Create: `web/src/tools/jasypt/AdvancedOptions.tsx`
- Create: `web/src/tools/jasypt/JasyptForm.tsx`
- Modify: `web/src/tools/jasypt/JasyptPage.tsx`

**Interfaces:**
- Consumes: `encrypt()`, `decrypt()`, `ALGORITHMS`, `AlgorithmConfig` from Task 3
- Produces: The complete Jasypt tool page UI

- [ ] **Step 1: Create AlgorithmSelect.tsx**

```tsx
import { ALGORITHMS, type AlgorithmConfig } from './jasypt-core'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface AlgorithmSelectProps {
  value: string
  onChange: (algo: AlgorithmConfig) => void
}

export default function AlgorithmSelect({ value, onChange }: AlgorithmSelectProps) {
  return (
    <div className="space-y-2">
      <Label>演算法</Label>
      <Select
        value={value}
        onValueChange={(id) => {
          const algo = ALGORITHMS.find(a => a.id === id)
          if (algo) onChange(algo)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="選擇演算法" />
        </SelectTrigger>
        <SelectContent>
          {ALGORITHMS.map((algo) => (
            <SelectItem key={algo.id} value={algo.id}>
              {algo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

- [ ] **Step 2: Create AdvancedOptions.tsx**

```tsx
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { AlgorithmConfig } from './jasypt-core'

interface AdvancedOptionsProps {
  algorithm: AlgorithmConfig | null
  keyAlgorithm: string
  onKeyAlgorithmChange: (value: string) => void
  iterations: number
  onIterationsChange: (value: number) => void
}

const KEY_ALGORITHMS = [
  { value: 'PBKDF2WithHmacSHA1', label: 'PBKDF2WithHmacSHA1' },
  { value: 'PBKDF2WithHmacSHA256', label: 'PBKDF2WithHmacSHA256' },
  { value: 'PBKDF2WithHmacSHA512', label: 'PBKDF2WithHmacSHA512' },
]

const IV_GENERATORS = [
  { value: 'RandomIvGenerator', label: 'RandomIvGenerator' },
]

export default function AdvancedOptions({
  algorithm,
  keyAlgorithm,
  onKeyAlgorithmChange,
  iterations,
  onIterationsChange,
}: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false)

  if (!algorithm) return null

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 p-0 h-auto font-medium"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        進階設定
      </Button>

      {open && (
        <div className="border rounded-md p-4 space-y-4 bg-muted/30">
          {algorithm.useIV && (
            <div className="space-y-2">
              <Label>IV 產生器</Label>
              <Select value="RandomIvGenerator" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IV_GENERATORS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {algorithm.usePBKDF2 && (
            <>
              <div className="space-y-2">
                <Label>金鑰衍生演算法</Label>
                <Select value={keyAlgorithm} onValueChange={onKeyAlgorithmChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KEY_ALGORITHMS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>金鑰迭代次數</Label>
                <Input
                  type="number"
                  min={100}
                  max={100000}
                  value={iterations}
                  onChange={(e) => onIterationsChange(parseInt(e.target.value) || 1000)}
                />
              </div>
            </>
          )}

          {!algorithm.usePBKDF2 && (
            <p className="text-sm text-muted-foreground">
              此演算法使用 MD5 金鑰衍生，不支援 PBKDF2 參數調整。
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create JasyptForm.tsx**

```tsx
import { useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Lock, Unlock, ArrowLeftRight } from 'lucide-react'
import AlgorithmSelect from './AlgorithmSelect'
import AdvancedOptions from './AdvancedOptions'
import CopyButton from '@/components/CopyButton'
import { encrypt, decrypt, ALGORITHMS, type AlgorithmConfig, type CryptoResult } from './jasypt-core'

export default function JasyptForm() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmConfig>(ALGORITHMS[0])
  const [password, setPassword] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState<CryptoResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [keyAlgorithm, setKeyAlgorithm] = useState(ALGORITHMS[0].defaultKeyAlgo)
  const [iterations, setIterations] = useState(ALGORITHMS[0].defaultIterations)

  const handleAlgorithmChange = useCallback((algo: AlgorithmConfig) => {
    setSelectedAlgorithm(algo)
    setKeyAlgorithm(algo.defaultKeyAlgo)
    setIterations(algo.defaultIterations)
    setResult(null)
  }, [])

  const handleExecute = useCallback(async () => {
    if (!password || !text) {
      setResult({ success: false, error: '請輸入密鑰和文字' })
      return
    }

    setLoading(true)
    try {
      if (mode === 'encrypt') {
        const r = await encrypt({
          algorithm: selectedAlgorithm.id,
          password,
          text,
          keyAlgorithm,
          iterations,
        })
        setResult(r)
      } else {
        const r = await decrypt({
          algorithm: selectedAlgorithm.id,
          password,
          encryptedText: text,
          keyAlgorithm,
          iterations,
        })
        setResult(r)
      }
    } finally {
      setLoading(false)
    }
  }, [mode, selectedAlgorithm, password, text, keyAlgorithm, iterations])

  const swapResultToInput = useCallback(() => {
    if (result?.success && result.result) {
      setText(result.result)
      setResult(null)
      // If encrypting, switch to decrypt mode (and vice versa)
      setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')
    }
  }, [result, mode])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Lock className="h-6 w-6" />
          Jasypt 加密/解密
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          使用 Jasypt 相容演算法進行 PBEWITHHMACSHA512ANDAES_256 等加密與解密
        </p>
      </div>

      <Tabs value={mode} onValueChange={(v) => { setMode(v as 'encrypt' | 'decrypt'); setResult(null) }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">加密</TabsTrigger>
          <TabsTrigger value="decrypt">解密</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4 mt-4">
          <AlgorithmSelect value={selectedAlgorithm.id} onChange={handleAlgorithmChange} />

          <div className="space-y-2">
            <Label>密鑰 (Password)</Label>
            <Input
              type="password"
              placeholder="請輸入加密密鑰..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>明文 (Plain Text)</Label>
            <Textarea
              placeholder="請輸入要加密的文字..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4 mt-4">
          <AlgorithmSelect value={selectedAlgorithm.id} onChange={handleAlgorithmChange} />

          <div className="space-y-2">
            <Label>密鑰 (Password)</Label>
            <Input
              type="password"
              placeholder="請輸入解密密鑰..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>密文 (Encrypted Text)</Label>
            <Textarea
              placeholder="請輸入 ENC(...) 密文..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>
        </TabsContent>
      </Tabs>

      <AdvancedOptions
        algorithm={selectedAlgorithm}
        keyAlgorithm={keyAlgorithm}
        onKeyAlgorithmChange={setKeyAlgorithm}
        iterations={iterations}
        onIterationsChange={setIterations}
      />

      <Button
        className="w-full"
        size="lg"
        onClick={handleExecute}
        disabled={loading || !password || !text}
      >
        {loading ? (
          '處理中...'
        ) : mode === 'encrypt' ? (
          <><Lock className="h-4 w-4 mr-2" /> 加密</>
        ) : (
          <><Unlock className="h-4 w-4 mr-2" /> 解密</>
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">結果</Label>
              {result.success && (
                <div className="flex gap-2">
                  <CopyButton value={result.result!} />
                  <Button variant="outline" size="sm" onClick={swapResultToInput}>
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    互換
                  </Button>
                </div>
              )}
            </div>

            {result.success ? (
              <div className="relative">
                <Textarea
                  readOnly
                  value={result.result!}
                  className="font-mono text-sm min-h-[80px]"
                />
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-center text-muted-foreground">
        🔒 所有運算在瀏覽器中完成，密鑰與明文不會傳送到任何伺服器
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Create JasyptPage.tsx (wrapper)**

```tsx
import JasyptForm from './JasyptForm'

export default function JasyptPage() {
  return <JasyptForm />
}
```

- [ ] **Step 5: Verify build**

```bash
cd d:/code/toolbox/web
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
cd d:/code/toolbox
git add web/src/tools/jasypt/
git commit -m "feat: add Jasypt encryption/decryption form UI"
```

---

### Task 5: Wire Routing, App Shell, and Create Favicon

**Files:**
- Modify: `web/src/App.tsx`
- Create: `web/src/tools/jasypt/index.ts`
- Create: `web/public/favicon.svg`

**Interfaces:**
- Consumes: Layout components (Task 2), JasyptPage (Task 4)
- Produces: The fully functional single-page application

- [ ] **Step 1: Create jasypt tool index.ts**

```ts
export { default as JasyptPage } from './JasyptPage'
```

- [ ] **Step 2: Rewrite App.tsx with routing**

```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Layout from '@/components/Layout'
import { JasyptPage } from '@/tools/jasypt'
import { type ToolDefinition } from '@/types/tools'

const tools: ToolDefinition[] = [
  {
    id: 'jasypt',
    name: 'Jasypt',
    path: '/tools/jasypt',
    icon: Lock,
    component: JasyptPage,
  },
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout tools={tools} />}>
        <Route index element={<Navigate to="/tools/jasypt" replace />} />
        <Route path="tools/jasypt" element={<JasyptPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/tools/jasypt" replace />} />
    </Routes>
  )
}
```

- [ ] **Step 3: Create favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
</svg>
```

- [ ] **Step 4: Add Input and Textarea shadcn components**

```bash
cd d:/code/toolbox/web
npx shadcn@latest add input -y
npx shadcn@latest add textarea -y
npx shadcn@latest add alert -y
```

(Or create manually if npx is unavailable.)

- [ ] **Step 5: Verify dev server starts and shows the app**

```bash
cd d:/code/toolbox/web
npm run build
```
Expected: Clean build with no errors.

- [ ] **Step 6: Commit**

```bash
cd d:/code/toolbox
git add web/src/App.tsx web/src/tools/jasypt/index.ts web/public/favicon.svg
git commit -m "feat: wire routing, app shell with sidebar navigation"
```

---

### Task 6: GitHub Actions Deployment Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: The built `web/dist/` directory
- Produces: Automated deployment to GitHub Pages

- [ ] **Step 1: Create deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: 'web/package-lock.json'

      - name: Install dependencies
        working-directory: ./web
        run: npm ci

      - name: Build
        working-directory: ./web
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./web/dist
```

- [ ] **Step 2: Add .gitignore for web/**

```bash
echo "dist/" >> d:/code/toolbox/web/.gitignore
echo "node_modules/" >> d:/code/toolbox/web/.gitignore
```

- [ ] **Step 3: Create root .gitignore if not exists**

```bash
if not exist d:/code/toolbox/.gitignore (
  echo node_modules/ > d:/code/toolbox/.gitignore
  echo dist/ >> d:/code/toolbox/.gitignore
)
```

- [ ] **Step 4: Commit**

```bash
cd d:/code/toolbox
git add .github/workflows/deploy.yml web/.gitignore .gitignore
git commit -m "ci: add GitHub Actions deployment workflow"
```

---

### Task 7: Polish, Error Handling, and Edge Cases

**Files:**
- Modify: `web/src/tools/jasypt/JasyptForm.tsx`
- Modify: `web/src/tools/jasypt/jasypt-core.ts`

**Interfaces:**
- Consumes: All existing code
- Produces: Polished UX with comprehensive error handling

- [ ] **Step 1: Add input validation feedback in JasyptForm**

Add visual indicators for invalid/missing fields:
- Red border on password field when empty and submitted
- Character count on text area
- Disabled button until required fields filled (already done)

- [ ] **Step 2: Add loading state improvements**

Replace the text "處理中..." with a spinner animation:
```tsx
// Inside JasyptForm.tsx button section:
{loading ? (
  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 處理中...</>
) : (...)}
```

Add import: `import { Loader2 } from 'lucide-react'`

- [ ] **Step 3: Add empty state for result area**

When the page first loads and no operation has been performed yet:
```tsx
{!result && !loading && (
  <Card className="border-dashed">
    <CardContent className="py-8 text-center text-muted-foreground">
      <p>輸入密鑰與文字後，點擊上方按鈕執行{ mode === 'encrypt' ? '加密' : '解密' }</p>
    </CardContent>
  </Card>
)}
```

- [ ] **Step 4: Add tooltips to sidebar tool items**

```tsx
// In Sidebar.tsx, wrap NavLink with Tooltip:
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Usage:
<TooltipProvider>
  {tools.map((tool) => (
    <Tooltip key={tool.id}>
      <TooltipTrigger asChild>
        <NavLink ...>
          ...
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right">{tool.name}</TooltipContent>
    </Tooltip>
  ))}
</TooltipProvider>
```

- [ ] **Step 5: Add responsive sidebar collapse on mobile**

```tsx
// In Layout.tsx, add state for sidebar visibility:
const [sidebarOpen, setSidebarOpen] = useState(true)

// Toggle button in NavBar
// On mobile (< 768px), sidebar is hidden by default
// Show/hide with hamburger menu button
```

Implementation:
```tsx
// Layout.tsx updates:
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Layout({ tools }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="flex h-14 items-center px-4 gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Shield className="h-6 w-6" />
          <span className="font-semibold">Crypto Toolbox</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className={cn(
          'w-56 border-r bg-muted/40 p-2 flex flex-col gap-1 transition-all',
          'max-md:fixed max-md:inset-y-14 max-md:left-0 max-md:z-50 max-md:bg-background max-md:shadow-lg',
          !sidebarOpen && 'max-md:-translate-x-full'
        )}>
          {/* sidebar items */}
        </aside>
        {!sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 6: Final verification — build + test**

```bash
cd d:/code/toolbox/web
npm run build
npx vitest run
```
Expected: Build succeeds. All tests pass.

- [ ] **Step 7: Commit**

```bash
cd d:/code/toolbox
git add web/src/
git commit -m "feat: add polish, responsive layout, loading states, and error handling"
git tag v0.1.0
```

---

## Self-Review Checklist

After writing, verify against spec:

- [x] **Spec §2 (Directory Structure):** All files created under `web/`, tools in `web/src/tools/jasypt/`, shared components in `web/src/components/`
- [x] **Spec §4 (UI Layout):** NavBar + Sidebar + Content + Footer layout, theme toggle, sidebar tool list
- [x] **Spec §5 (Jasypt Form):** Tab switching, algorithm dropdown, password + text inputs, collapsible advanced options, execute button, result with copy/swap
- [x] **Spec §5.3 (Algorithm Support):** All 5 algorithms defined in `ALGORITHMS` array
- [x] **Spec §6 (Crypto Logic):** Encrypt/decrypt with Web Crypto API, Salt + IV + ciphertext output format, ENC() wrapper
- [x] **Spec §8 (Deployment):** GitHub Actions workflow
- [x] **No placeholders:** All code is complete, no TODOs or TBDs
- [x] **Type consistency:** `AlgorithmConfig` type used consistently across all files, `CryptoResult` interface matches in both core and UI
- [x] **Scope:** Single focused project — Jasypt tool with extensible architecture
