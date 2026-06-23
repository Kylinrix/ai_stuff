# 前端工程落地规范 - React

> 生成日期：2026-06-23  
> 执行者：Codex  
> 适用范围：个人多端同步记账软件 Web 前端 React 工程  
> 参考文档：`docs/PRD.md`、`docs/ARCH.md`、`docs/API.md`、`docs/DB.md`、`docs/前端开发企业规范 - React 版.docx`

## 1. 目标

本规范用于把 React 企业开发规范落到实际工程结构、接口调用、类型定义、状态管理和联调流程中，确保前端工程具备以下特征：

- 分类清晰：页面、接口、业务编排、状态、工具函数各有边界。
- 后端调用清晰：所有 REST API 与 `docs/API.md` 的接口分组一一对应。
- 类型明确：请求参数、响应数据、分页结构、错误结构均有 TypeScript 类型。
- 可维护：页面只负责展示和交互，业务流程沉到 hooks/services/api。
- 可验证：每个模块都能通过本地构建、类型检查和页面级功能验证。

## 2. 技术栈

React 工程默认采用：

- React 18+
- TypeScript
- Vite
- Ant Design
- React Router
- Zustand
- TanStack Query
- Axios
- CSS Variables + SCSS 或 CSS Modules
- ECharts
- pnpm

如果项目最终选择 React 技术栈，应同步更新 `docs/ARCH.md` 中 Web 端技术选型，避免 Vue 与 React 两套规范并存导致实现口径冲突。

## 3. 工程目录

Web 工程根目录建议为 `web/`。

```text
web/
├── src/
│   ├── api/                  # 后端接口请求层
│   │   ├── modules/          # 按后端业务域拆分 API
│   │   ├── request.ts        # Axios 实例、拦截器、统一错误处理
│   │   └── types.ts          # ApiResponse、PageResult、ApiError 等通用类型
│   ├── assets/               # 静态资源
│   ├── components/           # 跨业务通用组件
│   ├── constants/            # 枚举、字典、query key、路由常量
│   ├── hooks/                # 跨页面复用 hooks
│   ├── layouts/              # 主布局、登录布局
│   ├── pages/                # 路由页面，按业务模块拆分
│   ├── router/               # 路由配置、鉴权守卫
│   ├── services/             # 业务编排层，组合多个 API 或处理数据转换
│   ├── stores/               # Zustand 全局状态
│   ├── styles/               # 全局样式、主题变量
│   ├── types/                # 跨模块公共类型
│   ├── utils/                # 纯工具函数
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

目录边界：

| 目录 | 职责 | 禁止事项 |
| --- | --- | --- |
| `api` | 只描述 HTTP 请求和后端 DTO | 禁止写页面交互逻辑 |
| `services` | 组合 API、做金额/时间/枚举转换、封装业务流程 | 禁止直接操作 DOM |
| `pages` | 组织页面布局、表单、表格和交互 | 禁止直接写 Axios |
| `hooks` | 封装页面状态、Query、Mutation、表单逻辑 | 禁止沉淀全局状态 |
| `stores` | 登录态、用户信息、主题、字典缓存等全局状态 | 禁止存放普通页面弹窗和表单状态 |
| `utils` | 无副作用工具函数 | 禁止依赖 React 组件状态 |

## 4. 后端接口模块映射

前端 API 模块必须与 `docs/API.md` 的接口分组保持一致。

```text
src/api/modules/
├── auth.api.ts          # /auth 登录、刷新令牌、退出
├── user.api.ts          # /users 当前用户
├── device.api.ts        # /devices 设备注册、设备列表
├── transaction.api.ts   # /transactions 账单 CRUD、分页筛选
├── category.api.ts      # /categories 分类查询、创建、更新、启停
├── account.api.ts       # /accounts 账户查询、创建、更新、启停
├── budget.api.ts        # /budgets 预算查询、保存、删除
├── report.api.ts        # /reports 统计报表
├── sync.api.ts          # /sync 增量同步，Web 首版按需使用
└── backup.api.ts        # /backups 备份与恢复
```

命名规则：

- 查询分页：`getTransactionPage`
- 查询详情：`getTransactionDetail`
- 创建资源：`createTransaction`
- 更新资源：`updateTransaction`
- 删除资源：`deleteTransaction`
- 启用/停用：`enableCategory`、`disableCategory`
- 动作类接口：使用动词短语，例如 `refreshToken`、`restoreBackup`

页面不得编造接口字段。字段必须来自 `docs/API.md`，或由后端 OpenAPI 文档生成。

## 5. 调用链规范

统一调用链：

```text
page/component
  -> page hooks
  -> services
  -> api/modules
  -> api/request.ts
  -> backend REST API
