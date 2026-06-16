const state = {
  route: "home",
  filterType: "all",
  entryType: "expense",
  deletingId: null,
  categories: [
    { id: "cat-food", name: "餐饮", type: "expense", color: "#C9583B" },
    { id: "cat-traffic", name: "交通", type: "expense", color: "#B8892E" },
    { id: "cat-home", name: "居住", type: "expense", color: "#2F5C99" },
    { id: "cat-shop", name: "购物", type: "expense", color: "#8A6D3B" },
    { id: "cat-health", name: "医疗", type: "expense", color: "#7B5EA7" },
    { id: "cat-salary", name: "工资", type: "income", color: "#2F8F74" },
    { id: "cat-bonus", name: "奖金", type: "income", color: "#397A5F" },
    { id: "cat-invest", name: "投资收益", type: "income", color: "#2F5C99" }
  ],
  accounts: [
    { id: "acc-cash", name: "现金", type: "cash", currentBalanceCent: 86000 },
    { id: "acc-bank", name: "银行卡", type: "bank_card", currentBalanceCent: 526800 },
    { id: "acc-wechat", name: "微信钱包", type: "e_wallet", currentBalanceCent: 182000 }
  ],
  transactions: [
    { id: "tx-101", amountCent: 2590, type: "expense", categoryId: "cat-food", accountId: "acc-wechat", occurredAt: "2026-06-15T12:10:00+08:00", note: "午餐，附近简餐" },
    { id: "tx-102", amountCent: 600, type: "expense", categoryId: "cat-traffic", accountId: "acc-wechat", occurredAt: "2026-06-15T08:40:00+08:00", note: "地铁通勤" },
    { id: "tx-103", amountCent: 1200000, type: "income", categoryId: "cat-salary", accountId: "acc-bank", occurredAt: "2026-06-14T10:00:00+08:00", note: "6 月工资" },
    { id: "tx-104", amountCent: 7800, type: "expense", categoryId: "cat-shop", accountId: "acc-bank", occurredAt: "2026-06-13T20:30:00+08:00", note: "厨房用品" },
    { id: "tx-105", amountCent: 320000, type: "expense", categoryId: "cat-home", accountId: "acc-bank", occurredAt: "2026-06-10T09:00:00+08:00", note: "房租" },
    { id: "tx-106", amountCent: 4900, type: "expense", categoryId: "cat-health", accountId: "acc-wechat", occurredAt: "2026-06-08T18:20:00+08:00", note: "感冒药" },
    { id: "tx-107", amountCent: 3600, type: "expense", categoryId: "cat-food", accountId: "acc-wechat", occurredAt: "2026-06-07T19:15:00+08:00", note: "周末晚餐" },
    { id: "tx-108", amountCent: 180000, type: "income", categoryId: "cat-bonus", accountId: "acc-bank", occurredAt: "2026-06-05T11:40:00+08:00", note: "项目奖金" },
    { id: "tx-109", amountCent: 16900, type: "expense", categoryId: "cat-shop", accountId: "acc-bank", occurredAt: "2026-05-28T15:20:00+08:00", note: "换季衣物" },
    { id: "tx-110", amountCent: 8800, type: "expense", categoryId: "cat-food", accountId: "acc-cash", occurredAt: "2026-05-21T13:00:00+08:00", note: "家庭聚餐" }
  ],
  budgets: [
    { id: "bud-total", month: "2026-06", type: "total", categoryId: null, amountCent: 500000 },
    { id: "bud-food", month: "2026-06", type: "category", categoryId: "cat-food", amountCent: 90000 },
    { id: "bud-traffic", month: "2026-06", type: "category", categoryId: "cat-traffic", amountCent: 30000 },
    { id: "bud-home", month: "2026-06", type: "category", categoryId: "cat-home", amountCent: 300000 },
    { id: "bud-shop", month: "2026-06", type: "category", categoryId: "cat-shop", amountCent: 70000 },
    { id: "bud-health", month: "2026-06", type: "category", categoryId: "cat-health", amountCent: 4000 }
  ],
  devices: [
    { id: "dev-web", platform: "web", deviceName: "Chrome on Windows", lastSyncAt: "2026-06-16T21:12:00+08:00", status: "success" },
    { id: "dev-mini", platform: "wechat_mini", deviceName: "微信小程序 iPhone", lastSyncAt: "2026-06-16T21:09:00+08:00", status: "success" },
    { id: "dev-pad", platform: "web", deviceName: "Edge on Surface", lastSyncAt: "2026-06-15T22:20:00+08:00", status: "failed" }
  ],
  backupJobs: [
    { id: "backup-1", status: "success", fileSize: 248320, createdAt: "2026-06-15T22:00:00+08:00", completedAt: "2026-06-15T22:01:00+08:00" },
    { id: "backup-2", status: "running", fileSize: null, createdAt: "2026-06-16T20:56:00+08:00", completedAt: null },
    { id: "backup-3", status: "failed", fileSize: null, createdAt: "2026-06-11T09:10:00+08:00", completedAt: "2026-06-11T09:10:30+08:00" }
  ],
  yearlyTrend: [
    ["01", 1000000, 350000],
    ["02", 980000, 410000],
    ["03", 1220000, 386000],
    ["04", 1100000, 452000],
    ["05", 1180000, 512000],
    ["06", 1380000, 365490],
    ["07", 0, 0],
    ["08", 0, 0],
    ["09", 0, 0],
    ["10", 0, 0],
    ["11", 0, 0],
    ["12", 0, 0]
  ]
};

