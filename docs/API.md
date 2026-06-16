# API 接口文档

本文档基于 `ARCH.md` 中的架构设计，定义个人多端同步记账软件首版 MVP 的 REST API 契约。接口面向 Web 端和微信小程序端，服务端采用 Spring Boot 3，统一使用 JSON 请求与响应。

## 1. 基本约定

### 1.1 基础路径

- API 基础路径：`/api`
- 推荐版本路径：`/api/v1`
- 本文档示例默认使用 `/api/v1`

如果首版暂不引入显式版本号，也应在网关或 Spring Boot 路由层预留版本演进能力。

### 1.2 传输与编码

- 所有生产环境接口必须通过 HTTPS 访问。
- 请求体和响应体均使用 `application/json; charset=utf-8`。
- 时间字段使用 ISO 8601 字符串，推荐带时区，例如 `2026-06-15T12:00:00+08:00`。
- 金额字段统一使用整数分，字段名以 `_cent` 或 `Cent` 结尾，避免浮点误差。
- 客户端不得传入 `userId` 作为权限依据，服务端必须从 token 解析当前用户。

### 1.3 认证方式

除登录、注册、刷新令牌等公开接口外，业务接口统一使用 Bearer Token：

```http
Authorization: Bearer <access_token>
```

建议令牌策略：

- `accessToken` 有效期：2 小时。
- `refreshToken` 有效期：30 天。
- 退出登录、风险控制、密码修改后，服务端应使相关 refresh token 失效。

### 1.4 通用响应

成功响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {}
}
```

分页响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

错误响应：

```json
{
  "code": "VALIDATION_ERROR",
  "message": "请求参数不合法",
  "data": {
    "fieldErrors": [
      {
        "field": "amountCent",
        "message": "金额必须大于 0"
      }
    ]
  }
}
```

### 1.5 HTTP 状态码

| 状态码 | 使用场景 |
| --- | --- |
| 200 | 查询、修改、删除成功 |
| 201 | 创建成功 |
| 400 | 请求参数不合法 |
| 401 | 未登录、access token 无效或过期 |
| 403 | 无权访问当前资源 |
| 404 | 资源不存在或不属于当前用户 |
| 409 | 数据冲突，例如同步冲突、唯一约束冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务端未知错误 |

### 1.6 通用错误码

| 错误码 | 说明 |
| --- | --- |
| SUCCESS | 成功 |
| VALIDATION_ERROR | 参数校验失败 |
| UNAUTHORIZED | 未登录或令牌无效 |
| TOKEN_EXPIRED | access token 已过期 |
| FORBIDDEN | 无访问权限 |
| NOT_FOUND | 资源不存在 |
| CONFLICT | 数据冲突 |
| DUPLICATE_RESOURCE | 资源重复 |
| RATE_LIMITED | 触发限流 |
| SYNC_CONFLICT | 同步冲突 |
| BACKUP_JOB_FAILED | 备份或恢复任务失败 |
| INTERNAL_ERROR | 服务端内部错误 |

## 2. 通用数据模型

### 2.1 TokenPair

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "expiresIn": 7200,
  "tokenType": "Bearer"
}
```

### 2.2 User

```json
{
  "id": "uuid",
  "nickname": "小明",
  "avatarUrl": "https://example.com/avatar.png",
  "status": "normal",
  "createdAt": "2026-06-15T12:00:00+08:00",
  "updatedAt": "2026-06-15T12:00:00+08:00"
}
```

### 2.3 Device

```json
{
  "id": "uuid",
  "platform": "wechat_mini",
  "deviceName": "iPhone",
  "lastSyncAt": "2026-06-15T12:00:00+08:00",
  "createdAt": "2026-06-15T12:00:00+08:00",
  "updatedAt": "2026-06-15T12:00:00+08:00"
}
```

### 2.4 Transaction

```json
{
  "id": "uuid",
  "amountCent": 2590,
  "type": "expense",
  "categoryId": "uuid",
  "categoryName": "餐饮",
  "accountId": "uuid",
  "accountName": "微信钱包",
  "occurredAt": "2026-06-15T12:00:00+08:00",
  "note": "午餐",
  "isDeleted": false,
  "createdAt": "2026-06-15T12:00:00+08:00",
  "updatedAt": "2026-06-15T12:00:00+08:00"
}
```