```

职责划分：

- `api/modules`：只负责请求路径、请求方法、请求参数和响应类型。
- `services`：负责多个接口的业务编排、DTO 到 ViewModel 的转换。
- `hooks`：负责 TanStack Query、Mutation、Ant Design Form、页面局部状态。
- `pages/components`：负责展示、交互和组件组合。

简单 CRUD 页面可以由 hooks 直接调用 `api/modules`，但只要出现以下情况，必须增加 `services`：

- 一个用户动作需要调用多个接口。
- 需要把后端 DTO 转换为页面 ViewModel。
- 需要做金额元/分转换、时间格式转换、枚举文案转换。
- 多个页面复用同一段业务流程。

## 6. 通用类型

`src/api/types.ts` 必须定义通用响应结构。

```ts
export type ApiCode =
  | 'SUCCESS'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DUPLICATE_RESOURCE'
  | 'RATE_LIMITED'
  | 'SYNC_CONFLICT'
  | 'BACKUP_JOB_FAILED'
  | 'INTERNAL_ERROR'

export interface ApiResponse<T> {
  code: ApiCode
  message: string
  data: T
}

export interface PageResult<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface FieldError {
  field: string
  message: string
}

export interface ApiErrorData {
  fieldErrors?: FieldError[]
}
```

接口函数对外返回业务数据，不返回 Axios 原始响应。

```ts
export function getTransactionPage(
  params: TransactionPageParams,
): Promise<PageResult<Transaction>> {
  return request.get('/transactions', { params })
}
```

## 7. Axios 封装规范

`src/api/request.ts` 必须集中处理：

- `baseURL`：读取 `VITE_API_BASE_URL`，默认 `/api/v1`。
- `Content-Type`：统一使用 `application/json; charset=utf-8`。
- token 注入：业务接口统一设置 `Authorization: Bearer <accessToken>`。
- 响应解包：成功时返回 `response.data.data`。
- 业务错误：当 `code !== 'SUCCESS'` 时抛出统一业务异常。
- 401 刷新：遇到 HTTP 401 或 `TOKEN_EXPIRED` 自动刷新令牌。
- 并发控制：多个请求同时过期时，只允许触发一次 refresh，其余请求等待刷新结果。
- 登录失效：refresh 失败后清空登录态，跳转登录页。
- 错误提示：由 request 层生成统一错误对象，页面根据场景决定是否提示。

禁止事项：

- 禁止页面直接 `import axios from 'axios'`。
- 禁止在业务页面重复写 token 注入逻辑。
- 禁止在业务页面直接解析 HTTP 状态码。
- 禁止把 `userId` 作为权限依据传给后端。

## 8. TanStack Query 规范

服务端数据统一优先使用 TanStack Query 管理。

适用场景：

- 列表查询、详情查询、统计数据查询使用 `useQuery`。
- 新增、编辑、删除、启停、备份恢复使用 `useMutation`。
- Mutation 成功后必须失效或更新相关 query cache。

Query Key 统一放在 `src/constants/query-keys.ts`。

```ts
export const queryKeys = {
  transactions: {
    page: (params: TransactionPageParams) => ['transactions', 'page', params] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
  },
  categories: {
    list: (type?: CategoryType) => ['categories', 'list', type] as const,
  },
}
```

列表查询要求：

- 分页参数、筛选条件、排序条件必须进入 query key。
- 查询参数必须稳定，避免每次渲染生成不同对象导致重复请求。
- 删除、新增、编辑成功后必须刷新对应列表和详情。
- 不把服务端列表数据复制到 Zustand。

性能要求：

- 独立接口并行加载时使用并行 query 或 `Promise.all`，避免无意义瀑布请求。
- 大型图表、复杂弹窗、低频页面使用动态导入。
- 页面内部不要定义子组件，避免每次渲染生成新组件。
- 表格列定义、枚举 map、昂贵计算应使用稳定常量或 `useMemo`。

## 9. Zustand 状态规范

Zustand 只存放全局状态和跨页面共享状态。

```text
src/stores/
├── auth.store.ts      # accessToken、refreshToken、当前用户、登录动作
├── app.store.ts       # 主题、布局、全局 loading、系统配置
├── dict.store.ts      # 枚举、分类、账户等基础字典缓存
└── sync.store.ts      # 同步状态展示，Web 首版按需启用
```

不得放入 Zustand 的状态：

- 表单输入值
- 表格分页参数
- 查询区筛选条件
- Drawer/Modal 开关
- 单页面 loading
- TanStack Query 已经管理的服务端列表数据

Store 设计要求：

- selector 必须尽量细，避免订阅整个 store。
- action 与 state 放在同一 store 内。
- 持久化字段必须最小化，只持久化 token、用户偏好等必要数据。
- localStorage 数据结构必须带版本号，方便后续迁移。

## 10. 路由与登录态

路由建议：

```text
src/router/
├── index.tsx
├── routes.tsx
└── guards.ts
```

路由分层：

- `/login`：登录页，使用登录布局。
- `/`：主布局，承载首页、账单、统计、预算、设置。
- `*`：404 页面。

路由元信息：

```ts
export interface RouteMeta {
  title: string
  requiresAuth?: boolean
  menuKey?: string
}
```

登录态规则：

- 访问需要登录的路由时，未登录必须跳转 `/login`。
- 登录成功后返回原目标路由。
- access token 过期由 request 层自动刷新。
- refresh token 失效后清空登录态并跳转登录页。
- 退出登录必须调用后端退出接口，并清理本地 token。

## 11. 页面模块模板

复杂业务页面必须按模块拆分。以账单模块为例：

```text
src/pages/transactions/
├── index.tsx
├── components/
│   ├── TransactionSearchForm.tsx
│   ├── TransactionTable.tsx
│   └── TransactionFormDrawer.tsx
├── hooks/
│   ├── useTransactionQuery.ts
│   └── useTransactionMutation.ts
├── transaction.constants.ts
└── transaction.types.ts
```

页面职责：

- `index.tsx`：组合页面，不堆业务细节。
- `components`：只接收 props，不直接调用后端接口。
- `hooks`：封装查询、提交、删除、弹窗、表单回显。
- `constants`：列配置、默认筛选值、枚举选项。
- `types`：页面 ViewModel、FormValue、SearchParams。

单个页面文件超过 300 行时必须拆分。一个组件同时被三个以上页面使用时，迁移到 `src/components`。

## 12. 页面开发规范

列表页固定结构：

```text
PageContainer
├── SearchForm
├── Toolbar
├── DataTable
└── Pagination
```

表单页或弹窗固定能力：

- 必填校验
- 格式校验
- 提交 loading
- 防重复提交
- 编辑回显
- 成功提示
- 失败提示
- 关闭时清空表单和校验
- 危险操作二次确认

详情页要求：

- 使用 Card 分区。
- 使用 Descriptions 展示详情。
- 使用 Tag 展示状态。
- 时间、金额、枚举必须格式化。
- 禁止直接展示后端编码。

## 13. 金额、时间、枚举规范

金额：

- 后端字段统一为整数分，例如 `amountCent`。
- 页面展示统一转换为元。
- 表单输入使用元，提交前转换为分。
- 禁止用浮点数直接参与金额核心计算。

时间：

- 后端时间使用 ISO 8601 字符串。
- 页面展示统一使用 `formatDateTime`、`formatDate`。
- 查询参数的月份、日期范围必须按接口文档格式提交。

枚举：

- 后端编码统一放在 `src/constants/enums.ts`。
- 页面展示文案由枚举 map 转换。
- 表单选项由枚举 map 生成。
- 禁止在页面中散落 `income`、`expense`、`bank_card` 等裸字符串。

## 14. 后端字段与前端类型

类型来源优先级：

1. 后端 OpenAPI 自动生成类型。
2. 根据 `docs/API.md` 手动维护 DTO 类型。
3. 页面 ViewModel 在页面模块内单独定义。

DTO 与 ViewModel 必须区分：

- DTO：与后端字段完全一致，例如 `amountCent`、`occurredAt`。
- ViewModel：面向页面展示，例如 `amountText`、`occurredAtText`。
- FormValue：面向表单输入，例如 `amountYuan`。

禁止把页面展示字段提交给后端。

## 15. 环境与联调

环境变量：

```text
.env.development
.env.production
```

```text
VITE_API_BASE_URL=/api/v1
```

Vite 代理要求：

- 开发环境可将 `/api` 代理到本地 Spring Boot 服务。
- 生产环境由 Nginx 转发 `/api` 到后端服务。
- 前端代码不得写死后端域名。

Mock 规则：

- 无后端时允许使用 mock。
- mock 数据字段必须与 `docs/API.md` 一致。
- mock 只能位于 `src/mocks` 或开发工具配置中。
- 接入真实后端后必须移除页面内临时假数据。

## 16. 测试与验证

本地验证至少包含：

- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- 关键页面本地浏览器冒烟验证

页面验收：

- 首屏可运行。
- loading、empty、error 状态完整。
- 表格分页和筛选走服务端查询。
- 表单校验与提交状态完整。
- token 过期能自动刷新。
- refresh 失败能回到登录页。
- 金额、时间、枚举展示正确。
- 危险操作有确认。

## 17. 首版业务模块落地顺序

建议按以下顺序实现：

1. 基础工程、主题变量、布局、路由。
2. `request.ts`、通用类型、认证接口。
3. 登录页、登录态、路由守卫。
4. 分类和账户基础字典。
5. 账单列表、筛选、新增、编辑、删除。
6. 首页统计卡片和近期账单。
7. 预算管理。
8. 统计报表。
9. 设置、设备、备份恢复。

## 18. 禁止事项

- 禁止页面直接写 Axios。
- 禁止大面积使用 `any`。
- 禁止接口字段脱离 `docs/API.md` 自行编造。
- 禁止把所有状态塞进 Zustand。
- 禁止把服务端列表数据重复存进全局 store。
- 禁止页面直接展示后端枚举编码。
- 禁止金额用浮点数直接提交。
- 禁止每个页面单独写一套样式风格。
- 禁止绕开 Ant Design 自己手写基础组件。