const routeMeta = {
  home: ["2026 年 6 月账本", "首页"],
  transactions: ["按月整理流水", "账单"],
  reports: ["看清钱的流向", "统计"],
  budgets: ["总预算与分类预算", "预算"],
  settings: ["账号、同步、备份", "设置"]
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  hydrateControls();
  setDefaultDate();
  navigate(getInitialRoute());
  renderAll();
});

function cacheElements() {
  [
    "routeEyebrow",
    "routeTitle",
    "homeTape",
    "summaryCount",
    "homeBudgetProgress",
    "recentTransactions",
    "monthFilter",
    "categoryFilter",
    "accountFilter",
    "keywordFilter",
    "transactionRows",
    "transactionCards",
    "pageState",
    "reportSummary",
    "categoryBars",
    "trendChart",
    "budgetTotalCard",
    "categoryBudgets",
    "deviceList",
    "categoryTags",
    "accountStack",
    "backupList",
    "entryDialog",
    "entryForm",
    "entryAmount",
    "entryCategory",
    "entryAccount",
    "entryDate",
    "entryNote",
    "toast",
    "sidebarSyncTime",
    "loginScreen",
    "appShell",
    "loginForm"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.loginForm.addEventListener("submit", handleLoginSubmit);

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.route));
  });

  document.querySelectorAll("[data-route-jump]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.routeJump));
  });

  document.getElementById("openEntryButton").addEventListener("click", openEntryDialog);
  document.getElementById("closeEntryButton").addEventListener("click", closeEntryDialog);
  document.getElementById("cancelEntryButton").addEventListener("click", closeEntryDialog);
  document.getElementById("syncNowButton").addEventListener("click", () => {
    els.sidebarSyncTime.textContent = "刚刚手动同步";
    toast("同步完成，3 台设备状态已刷新");
  });
  document.getElementById("editBudgetButton").addEventListener("click", () => {
    toast("预算调整已进入演示状态");
  });

  document.querySelectorAll("[data-filter-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filterType = button.dataset.filterType;
      document.querySelectorAll("[data-filter-type]").forEach((item) => item.classList.toggle("is-active", item === button));
      renderTransactions();
    });
  });

  document.querySelectorAll("[data-entry-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.entryType = button.dataset.entryType;
      document.querySelectorAll("[data-entry-type]").forEach((item) => item.classList.toggle("is-active", item === button));
      hydrateEntryCategories();
    });
  });

  [els.monthFilter, els.categoryFilter, els.accountFilter, els.keywordFilter].forEach((control) => {
    control.addEventListener("input", renderTransactions);
  });

  els.entryForm.addEventListener("submit", handleEntrySubmit);

  window.addEventListener("hashchange", () => navigate(getInitialRoute()));
}

function handleLoginSubmit(event) {
  event.preventDefault();
  els.loginScreen.classList.add("is-hidden");
  els.appShell.classList.remove("is-hidden");
  els.appShell.removeAttribute("aria-hidden");
  document.querySelector(".bottom-nav").classList.remove("is-hidden");
  toast("登录成功，已进入 6 月账本");
  document.getElementById("openEntryButton").focus();
}