### 2.5 Category

```json
{
  "id": "uuid",
  "name": "餐饮",
  "type": "expense",
  "isDefault": true,
  "isDisabled": false,
  "sortOrder": 10,
  "createdAt": "2026-06-15T12:00:00+08:00",
  "updatedAt": "2026-06-15T12:00:00+08:00"
}
```

### 2.6 Account

```json
{
  "id": "uuid",
  "name": "微信钱包",
  "type": "e_wallet",
  "initialBalanceCent": 0,
  "currentBalanceCent": 182000,
  "isDisabled": false,
  "createdAt": "2026-06-15T12:00:00+08:00",
  "updatedAt": "2026-06-15T12:00:00+08:00"
}
```

### 2.7 Budget

```json
{
  "id": "uuid",
  "month": "2026-06",
  "type": "category",
  "categoryId": "uuid",
  "categoryName": "餐饮",
  "amountCent": 200000,
  "usedCent": 76500,
  "remainingCent": 123500,
  "usageRatio": 0.3825,
  "status": "normal",
  "createdAt": "2026-06-15T12:00:00+08:00",
  "updatedAt": "2026-06-15T12:00:00+08:00"
}
```

## 3. 枚举值

| 枚举 | 可选值 | 说明 |
| --- | --- | --- |
| `TransactionType` | `income`, `expense` | 收入、支出 |
| `CategoryType` | `income`, `expense` | 分类类型 |
| `AccountType` | `cash`, `bank_card`, `e_wallet`, `other` | 资金账户类型 |
| `BudgetType` | `total`, `category` | 总预算、分类预算 |
| `BudgetStatus` | `normal`, `warning`, `exceeded` | 正常、接近超限、已超限 |
| `UserStatus` | `normal`, `disabled` | 正常、禁用 |
| `DevicePlatform` | `web`, `wechat_mini` | Web、微信小程序 |
| `SyncEntityType` | `transaction`, `category`, `account`, `budget` | 同步实体 |
| `SyncOperation` | `create`, `update`, `delete` | 同步操作 |
| `BackupStatus` | `pending`, `running`, `success`, `failed` | 备份任务状态 |

## 4. 认证接口

### 4.1 账号密码登录

```http
POST /api/v1/auth/login
```

请求体：

```json
{
  "identifier": "user@example.com",
  "password": "plain-password",
  "platform": "web",
  "deviceName": "Chrome on Windows"
}
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "user": {
      "id": "uuid",
      "nickname": "小明",
      "avatarUrl": null,
      "status": "normal",
      "createdAt": "2026-06-15T12:00:00+08:00",
      "updatedAt": "2026-06-15T12:00:00+08:00"
    },
    "deviceId": "uuid",
    "token": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 7200,
      "tokenType": "Bearer"
    }
  }
}
```

### 4.2 微信小程序登录

```http
POST /api/v1/auth/wechat-mini-login
```

请求体：

```json
{
  "code": "wx-login-code",
  "deviceName": "iPhone 15",
  "nickname": "小明",
  "avatarUrl": "https://example.com/avatar.png"
}
```

说明：

- `code` 必须由小程序端 `wx.login` 实时获取。
- 服务端必须调用微信接口换取 openid，不允许信任客户端传入 openid。
- 首次登录时可自动创建用户，也可根据产品策略进入账号绑定流程。

响应与账号密码登录一致。

### 4.3 刷新令牌

```http
POST /api/v1/auth/refresh
```

