# Crypto Toolbox - 設計文件

> 一個可擴充的線上密碼學工具集，部署於 GitHub Pages，使用 Vite + React + TypeScript + shadcn/ui。

## 1. 專案定位與目標

### 1.1 核心功能
- **Jasypt 加密/解密工具**：支援多種 Jasypt 演算法，所有運算在使用者瀏覽器中完成，資料不會傳送到任何伺服器。
- **可擴充工具集架構**：以 Jasypt 為第一個工具，未來可加入 Base64、Hash、JWT 等其他密碼學工具。

### 1.2 安全性原則
- 純前端運算，密鑰與明文不離開瀏覽器
- 使用 Web Crypto API 實作加密演算法
- 開源程式碼，供社群驗證無後門
- 頁面標示安全提示

### 1.3 部署方式
- GitHub Pages 靜態部署
- GitHub Actions 自動化 build → deploy

## 2. 目錄結構

```
toolbox/                              # 根目錄（未來可放後端）
├── web/                              # GitHub Pages 部署根目錄
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── tools/                    # ★ 各工具獨立目錄，互不影響
│   │   │   └── jasypt/               # Jasypt 加密/解密工具
│   │   │       ├── JasyptPage.tsx           # 工具頁面主元件
│   │   │       ├── JasyptForm.tsx           # 加密/解密表單
│   │   │       ├── AlgorithmSelect.tsx      # 演算法下拉選單
│   │   │       ├── AdvancedOptions.tsx      # 進階參數區塊
│   │   │       └── jasypt-core.ts           # 核心加密/解密邏輯 (Web Crypto API)
│   │   ├── components/               # 跨工具共用 UI 元件
│   │   │   ├── Layout.tsx            # 整體版面 (NavBar + Sidebar + Content)
│   │   │   ├── Sidebar.tsx           # 側邊工具導航
│   │   │   ├── ThemeToggle.tsx       # 明/暗主題切換
│   │   │   └── CopyButton.tsx        # 複製結果按鈕
│   │   ├── lib/
│   │   │   └── utils.ts              # 共用工具函式 (cn, 等)
│   │   ├── App.tsx                   # 路由 + 佈局
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind + 全域樣式
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── components.json               # shadcn/ui 設定
├── backend/                          # (未來) 後端專案放置處
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-06-29-crypto-toolbox-design.md
└── .github/
    └── workflows/
        └── deploy.yml                # GitHub Actions 自動部署
```

## 3. 技術棧

| 層級 | 技術 |
|------|------|
| 框架 | React 18 + TypeScript |
| 建置工具 | Vite 5 |
| UI 元件庫 | shadcn/ui (Radix UI + Tailwind CSS) |
| 路由 | React Router v6 |
| 加密核心 | Web Crypto API (瀏覽器原生，零外部依賴) |
| 主題 | next-themes (shadcn/ui 內建支援) |
| 部署 | GitHub Actions → GitHub Pages |

## 4. UI 版面配置

### 4.1 整體佈局

```
┌─────────────────────────────────────┐
│  [☰] Crypto Toolbox       [🌙/☀️]  │  ← Top NavBar
├──────────┬──────────────────────────┤
│          │                          │
│  🔐      │   [工具主內容區]          │
│  Jasypt  │                          │
│          │   ┌──────────────────┐   │
│  [Base64] │   │  各工具表單內容  │   │
│  (未來)   │   └──────────────────┘   │
│          │                          │
│  [JWT]   │                          │
│  (未來)   │                          │
│          │                          │
├──────────┴──────────────────────────┤
│  🔒 所有運算僅在瀏覽器中完成        │
└─────────────────────────────────────┘
```

### 4.2 區域說明

| 區域 | 元件 | 內容 |
|------|------|------|
| NavBar | `NavBar.tsx` | Logo/站名 + 主題切換按鈕 |
| Sidebar | `Sidebar.tsx` | 工具清單（圖示 + 名稱），當前工具高亮 |
| Content | Router outlet | 當前選中的工具頁面 |
| Footer | `Footer.tsx` | 安全提示文字 |

### 4.3 路由設計

| 路徑 | 元件 | 說明 |
|------|------|------|
| `/` | Redirect → `/tools/jasypt` | 首頁重新導向 |
| `/tools/jasypt` | `JasyptPage` | Jasypt 加密/解密 |
| `/tools/*` | (未來) | 新增工具時加入 |

## 5. Jasypt 工具頁面設計

### 5.1 表單區塊

```
┌──────────────────────────────────────────────┐
│  🔐 Jasypt 加密/解密                          │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │  [加密]  [解密]        ← Tab 切換       │ │
│  ├─────────────────────────────────────────┤ │
│  │  演算法: [PBEWITHHMACSHA512ANDAES_256 ▼] │ │
│  │                                          │ │
│  │  密鑰 (Password):    [················]  │ │
│  │  文字 (Text):        [················]  │ │
│  │                                          │ │
│  │  ▼ 進階設定 (可折疊)                     │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ IV 產生器: [RandomIvGenerator ▼]    │ │ │
│  │  │ 金鑰演算法: [PBKDF2WithHmacSHA512] │ │ │
│  │  │ 金鑰迭代次數: [1000]               │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  │                                          │ │
│  │  [🔒 加密]  ← Tab 連動按鈕文字           │ │
│  │                                          │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │  結果:                               │ │ │
│  │  │  ENC(加密後的密文...)                │ │ │
│  │  │  [📋 複製]  [🔄 互換]               │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  🔒 所有運算在瀏覽器中完成，資料不會傳送出      │
└──────────────────────────────────────────────┘
```