function getInitialRoute() {
  return window.location.hash.replace("#", "") || "home";
}

function navigate(route) {
  const nextRoute = routeMeta[route] ? route : "home";
  state.route = nextRoute;
  window.history.replaceState(null, "", `#${nextRoute}`);

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === nextRoute);
  });
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === nextRoute);
  });

  els.routeEyebrow.textContent = routeMeta[nextRoute][0];
  els.routeTitle.textContent = routeMeta[nextRoute][1];
}

function hydrateControls() {
  els.categoryFilter.innerHTML = `<option value="all">全部分类</option>${state.categories
    .map((category) => `<option value="${category.id}">${category.name}</option>`)
    .join("")}`;
  els.accountFilter.innerHTML = `<option value="all">全部账户</option>${state.accounts
    .map((account) => `<option value="${account.id}">${account.name}</option>`)
    .join("")}`;
  els.entryAccount.innerHTML = state.accounts.map((account) => `<option value="${account.id}">${account.name}</option>`).join("");
  hydrateEntryCategories();
}

function hydrateEntryCategories() {
  const categories = state.categories.filter((category) => category.type === state.entryType);
  els.entryCategory.innerHTML = categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("");
}

function setDefaultDate() {
  els.entryDate.value = "2026-06-16T21:18";
}

function renderAll() {
  renderHome();
  renderTransactions();
  renderReports();
  renderBudgets();
  renderSettings();
}

function renderHome() {
  const monthTransactions = getTransactionsByMonth("2026-06");
  const summary = getSummary(monthTransactions);
  document.querySelector('[data-summary="balance"]').textContent = formatMoney(summary.balanceCent);
  document.querySelector('[data-summary="income"]').textContent = formatMoney(summary.incomeCent);
  document.querySelector('[data-summary="expense"]').textContent = formatMoney(summary.expenseCent);
  els.summaryCount.textContent = `${monthTransactions.length} 笔`;

  els.homeTape.innerHTML = monthTransactions
    .slice(0, 6)
    .map((transaction) => {
      const category = getCategory(transaction.categoryId);
      return `
        <div class="tape-item ${transaction.type}">
          <span class="tape-time">${formatShortDate(transaction.occurredAt)}</span>
          <span class="tape-title">${category.name} · ${escapeHtml(transaction.note || "无备注")}</span>
          <strong class="amount ${transaction.type}">${signedMoney(transaction)}</strong>
        </div>
      `;
    })
    .join("");

  const totalBudget = state.budgets.find((budget) => budget.type === "total");
  els.homeBudgetProgress.innerHTML = renderBudgetProgress(totalBudget, summary.expenseCent, "本月已用");
  els.recentTransactions.innerHTML = monthTransactions.slice(0, 5).map(renderTransactionItem).join("");
}

function renderTransactions() {
  const filtered = getFilteredTransactions();
  els.pageState.textContent = `第 1 页 / 每页 20 条 / 共 ${filtered.length} 条`;
  els.transactionRows.innerHTML = filtered.map(renderTransactionRow).join("");
  els.transactionCards.innerHTML = filtered.map(renderTransactionCard).join("");

  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => handleDeleteClick(button.dataset.deleteId));
  });
  document.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => toast(`已选中账单 ${button.dataset.editId}，正式版将打开编辑表单`));
  });
}