请求体：

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 7200,
    "tokenType": "Bearer"
  }
}
```

### 4.4 退出登录

```http
POST /api/v1/auth/logout
```

请求头：

```http
Authorization: Bearer <access_token>
```

请求体：

```json
{
  "refreshToken": "jwt-refresh-token",
  "deviceId": "uuid"
}
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": null
}
```

## 5. 用户与设备接口

### 5.1 获取当前用户

```http
GET /api/v1/users/me
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "id": "uuid",
    "nickname": "小明",
    "avatarUrl": "https://example.com/avatar.png",
    "status": "normal",
    "createdAt": "2026-06-15T12:00:00+08:00",
    "updatedAt": "2026-06-15T12:00:00+08:00"
  }
}
```

### 5.2 更新当前用户

```http
PATCH /api/v1/users/me
```

请求体：

```json
{
  "nickname": "新的昵称",
  "avatarUrl": "https://example.com/avatar.png"
}
```

响应：返回更新后的 `User`。

### 5.3 注册或更新设备

```http
POST /api/v1/devices
```

请求体：

```json
{
  "platform": "wechat_mini",
  "deviceName": "iPhone 15",
  "deviceInfo": {
    "system": "iOS",
    "model": "iPhone"
  }
}
```

响应：返回 `Device`。

### 5.4 查询设备列表

```http
GET /api/v1/devices
```

响应：返回当前用户的设备列表。

## 6. 账单接口

### 6.1 查询账单列表

```http
GET /api/v1/transactions
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `page` | integer | 否 | 页码，默认 1 |
| `pageSize` | integer | 否 | 每页数量，默认 20，最大 100 |
| `type` | string | 否 | `income` 或 `expense` |
| `categoryId` | string | 否 | 分类 ID |
| `accountId` | string | 否 | 账户 ID |
| `startAt` | string | 否 | 发生时间开始 |
| `endAt` | string | 否 | 发生时间结束 |
| `keyword` | string | 否 | 备注关键词 |
| `includeDeleted` | boolean | 否 | 是否包含逻辑删除数据，默认 false |

排序规则：

- 默认按 `occurredAt desc, createdAt desc` 排序。

响应：分页返回 `Transaction` 列表。

### 6.2 获取账单详情

```http
GET /api/v1/transactions/{transactionId}
```

响应：返回 `Transaction`。

### 6.3 创建账单

```http
POST /api/v1/transactions
```

请求体：

```json
{
  "amountCent": 2590,
  "type": "expense",
  "categoryId": "uuid",
  "accountId": "uuid",
  "occurredAt": "2026-06-15T12:00:00+08:00",
  "note": "午餐"
}
```

校验规则：

- `amountCent` 必须大于 0。
- `type` 必须为 `income` 或 `expense`。
- `categoryId` 和 `accountId` 必须属于当前用户，且未停用。
- 账单创建成功后，服务端应更新账户余额并写入 `sync_changes`。

响应：返回创建后的 `Transaction`。

### 6.4 更新账单

```http
PUT /api/v1/transactions/{transactionId}
```

请求体：

```json
{
  "amountCent": 3200,
  "type": "expense",
  "categoryId": "uuid",
  "accountId": "uuid",
  "occurredAt": "2026-06-15T13:00:00+08:00",
  "note": "午餐和饮料"
}
```

说明：

- 更新账单需要在事务中回滚旧账户余额影响，再应用新账单影响。
- 更新成功后写入 `sync_changes`。

响应：返回更新后的 `Transaction`。

### 6.5 删除账单

```http
DELETE /api/v1/transactions/{transactionId}
```

说明：

- 首版建议逻辑删除，设置 `isDeleted = true`。
- 删除需要在事务中回滚账单对账户余额的影响。
- 删除成功后写入 `sync_changes`。

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": null
}
```

## 7. 分类接口

### 7.1 查询分类列表

```http
GET /api/v1/categories
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `type` | string | 否 | `income` 或 `expense` |
| `includeDisabled` | boolean | 否 | 是否包含停用分类，默认 false |

响应：返回 `Category` 列表，按 `sortOrder asc, createdAt asc` 排序。

### 7.2 创建分类

```http
POST /api/v1/categories
```

请求体：

```json
{
  "name": "交通",
  "type": "expense",
  "sortOrder": 20
}
```

响应：返回创建后的 `Category`。

### 7.3 更新分类

```http
PUT /api/v1/categories/{categoryId}
```

请求体：

```json
{
  "name": "通勤",
  "sortOrder": 30
}
```

响应：返回更新后的 `Category`。

### 7.4 停用分类

```http
PATCH /api/v1/categories/{categoryId}/disable
```

说明：

- 停用分类不删除历史账单。
- 已停用分类不应出现在新建账单的默认选择列表中。

响应：返回更新后的 `Category`。

### 7.5 启用分类

```http
PATCH /api/v1/categories/{categoryId}/enable
```

响应：返回更新后的 `Category`。

## 8. 账户接口