### 5.2 操作流程

1. **選擇模式** — Tab 切換加密/解密，下方按鈕文字連動
2. **選演算法** — 下拉選擇，連動進階參數的預設值
3. **輸入密鑰 + 文字** — 加密模式輸入明文；解密模式可接受 `ENC(...)` 包裝或純 Base64
4. **展開進階設定（可選）** — 微調 IV 產生器、金鑰演算法、迭代次數
5. **執行** — 點擊主要操作按鈕
6. **結果** — 顯示結果區：
   - **複製**：複製結果到剪貼簿
   - **互換**：將結果填入輸入區（加密結果可作為下次解密的輸入）

### 5.3 支援的演算法

| 演算法 | 預設 IV 產生器 | 預設金鑰演算法 | 說明 |
|-------|---------------|---------------|------|
| `PBEWITHHMACSHA512ANDAES_256` | `RandomIvGenerator` | `PBKDF2WithHmacSHA512` | 最安全，預設選中 |
| `PBEWITHHMACSHA256ANDAES_256` | `RandomIvGenerator` | `PBKDF2WithHmacSHA256` | SHA-256 版本 |
| `PBEWITHHMACSHA512ANDAES_128` | `RandomIvGenerator` | `PBKDF2WithHmacSHA512` | AES-128 版本 |
| `PBEWITHHMACSHA1ANDAES_128` | `RandomIvGenerator` | `PBKDF2WithHmacSHA1` | 相容舊系統 |
| `PBEWITHMD5ANDDES` | (無 IV) | MD5 金鑰衍生 (非 PBKDF2) | 舊版相容，最低安全性，無 IV |

**演算法連動規則**：切換演算法時，進階設定區的預設值自動更新，但使用者手動修改後的值不受影響。

## 6. 核心加密邏輯 (jasypt-core.ts)

### 6.1 Jasypt 加密流程（Web Crypto API 實作）

```
明文 + 密鑰
    │
    ├── 1. 產生隨機 Salt (RandomSaltGenerator, 預設 8 bytes)
    │      - Salt 用於 PBKDF2 金鑰衍生，增加破解難度
    │      - Salt 會與密文一同輸出（解密時需要）
    │
    ├── 2. 使用 PBKDF2 衍生金鑰 (Salt + Password)
    │      - iteration count, hash algorithm → from advanced options
    │
    ├── 3. 產生隨機 IV (RandomIvGenerator, 預設 16 bytes)
    │      - AES-CBC 需要 IV
    │
    ├── 4. AES/CBC/PKCS7Padding 加密
    │      - Key: PBKDF2 產生的金鑰 (256 or 128 bit)
    │      - IV: 隨機 IV
    │
    └── 5. 輸出: Base64( Salt + IV + CipherText )
              → 包裝為 ENC(結果)
```

### 6.2 Jasypt 解密流程

```
ENC(密文) + 密鑰
    │
    ├── 1. 去除 ENC() 包裝，Base64 解碼
    ├── 2. 提取 Salt / IV / CipherText
    ├── 3. 使用 PBKDF2 衍生相同金鑰
    ├── 4. AES/CBC/PKCS7Padding 解密
    └── 5. 輸出明文
```

### 6.3 使用 Web Crypto API 的原因

- 瀏覽器原生支援，無需額外 JS 加密庫（如 CryptoJS）
- 使用 `crypto.subtle` API，硬體加速
- 支援 PBKDF2、AES-CBC、SHA 系列
- 零外部依賴，安全性更高

## 7. 未來擴充規劃

### 7.1 可新增的工具（僅供參考，非承諾）

- **Base64** — 編碼/解碼
- **Hash** — MD5 / SHA-1 / SHA-256 / SHA-512 計算
- **JWT** — JWT 解析與驗證
- **RSA Key Generator** — 金鑰對產生
- **Random Password Generator** — 隨機密碼產生器

### 7.2 加入新工具的步驟

1. 在 `web/src/tools/` 下新增資料夾 `new-tool/`
2. 建立 `new-tool/NewToolPage.tsx` 作為入口元件
3. 在 `Sidebar.tsx` 加入新工具項目
4. 在 `App.tsx` 加入路由

### 7.3 未來後端整合

- 根目錄 `backend/` 可放置 Java (Spring Boot)、Node.js、Go 等後端
- `web/` 與 `backend/` 完全獨立，各自擁有 package.json / build config
- 如需前後端通訊，透過 REST API / GraphQL，CORS 設定指向後端網域

## 8. 部署流程

```yaml
# .github/workflows/deploy.yml
# Trigger: push 到 main 分支
# Steps:
#   1. Checkout
#   2. 安裝 Node.js
#   3. cd web/ && npm ci
#   4. npm run build
#   5. 部署到 gh-pages 分支
```

**GitHub Pages 設定**：
- Source: Deploy from a branch → `gh-pages` branch
- 根目錄設定：`vite.config.ts` 中設 `base: '/toolbox/'`（配合 repo name）

---

*本文檔設計已完成用戶審閱確認。*