function renderReports() {
  const transactions = getTransactionsByMonth("2026-06");
  const summary = getSummary(transactions);
  els.reportSummary.innerHTML = [
    ["收入", formatMoney(summary.incomeCent), "income"],
    ["支出", formatMoney(summary.expenseCent), "expense"],
    ["结余", formatMoney(summary.balanceCent), summary.balanceCent >= 0 ? "income" : "expense"],
    ["账单", `${transactions.length} 笔`, ""]
  ]
    .map(
      ([label, value, tone]) => `
        <div class="summary-cell">
          <span>${label}</span>
          <strong class="${tone}">${value}</strong>
        </div>
      `
    )
    .join("");

  const categoryTotals = getCategoryExpenseTotals(transactions);
  const max = Math.max(...categoryTotals.map((item) => item.amountCent), 1);
  els.categoryBars.innerHTML = categoryTotals
    .map((item) => {
      const ratio = item.amountCent / summary.expenseCent || 0;
      return `
        <div class="bar-row">
          <div class="bar-meta">
            <strong>${item.category.name}</strong>
            <span>${formatMoney(item.amountCent)} · ${Math.round(ratio * 100)}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill expense" style="width:${Math.max((item.amountCent / max) * 100, 4)}%"></div>
          </div>
        </div>
      `;
    })
    .join("");

  const maxTrend = Math.max(...state.yearlyTrend.flatMap(([, income, expense]) => [income, expense]), 1);
  els.trendChart.innerHTML = state.yearlyTrend
    .map(([month, income, expense]) => {
      const incomeHeight = income ? Math.max((income / maxTrend) * 100, 3) : 1;
      const expenseHeight = expense ? Math.max((expense / maxTrend) * 100, 3) : 1;
      return `
        <div class="trend-month">
          <div class="trend-bars">
            <div class="trend-bar income" title="收入 ${formatMoney(income)}" style="height:${incomeHeight}%"></div>
            <div class="trend-bar expense" title="支出 ${formatMoney(expense)}" style="height:${expenseHeight}%"></div>
          </div>
          <span class="trend-label">${month}</span>
        </div>
      `;
    })
    .join("");
}

function renderBudgets() {
  const transactions = getTransactionsByMonth("2026-06");
  const summary = getSummary(transactions);
  const totalBudget = state.budgets.find((budget) => budget.type === "total");
  els.budgetTotalCard.innerHTML = `
    <div class="budget-total">
      <strong>${formatMoney(totalBudget.amountCent)}</strong>
      ${renderBudgetProgress(totalBudget, summary.expenseCent, "总预算已用")}
    </div>
  `;

  els.categoryBudgets.innerHTML = state.budgets
    .filter((budget) => budget.type === "category")
    .map((budget) => {
      const used = transactions
        .filter((transaction) => transaction.type === "expense" && transaction.categoryId === budget.categoryId)
        .reduce((sum, transaction) => sum + transaction.amountCent, 0);
      return `
        <div class="budget-card">
          <div class="section-head">
            <div>
              <h3>${getCategory(budget.categoryId).name}</h3>
              <span class="transaction-sub">预算 ${formatMoney(budget.amountCent)}</span>
            </div>
            ${renderStatusPill(getBudgetStatus(used, budget.amountCent))}
          </div>
          ${renderBudgetProgress(budget, used, "已用")}
        </div>
      `;
    })
    .join("");
}

function renderSettings() {
  els.deviceList.innerHTML = state.devices
    .map(
      (device) => `
        <div class="device-row">
          <div>
            <strong>${device.deviceName}</strong>
            <span>${platformName(device.platform)} · ${formatDateTime(device.lastSyncAt)}</span>
          </div>
          ${renderStatusPill(device.status)}
        </div>
      `
    )
    .join("");

  els.categoryTags.innerHTML = state.categories
    .slice(0, 10)
    .map((category) => `<span class="tag">${category.name}</span>`)
    .join("");

  els.accountStack.innerHTML = state.accounts
    .map(
      (account) => `
        <div class="account-row">
          <div>
            <strong>${account.name}</strong>
            <span>${accountTypeName(account.type)}</span>
          </div>
          <strong class="money">${formatMoney(account.currentBalanceCent)}</strong>
        </div>
      `
    )
    .join("");

  els.backupList.innerHTML = state.backupJobs
    .map(
      (job) => `
        <div class="backup-row">
          <div>
            <strong>${backupStatusName(job.status)}</strong>
            <span>${formatDateTime(job.createdAt)}${job.fileSize ? ` · ${Math.round(job.fileSize / 1024)} KB` : ""}</span>
          </div>
          ${renderBackupStatusPill(job.status)}
        </div>
      `
    )
    .join("");
}