### 8.1 查询账户列表

```http
GET /api/v1/accounts
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `includeDisabled` | boolean | 否 | 是否包含停用账户，默认 false |

响应：返回 `Account` 列表。

### 8.2 创建账户

```http
POST /api/v1/accounts
```

请求体：

```json
{
  "name": "微信钱包",
  "type": "e_wallet",
  "initialBalanceCent": 0
}
```

说明：

- 创建时 `currentBalanceCent` 默认等于 `initialBalanceCent`。

响应：返回创建后的 `Account`。

### 8.3 更新账户

```http
PUT /api/v1/accounts/{accountId}
```

请求体：

```json
{
  "name": "微信钱包",
  "type": "e_wallet"
}
```

说明：

- 首版不建议直接通过账户编辑接口修改 `currentBalanceCent`。
- 如需余额校准，应后续独立设计余额调整流水。

响应：返回更新后的 `Account`。

### 8.4 停用账户

```http
PATCH /api/v1/accounts/{accountId}/disable
```

响应：返回更新后的 `Account`。

### 8.5 启用账户

```http
PATCH /api/v1/accounts/{accountId}/enable
```

响应：返回更新后的 `Account`。

## 9. 预算接口

### 9.1 查询月度预算

```http
GET /api/v1/budgets
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `month` | string | 是 | 月份，格式 `yyyy-MM` |

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "month": "2026-06",
    "totalBudget": {
      "id": "uuid",
      "month": "2026-06",
      "type": "total",
      "categoryId": null,
      "categoryName": null,
      "amountCent": 500000,
      "usedCent": 236000,
      "remainingCent": 264000,
      "usageRatio": 0.472,
      "status": "normal",
      "createdAt": "2026-06-01T00:00:00+08:00",
      "updatedAt": "2026-06-15T12:00:00+08:00"
    },
    "categoryBudgets": []
  }
}
```

### 9.2 保存预算

```http
PUT /api/v1/budgets
```

请求体：

```json
{
  "month": "2026-06",
  "budgets": [
    {
      "type": "total",
      "categoryId": null,
      "amountCent": 500000
    },
    {
      "type": "category",
      "categoryId": "uuid",
      "amountCent": 200000
    }
  ]
}
```

说明：

- 同一用户、同一月份只能有一个 `total` 预算。
- 同一用户、同一月份、同一分类只能有一个 `category` 预算。
- 保存成功后写入 `sync_changes`。

响应：返回保存后的月度预算结构。

### 9.3 删除预算

```http
DELETE /api/v1/budgets/{budgetId}
```

响应：返回空数据。

## 10. 统计接口

### 10.1 月度收支汇总

```http
GET /api/v1/reports/monthly-summary
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `month` | string | 是 | 月份，格式 `yyyy-MM` |

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "month": "2026-06",
    "incomeCent": 1200000,
    "expenseCent": 236000,
    "balanceCent": 964000,
    "transactionCount": 42
  }
}
```

### 10.2 月度分类占比

```http
GET /api/v1/reports/category-summary
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `month` | string | 是 | 月份，格式 `yyyy-MM` |
| `type` | string | 否 | 默认 `expense` |

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "month": "2026-06",
    "type": "expense",
    "items": [
      {
        "categoryId": "uuid",
        "categoryName": "餐饮",
        "amountCent": 76500,
        "ratio": 0.324
      }
    ]
  }
}
```

### 10.3 年度趋势

```http
GET /api/v1/reports/yearly-trend
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `year` | integer | 是 | 年份，例如 2026 |

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "year": 2026,
    "items": [
      {
        "month": "2026-01",
        "incomeCent": 1000000,
        "expenseCent": 350000,
        "balanceCent": 650000
      }
    ]
  }
}
```

### 10.4 账户余额汇总

```http
GET /api/v1/reports/account-balances
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "totalBalanceCent": 182000,
    "items": [
      {
        "accountId": "uuid",
        "accountName": "微信钱包",
        "accountType": "e_wallet",
        "balanceCent": 182000
      }
    ]
  }
}
```

## 11. 同步接口

同步接口主要服务微信小程序离线写入场景。Web 端首版可直接调用普通 CRUD 接口。

### 11.1 上传变更并拉取增量

```http
POST /api/v1/sync
```

请求体：

```json
{
  "deviceId": "uuid",
  "lastSyncAt": "2026-06-15T10:00:00+08:00",
  "changes": [
    {
      "clientChangeId": "uuid",
      "entityType": "transaction",
      "entityId": "local-id-or-server-id",
      "operation": "create",
      "changedAt": "2026-06-15T12:00:00+08:00",
      "payload": {
        "amountCent": 2590,
        "type": "expense",
        "categoryId": "uuid",
        "accountId": "uuid",
        "occurredAt": "2026-06-15T12:00:00+08:00",
        "note": "午餐"
      }
    }
  ]
}
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "serverTime": "2026-06-15T12:01:00+08:00",
    "acceptedChanges": [
      {
        "clientChangeId": "uuid",
        "entityType": "transaction",
        "localEntityId": "local-id-or-server-id",
        "serverEntityId": "uuid",
        "status": "success"
      }
    ],
    "conflicts": [],
    "changes": [
      {
        "changeId": "uuid",
        "entityType": "transaction",
        "entityId": "uuid",
        "operation": "update",
        "changedAt": "2026-06-15T11:30:00+08:00",
        "payload": {}
      }
    ]
  }
}
```

处理规则：

- 服务端根据 `clientChangeId` 幂等去重，重复上传应返回成功结果。
- 普通冲突采用 `updatedAt` 较新的版本为准。
- 服务端返回 `serverTime`，客户端用它更新本地 `lastSyncAt`。
- 服务端写入业务数据和 `sync_changes` 必须在同一事务内完成。

### 11.2 拉取增量

```http
GET /api/v1/sync/changes
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `deviceId` | string | 是 | 当前设备 ID |
| `since` | string | 是 | 上次同步时间 |

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "serverTime": "2026-06-15T12:01:00+08:00",
    "changes": []
  }
}
```

## 12. 备份与恢复接口

### 12.1 创建备份

```http
POST /api/v1/backups
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "id": "uuid",
    "status": "pending",
    "fileSize": null,
    "createdAt": "2026-06-15T12:00:00+08:00",
    "completedAt": null
  }
}
```

说明：

- 备份任务可以异步执行。
- 备份内容包含当前用户的 `transactions`、`categories`、`accounts`、`budgets`。
- 备份文件存储在私有对象存储中。

### 12.2 查询备份列表

```http
GET /api/v1/backups
```

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `page` | integer | 否 | 页码，默认 1 |
| `pageSize` | integer | 否 | 每页数量，默认 20 |

响应：分页返回备份任务列表。

### 12.3 查询备份详情

```http
GET /api/v1/backups/{backupId}
```

响应：返回备份任务详情。

### 12.4 获取备份下载链接

```http
POST /api/v1/backups/{backupId}/download-url
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "url": "https://object-storage.example.com/signed-url",
    "expiresIn": 300
  }
}
```

说明：

- 服务端必须校验备份归属当前用户。
- 下载链接必须短期有效，建议 5 分钟内失效。

### 12.5 恢复备份

```http
POST /api/v1/backups/{backupId}/restore
```

请求体：

```json
{
  "confirm": true
}
```

响应：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": {
    "restoreStarted": true,
    "backupId": "uuid"
  }
}
```

说明：

- 恢复前必须校验备份归属当前用户。
- 恢复过程必须在事务中处理核心账务数据。
- 恢复完成后应写入 `sync_changes`，触发其他客户端重新拉取。

## 13. 前端联调建议

- Web 端统一封装 Axios，集中处理 token 注入、401 刷新令牌、错误提示和重试。
- 小程序端统一封装 `wx.request`，集中处理 `deviceId`、token、网络异常和同步触发。
- 所有列表接口默认分页，Web 表格筛选必须走服务端查询。
- 小程序离线记账先写本地缓存和同步队列，网络恢复后调用 `/sync`。
- 客户端展示金额时再把分转换为元，提交接口时始终传整数分。

## 14. 首版暂不提供的接口

- 多人账本与成员权限接口。
- 银行流水、支付平台自动导入接口。
- OCR 发票识别接口。
- 企业财务科目、凭证、审批、报销、税务相关接口。
- 原生 iOS、Android、桌面客户端专用接口。