function getFilteredTransactions() {
  const month = els.monthFilter.value;
  const categoryId = els.categoryFilter.value;
  const accountId = els.accountFilter.value;
  const keyword = els.keywordFilter.value.trim().toLowerCase();

  return state.transactions
    .filter((transaction) => !transaction.isDeleted)
    .filter((transaction) => transaction.occurredAt.startsWith(month))
    .filter((transaction) => state.filterType === "all" || transaction.type === state.filterType)
    .filter((transaction) => categoryId === "all" || transaction.categoryId === categoryId)
    .filter((transaction) => accountId === "all" || transaction.accountId === accountId)
    .filter((transaction) => !keyword || (transaction.note || "").toLowerCase().includes(keyword))
    .sort(sortByOccurredAtDesc);
}

function getTransactionsByMonth(month) {
  return state.transactions
    .filter((transaction) => !transaction.isDeleted && transaction.occurredAt.startsWith(month))
    .sort(sortByOccurredAtDesc);
}

function getSummary(transactions) {
  const incomeCent = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amountCent, 0);
  const expenseCent = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amountCent, 0);
  return {
    incomeCent,
    expenseCent,
    balanceCent: incomeCent - expenseCent
  };
}

function getCategoryExpenseTotals(transactions) {
  const totals = new Map();
  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      totals.set(transaction.categoryId, (totals.get(transaction.categoryId) || 0) + transaction.amountCent);
    });
  return Array.from(totals.entries())
    .map(([categoryId, amountCent]) => ({ category: getCategory(categoryId), amountCent }))
    .sort((a, b) => b.amountCent - a.amountCent);
}

function renderTransactionItem(transaction) {
  const category = getCategory(transaction.categoryId);
  const account = getAccount(transaction.accountId);
  return `
    <div class="transaction-item">
      <span class="category-swatch" style="background:${hexToSoft(category.color)}; color:${category.color}">${category.name.slice(0, 1)}</span>
      <div>
        <strong class="transaction-title">${category.name} · ${escapeHtml(transaction.note || "无备注")}</strong>
        <span class="transaction-sub">${formatShortDate(transaction.occurredAt)} · ${account.name}</span>
      </div>
      <strong class="amount ${transaction.type}">${signedMoney(transaction)}</strong>
    </div>
  `;
}

function renderTransactionRow(transaction) {
  const category = getCategory(transaction.categoryId);
  const account = getAccount(transaction.accountId);
  const isConfirming = state.deletingId === transaction.id;
  return `
    <tr>
      <td>${formatDateTime(transaction.occurredAt)}</td>
      <td>${category.name}</td>
      <td>${account.name}</td>
      <td>${escapeHtml(transaction.note || "无备注")}</td>
      <td class="align-right amount ${transaction.type}">${signedMoney(transaction)}</td>
      <td class="align-right">
        <div class="row-actions">
          <button class="mini-action" data-edit-id="${transaction.id}" type="button" aria-label="编辑 ${category.name}">改</button>
          <button class="mini-action danger" data-delete-id="${transaction.id}" type="button" aria-label="删除 ${category.name}">
            ${isConfirming ? "确认" : "删"}
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderTransactionCard(transaction) {
  const category = getCategory(transaction.categoryId);
  const account = getAccount(transaction.accountId);
  const isConfirming = state.deletingId === transaction.id;
  return `
    <article class="transaction-card">
      <div class="transaction-card-top">
        <strong>${category.name}</strong>
        <strong class="amount ${transaction.type}">${signedMoney(transaction)}</strong>
      </div>
      <span>${escapeHtml(transaction.note || "无备注")}</span>
      <div class="transaction-card-bottom">
        <span class="transaction-sub">${formatDateTime(transaction.occurredAt)} · ${account.name}</span>
        <div class="row-actions">
          <button class="mini-action" data-edit-id="${transaction.id}" type="button">改</button>
          <button class="mini-action danger" data-delete-id="${transaction.id}" type="button">${isConfirming ? "确认" : "删"}</button>
        </div>
      </div>
    </article>
  `;
}

function renderBudgetProgress(budget, usedCent, label) {
  const ratio = budget.amountCent === 0 ? 1 : usedCent / budget.amountCent;
  const status = getBudgetStatus(usedCent, budget.amountCent);
  const width = Math.min(ratio * 100, 100);
  return `
    <div>
      <div class="progress-track">
        <div class="progress-fill ${status}" style="width:${Math.max(width, 2)}%"></div>
      </div>
      <div class="budget-meta">
        <span>${label} ${formatMoney(usedCent)}</span>
        <span>剩余 ${formatMoney(Math.max(budget.amountCent - usedCent, 0))} · ${Math.round(ratio * 100)}%</span>
      </div>
    </div>
  `;
}

function renderStatusPill(status) {
  const text = {
    normal: "正常",
    warning: "接近上限",
    exceeded: "已超限",
    success: "成功",
    failed: "需重试",
    running: "处理中"
  }[status] || status;
  return `<span class="status-pill ${status}">${text}</span>`;
}

function renderBackupStatusPill(status) {
  const text = {
    success: "成功",
    running: "处理中",
    failed: "需重试",
    pending: "等待中"
  }[status];
  const tone = status === "running" || status === "pending" ? "warning" : status;
  return `<span class="status-pill ${tone}">${text}</span>`;
}

function getBudgetStatus(usedCent, amountCent) {
  if (amountCent <= 0 || usedCent / amountCent >= 1) return "exceeded";
  if (usedCent / amountCent >= 0.8) return "warning";
  return "normal";
}

function handleDeleteClick(id) {
  if (state.deletingId !== id) {
    state.deletingId = id;
    renderTransactions();
    toast("再次点击确认删除，正式接口会执行逻辑删除");
    return;
  }

  const transaction = state.transactions.find((item) => item.id === id);
  if (transaction) {
    transaction.isDeleted = true;
  }
  state.deletingId = null;
  renderAll();
  toast("账单已从当前视图移除");
}

function openEntryDialog() {
  els.entryAmount.value = "";
  els.entryNote.value = "";
  setDefaultDate();
  if (typeof els.entryDialog.showModal === "function") {
    els.entryDialog.showModal();
  } else {
    els.entryDialog.setAttribute("open", "open");
  }
  els.entryAmount.focus();
}

function closeEntryDialog() {
  els.entryDialog.close();
}

function handleEntrySubmit(event) {
  event.preventDefault();
  const amount = Number.parseFloat(els.entryAmount.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    toast("金额必须大于 0");
    return;
  }

  const amountCent = Math.round(amount * 100);
  const transaction = {
    id: `tx-${Date.now()}`,
    amountCent,
    type: state.entryType,
    categoryId: els.entryCategory.value,
    accountId: els.entryAccount.value,
    occurredAt: localDateTimeToIso(els.entryDate.value),
    note: els.entryNote.value.trim() || "新记录",
    isDeleted: false
  };
  state.transactions.unshift(transaction);
  updateAccountBalance(transaction);
  closeEntryDialog();
  renderAll();
  toast("已保存账单，首页和统计已刷新");
}

function updateAccountBalance(transaction) {
  const account = getAccount(transaction.accountId);
  account.currentBalanceCent += transaction.type === "income" ? transaction.amountCent : -transaction.amountCent;
}

function getCategory(id) {
  return state.categories.find((category) => category.id === id) || state.categories[0];
}

function getAccount(id) {
  return state.accounts.find((account) => account.id === id) || state.accounts[0];
}

function sortByOccurredAtDesc(a, b) {
  return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
}

function formatMoney(amountCent) {
  const sign = amountCent < 0 ? "-" : "";
  const yuan = Math.abs(amountCent) / 100;
  return `${sign}¥${yuan.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function signedMoney(transaction) {
  return `${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amountCent)}`;
}

function formatShortDate(value) {
  const date = new Date(value);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function localDateTimeToIso(value) {
  if (!value) return new Date().toISOString();
  return `${value}:00+08:00`;
}

function platformName(platform) {
  return platform === "wechat_mini" ? "微信小程序" : "Web";
}

function accountTypeName(type) {
  return {
    cash: "现金",
    bank_card: "银行卡",
    e_wallet: "电子钱包",
    other: "其他"
  }[type];
}

function backupStatusName(status) {
  return {
    success: "备份完成",
    running: "备份进行中",
    failed: "备份失败",
    pending: "等待处理"
  }[status];
}

function hexToSoft(hex) {
  const color = hex.replace("#", "");
  const red = Number.parseInt(color.slice(0, 2), 16);
  const green = Number.parseInt(color.slice(2, 4), 16);
  const blue = Number.parseInt(color.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, 0.14)`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 2400);
}
