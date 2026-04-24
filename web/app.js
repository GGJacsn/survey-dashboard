const DATA_PATH = "../data/processed/processed_data.json";

const CORE_GROUPS = [
  { id: "", label: "全部", region: "", income: "", sampleSize: null, sampleLevel: "", fileName: "" },
  { id: "dongbei_14_24", label: "东北 × 14–24万", region: "东北", income: "14–24万", sampleSize: 52, sampleLevel: "弱信号", fileName: "东北_14–24万_迭代版.md" },
  { id: "dongbei_8_14", label: "东北 × 8–14万", region: "东北", income: "8–14万", sampleSize: 31, sampleLevel: "弱信号", fileName: "东北_8–14万_迭代版.md" },
  { id: "huadong_14_24", label: "华东 × 14–24万", region: "华东", income: "14–24万", sampleSize: 280, sampleLevel: "重点结论", fileName: "华东_14–24万_迭代版.md" },
  { id: "huadong_24_plus", label: "华东 × 24万以上", region: "华东", income: "24万以上", sampleSize: 217, sampleLevel: "重点结论", fileName: "华东_24万以上_迭代版.md" },
  { id: "huadong_8_14", label: "华东 × 8–14万", region: "华东", income: "8–14万", sampleSize: 147, sampleLevel: "重点结论", fileName: "华东_8–14万_迭代版.md" },
  { id: "huazhong_14_24", label: "华中 × 14–24万", region: "华中", income: "14–24万", sampleSize: 112, sampleLevel: "趋势参考", fileName: "华中_14–24万_迭代版.md" },
  { id: "huazhong_24_plus", label: "华中 × 24万以上", region: "华中", income: "24万以上", sampleSize: 57, sampleLevel: "弱信号", fileName: "华中_24万以上_迭代版.md" },
  { id: "huazhong_8_14", label: "华中 × 8–14万", region: "华中", income: "8–14万", sampleSize: 58, sampleLevel: "弱信号", fileName: "华中_8–14万_迭代版.md" },
  { id: "huabei_14_24", label: "华北 × 14–24万", region: "华北", income: "14–24万", sampleSize: 165, sampleLevel: "重点结论", fileName: "华北_14–24万_迭代版.md" },
  { id: "huabei_24_plus", label: "华北 × 24万以上", region: "华北", income: "24万以上", sampleSize: 80, sampleLevel: "趋势参考", fileName: "华北_24万以上_迭代版.md" },
  { id: "huabei_8_14", label: "华北 × 8–14万", region: "华北", income: "8–14万", sampleSize: 109, sampleLevel: "趋势参考", fileName: "华北_8–14万_迭代版.md" },
  { id: "huanan_14_24", label: "华南 × 14–24万", region: "华南", income: "14–24万", sampleSize: 154, sampleLevel: "重点结论", fileName: "华南_14–24万_迭代版.md" },
  { id: "huanan_24_plus", label: "华南 × 24万以上", region: "华南", income: "24万以上", sampleSize: 124, sampleLevel: "趋势参考", fileName: "华南_24万以上_迭代版.md" },
  { id: "huanan_8_14", label: "华南 × 8–14万", region: "华南", income: "8–14万", sampleSize: 94, sampleLevel: "趋势参考", fileName: "华南_8–14万_迭代版.md" },
  { id: "xinan_14_24", label: "西南 × 14–24万", region: "西南", income: "14–24万", sampleSize: 80, sampleLevel: "趋势参考", fileName: "西南_14–24万_迭代版.md", fallbackFileNames: ["southwest_14_24.md"] },
  { id: "xinan_24_plus", label: "西南 × 24万以上", region: "西南", income: "24万以上", sampleSize: 43, sampleLevel: "弱信号", fileName: "西南_24万以上_迭代版.md" },
  { id: "xinan_8_14", label: "西南 × 8–14万", region: "西南", income: "8–14万", sampleSize: 66, sampleLevel: "趋势参考", fileName: "西南_8–14万_迭代版.md" },
].map(group => ({ ...group, reportPath: group.fileName ? `./reports/${group.fileName}` : "" }));

const REPORT_SCENE_OPTIONS = [
  { value: "summary", label: "总结" },
  { value: "dailyDecision", label: "日常购买决策场景" },
  { value: "productPreference", label: "品类 / 产品形态偏好" },
  { value: "firstPurchase", label: "首购场景" },
  { value: "offline", label: "线下场景" },
  { value: "media", label: "新媒体场景" },
  { value: "processedFood", label: "加工品专项" },
];
const QUERY_SCENE_OPTIONS = REPORT_SCENE_OPTIONS.filter(option => option.value !== "summary");
const SCENE_LABELS = Object.fromEntries(REPORT_SCENE_OPTIONS.map(option => [option.value, option.label]));

const REPORT_SECTION_KEYS = {
  summary: ["summaryText", "c4"],
  dailyDecision: ["dailyDecision"],
  productPreference: ["productPreference"],
  firstPurchase: ["firstPurchase"],
  offline: ["offline"],
  media: ["media"],
  processedFood: ["processedFood"],
};

const QUESTION_CONFIG = {
  q12: { field: "buy_category", title: "Q12. 平时更常买哪类水产品？", type: "multi" },
  q13: { field: "eat_most_category", title: "Q13. 以下四类水产品里，平时在家吃得最多的是哪一类？", type: "single" },
  q14: { field: "q14_key_factors", title: "Q14. 假设你平时购买水产品的情况。下面这些特点里，你买的时候最看重哪2项？", type: "multi" },
  q15: { field: "q15_least_important", title: "Q15. 其中，您认为最不重要的是？", type: "single" },
  q16: { field: "q16_hesitation", title: "Q16. 买一个以前没买过的水产品时，你最容易因为什么犹豫？", type: "single" },
  q17: { field: "q17_preference", title: "Q17. 下面四款水产品产品价格接近、品牌你都不熟悉。你会更倾向于选择哪一款？", type: "single" },
  q18: { field: "q18_accept_higher_price", title: "Q18. 哪一种会让你觉得“贵一点也能接受”？", type: "single" },
  q19: { field: "q19_proof_preference", title: "Q19. 下面四款水产品你都没买过。它们都说自己品质不错，但各自给出的“证明方式”不同。你更愿意先买哪一款试试？", type: "single" },
  q20: { field: "q20_packaging_trust", title: "Q20. 如果在线下冷柜前看到下面四款水产品包装，你会觉得哪一款看起来更放心？", type: "single" },
  q21: { field: "q21_content_platform", title: "Q21. 平时你会在哪些平台刷到和“买菜、做饭、吃什么”有关的内容？", type: "multi" },
  q22: { field: "q22_content_type", title: "Q22. 平时如果你刷到和水产品、做饭、食材有关的内容，你更愿意看哪几类？", type: "multi" },
  q23: { field: "q23_trusted_source", title: "Q23. 如果是推荐水产品、食材这类内容，你会觉得哪种来源更可信？", type: "single" },
  q24: { field: "q24_bought_from_content", title: "Q24. 你有没有跟着主播、达人或内容推荐买过水产品/生鲜/食材？", type: "single" },
  q25: { field: "q25_trigger_to_buy", title: "Q25. 哪种情况最容易让你从“看一看”变成“下单试试”？", type: "single" },
  q26: { field: "q26_processed_frequency", title: "Q26. 过去3个月里，您购买过鱼排、煎饺、馄饨这类水产品加工品的频次是？", type: "single" },
  q27: { field: "q27_processed_value", title: "Q27. 如果买这类水产品加工品，下面哪些情况最会让你觉得它“值得买”？", type: "multi" },
  q28: { field: "q28_processed_hesitation", title: "Q28. 对这类水产品加工品来说，下面哪些情况最容易让你犹豫，甚至不想买？", type: "multi" },
};

const QUERY_SCENE_QUESTIONS = {
  dailyDecision: ["q14", "q15"],
  productPreference: ["q12", "q13"],
  firstPurchase: ["q16", "q17", "q18", "q19"],
  offline: ["q20"],
  media: ["q21", "q22", "q23", "q24", "q25"],
  processedFood: ["q26", "q27", "q28"],
};

let rawData = [];
let filteredData = [];
let currentReport = null;
let currentReportGroup = null;
let currentMode = "query";
let isSyncingControls = false;

const coreGroupFilter = document.getElementById("coreGroupFilter");
const coreGroupNoteEl = document.getElementById("coreGroupNote");
const sceneFilter = document.getElementById("sceneFilter");
const reportStatusEl = document.getElementById("reportStatus");
const sceneContentEl = document.getElementById("sceneContent");

const filters = {
  region: document.getElementById("regionFilter"),
  province: document.getElementById("provinceFilter"),
  age: document.getElementById("ageFilter"),
  income: document.getElementById("incomeFilter"),
  family: document.getElementById("familyFilter"),
  frequency: document.getElementById("frequencyFilter"),
};

const sampleCountEl = document.getElementById("sampleCount");
const sampleRatioEl = document.getElementById("sampleRatio");
const activeFiltersEl = document.getElementById("activeFilters");
const profileSummaryEl = document.getElementById("profileSummary");
const resetBtn = document.getElementById("resetBtn");

async function loadData() {
  const response = await fetch(DATA_PATH);
  if (!response.ok) throw new Error(`数据加载失败: ${response.status} ${response.statusText}`);

  rawData = await response.json();
  filteredData = [...rawData];

  initCoreGroupFilter();
  initFilters();
  setSceneOptions("query");
  bindEvents();
  enterQueryMode({ resetFilters: true });
}

function initCoreGroupFilter() {
  coreGroupFilter.innerHTML = CORE_GROUPS.map(group => {
    const label = group.id ? `${group.label}｜${group.sampleLevel} n=${group.sampleSize}` : "全部";
    return `<option value="${escapeHtml(group.id)}">${escapeHtml(label)}</option>`;
  }).join("");
  coreGroupFilter.value = "";
}

function getUniqueValues(field, data = rawData) {
  return [...new Set(data.map(item => item[field]).filter(Boolean))].sort();
}

function fillSelectOptions(selectEl, values) {
  const previousValue = selectEl.value;
  selectEl.innerHTML = '<option value="">全部</option>';
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
  if ([...selectEl.options].some(option => option.value === previousValue)) {
    selectEl.value = previousValue;
  }
}

function initFilters() {
  fillSelectOptions(filters.region, getUniqueValues("region"));
  fillSelectOptions(filters.province, getUniqueValues("province"));
  fillSelectOptions(filters.age, getUniqueValues("age"));
  fillSelectOptions(filters.income, getUniqueValues("income"));
  fillSelectOptions(filters.family, getUniqueValues("family_structure"));
  fillSelectOptions(filters.frequency, getUniqueValues("seafood_frequency"));
  Object.values(filters).forEach(select => {
    select.disabled = false;
    select.removeAttribute("title");
  });
}

function bindEvents() {
  coreGroupFilter.addEventListener("change", async () => {
    const group = getSelectedCoreGroup();
    if (!group) {
      enterQueryMode({ resetFilters: true });
      return;
    }
    await enterReportMode(group);
  });

  sceneFilter.addEventListener("change", renderSceneContent);

  filters.region.addEventListener("change", () => {
    if (!isSyncingControls) switchToQueryModeFromManualFilter();
    updateProvinceOptions();
    applyFilters();
  });

  [filters.province, filters.age, filters.income, filters.family, filters.frequency].forEach(select => {
    select.addEventListener("change", () => {
      if (!isSyncingControls) switchToQueryModeFromManualFilter();
      applyFilters();
    });
  });

  resetBtn.addEventListener("click", () => enterQueryMode({ resetFilters: true }));
}

function getSelectedCoreGroup() {
  if (!coreGroupFilter.value) return null;
  return CORE_GROUPS.find(group => group.id === coreGroupFilter.value) || null;
}

async function enterReportMode(group) {
  currentMode = "report";
  currentReportGroup = group;
  currentReport = null;

  isSyncingControls = true;
  try {
    coreGroupFilter.value = group.id;
    filters.region.value = group.region;
    updateProvinceOptions();
    filters.province.value = "";
    filters.age.value = "";
    filters.income.value = group.income;
    filters.family.value = "";
    filters.frequency.value = "";
    setSceneOptions("report");
    sceneFilter.value = "summary";
  } finally {
    isSyncingControls = false;
  }

  renderCoreGroupNote();
  applyFilters();
  await loadSelectedReport();
}

function enterQueryMode({ resetFilters = false } = {}) {
  currentMode = "query";
  currentReportGroup = null;
  currentReport = null;

  isSyncingControls = true;
  try {
    coreGroupFilter.value = "";
    if (resetFilters) {
      Object.values(filters).forEach(select => { select.value = ""; });
      updateProvinceOptions();
    }
    setSceneOptions("query");
    if (sceneFilter.value === "summary" || !sceneFilter.value) sceneFilter.value = "dailyDecision";
  } finally {
    isSyncingControls = false;
  }

  renderCoreGroupNote();
  applyFilters();
}

function switchToQueryModeFromManualFilter() {
  currentMode = "query";
  currentReportGroup = null;
  currentReport = null;
  coreGroupFilter.value = "";
  setSceneOptions("query");
  if (sceneFilter.value === "summary" || !sceneFilter.value) sceneFilter.value = "dailyDecision";
  renderCoreGroupNote();
}

function setSceneOptions(mode) {
  const options = mode === "report" ? REPORT_SCENE_OPTIONS : QUERY_SCENE_OPTIONS;
  const previousValue = sceneFilter.value;
  sceneFilter.innerHTML = options.map(option => (
    `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`
  )).join("");
  sceneFilter.value = options.some(option => option.value === previousValue) ? previousValue : (options[0]?.value || "");
}

function updateProvinceOptions() {
  const selectedRegion = filters.region.value;
  const provinceValues = selectedRegion
    ? getUniqueValues("province", rawData.filter(item => item.region === selectedRegion))
    : getUniqueValues("province");
  const currentProvince = filters.province.value;
  fillSelectOptions(filters.province, provinceValues);
  filters.province.value = provinceValues.includes(currentProvince) ? currentProvince : "";
}

function applyFilters() {
  filteredData = rawData.filter(item => {
    const matchRegion = !filters.region.value || item.region === filters.region.value;
    const matchProvince = !filters.province.value || item.province === filters.province.value;
    const matchAge = !filters.age.value || item.age === filters.age.value;
    const matchIncome = !filters.income.value || item.income === filters.income.value;
    const matchFamily = !filters.family.value || item.family_structure === filters.family.value;
    const matchFrequency = !filters.frequency.value || item.seafood_frequency === filters.frequency.value;
    return matchRegion && matchProvince && matchAge && matchIncome && matchFamily && matchFrequency;
  });
  render();
}

async function fetchFirstAvailableText(paths) {
  const errors = [];
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) return { text: await response.text(), path };
      errors.push(`${path}: ${response.status} ${response.statusText}`);
    } catch (err) {
      errors.push(`${path}: ${err.message || String(err)}`);
    }
  }
  throw new Error(errors.join("\n"));
}

async function loadSelectedReport() {
  const group = currentReportGroup;
  if (!group) return;
  const fallbackPaths = (group.fallbackFileNames || []).map(fileName => `./reports/${fileName}`);
  const reportPaths = [group.reportPath, ...fallbackPaths].filter(Boolean);

  reportStatusEl.textContent = `正在加载：${group.label}`;
  sceneContentEl.innerHTML = '<div class="empty-state">报告加载中...</div>';

  try {
    const result = await fetchFirstAvailableText(reportPaths);
    currentReport = parseReport(result.text);
    reportStatusEl.textContent = `报告模式：${group.label}｜${group.sampleLevel}｜报告样本 n=${group.sampleSize}`;
    renderSceneContent();
  } catch (err) {
    currentReport = null;
    reportStatusEl.textContent = "报告加载失败";
    sceneContentEl.innerHTML = `
      <div class="error-state">
        无法读取人群报告 markdown。请确认报告文件位于 <strong>web/reports/</strong>，并使用以下文件名：<br />
        <strong>${escapeHtml(group.fileName)}</strong><br /><br />
        尝试过的路径：<br />
        <pre>${escapeHtml(err.message || String(err))}</pre>
      </div>
    `;
  }
}

function parseReport(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = {};
  let currentKey = null;
  let buffer = [];
  const flush = () => {
    if (!currentKey) return;
    const content = buffer.join("\n").trim();
    if (!sections[currentKey]) sections[currentKey] = "";
    sections[currentKey] += content;
    buffer = [];
  };
  lines.forEach(line => {
    const headingMatch = line.match(/^##\s+\d+\.\s+(.+)$/);
    if (headingMatch) {
      flush();
      currentKey = mapReportHeadingToKey(headingMatch[1]);
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  });
  flush();
  return { title: extractReportTitle(markdown), sections };
}

function extractReportTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : (currentReportGroup ? currentReportGroup.label : "人群报告");
}

function mapReportHeadingToKey(title) {
  if (title.includes("核心结论摘要")) return "summaryText";
  if (title.includes("4C")) return "c4";
  if (title.includes("日常购买决策")) return "dailyDecision";
  if (title.includes("品类") || title.includes("产品形态")) return "productPreference";
  if (title.includes("首购")) return "firstPurchase";
  if (title.includes("线下")) return "offline";
  if (title.includes("新媒体")) return "media";
  if (title.includes("加工品")) return "processedFood";
  if (title.includes("结论汇总")) return "finalSummary";
  return title;
}

function formatPercent(value) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "-";
}

function formatDecimal(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function getTopValue(data, field) {
  const counter = {};
  data.forEach(item => {
    const value = item[field];
    if (!value || isSkipValue(value)) return;
    counter[value] = (counter[value] || 0) + 1;
  });
  const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : "无";
}

function getActiveFiltersText() {
  const active = [];
  if (currentMode === "report" && currentReportGroup) {
    active.push("模式：报告模式");
    active.push(`核心人群：${currentReportGroup.label}`);
  } else {
    active.push("模式：自助查询");
  }
  if (filters.region.value) active.push(`区域：${filters.region.value}`);
  if (filters.province.value) active.push(`省份：${filters.province.value}`);
  if (filters.age.value) active.push(`年龄：${filters.age.value}`);
  if (filters.income.value) active.push(`年收入：${filters.income.value}`);
  if (filters.family.value) active.push(`家庭结构：${filters.family.value}`);
  if (filters.frequency.value) active.push(`频率：${filters.frequency.value}`);
  return active.join("；");
}

function renderSummary() {
  sampleCountEl.textContent = filteredData.length;
  sampleRatioEl.textContent = rawData.length ? formatPercent(filteredData.length / rawData.length) : "-";
  activeFiltersEl.textContent = getActiveFiltersText();
}

function renderProfileSummary() {
  const profileItems = [
    ["主要区域", getTopValue(filteredData, "region")],
    ["主要省份", getTopValue(filteredData, "province")],
    ["主要年龄段", getTopValue(filteredData, "age")],
    ["常见收入档位", getTopValue(filteredData, "income")],
    ["常见家庭结构", getTopValue(filteredData, "family_structure")],
    ["常见水产品消费频率", getTopValue(filteredData, "seafood_frequency")],
  ];
  profileSummaryEl.innerHTML = profileItems.map(([label, value]) => `
    <div class="profile-item">
      <div class="profile-label">${escapeHtml(label)}</div>
      <div class="profile-value">${escapeHtml(value)}</div>
    </div>
  `).join("");
}

function renderCoreGroupNote() {
  if (!coreGroupNoteEl) return;
  if (currentMode === "report" && currentReportGroup) {
    coreGroupNoteEl.innerHTML = `
      <strong>报告模式</strong><br />
      当前人群：${escapeHtml(currentReportGroup.label)}<br />
      报告样本：n=${currentReportGroup.sampleSize}｜${escapeHtml(currentReportGroup.sampleLevel)}<br />
      自助筛选器中的区域与收入已同步；手动修改任意自助筛选项后，将进入自助查询状态。
    `;
    return;
  }
  coreGroupNoteEl.innerHTML = `
    <strong>自助查询模式</strong><br />
    右侧展示当前筛选样本的前端聚合统计，不展示固定人群报告。
  `;
}

function renderSceneContent() {
  if (!sceneContentEl) return;
  const selectedScene = sceneFilter.value || (currentMode === "report" ? "summary" : "dailyDecision");
  if (currentMode === "report") {
    renderReportScene(selectedScene);
    return;
  }
  renderQueryScene(selectedScene);
}

function renderReportScene(selectedScene) {
  if (!currentReport) {
    sceneContentEl.innerHTML = '<div class="empty-state">暂无可展示报告。</div>';
    return;
  }
  const keys = REPORT_SECTION_KEYS[selectedScene] || [];
  const content = keys
    .map(key => currentReport.sections[key])
    .filter(Boolean)
    .map(section => `<div class="report-section">${markdownToHtml(section)}</div>`)
    .join("");
  sceneContentEl.innerHTML = content || `<div class="empty-state">报告中暂未找到“${escapeHtml(SCENE_LABELS[selectedScene])}”模块。</div>`;
}

function renderQueryScene(sceneKey) {
  reportStatusEl.textContent = `自助查询模式｜当前样本 n=${filteredData.length}`;
  if (filteredData.length === 0) {
    sceneContentEl.innerHTML = '<div class="empty-state">当前筛选条件下没有样本。</div>';
    return;
  }
  if (sceneKey === "dailyDecision") {
    sceneContentEl.innerHTML = renderDailyDecisionAggregation(filteredData);
    return;
  }
  if (sceneKey === "processedFood") {
    sceneContentEl.innerHTML = renderProcessedFoodAggregation(filteredData);
    return;
  }
  const questionKeys = QUERY_SCENE_QUESTIONS[sceneKey] || [];
  sceneContentEl.innerHTML = questionKeys.map(key => renderQuestionDistribution(filteredData, QUESTION_CONFIG[key])).join("");
}

function isSkipValue(value) {
  if (Array.isArray(value)) return value.some(isSkipValue);
  const text = String(value ?? "").trim();
  return !text || text.includes("跳过");
}

function normalizeValues(value) {
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  if (typeof value === "string" && value.includes("┋")) return value.split("┋").map(v => v.trim()).filter(Boolean);
  const text = String(value ?? "").trim();
  return text ? [text] : [];
}

function getValidRows(data, config) {
  return data.filter(row => normalizeValues(row[config.field]).filter(value => !isSkipValue(value)).length > 0);
}

function getDistribution(data, config) {
  const counts = {};
  let denominator = 0;
  data.forEach(row => {
    const values = normalizeValues(row[config.field]).filter(value => !isSkipValue(value));
    if (!values.length) return;
    denominator += 1;
    const uniqueValues = config.type === "multi" ? [...new Set(values)] : [values[0]];
    uniqueValues.forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });
  });
  const rows = Object.entries(counts)
    .map(([label, count]) => ({ label, count, ratio: denominator ? count / denominator : 0 }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "zh-CN"));
  return { denominator, rows };
}

function renderQuestionDistribution(data, config) {
  const result = getDistribution(data, config);
  return `
    <div class="aggregation-block">
      <h3>${escapeHtml(config.title)}</h3>
      <div class="aggregation-meta">有效样本 n=${result.denominator}${config.type === "multi" ? "｜多选题，占比口径为选择该项人数 / 有效样本人数" : ""}</div>
      ${renderDistributionTable(result.rows)}
    </div>
  `;
}

function renderDistributionTable(rows) {
  if (!rows.length) return '<div class="empty-state">无有效数据。</div>';
  return `
    <div class="report-table-wrap">
      <table class="report-table aggregation-table">
        <thead><tr><th>选项</th><th class="numeric">人数</th><th class="numeric">占比</th></tr></thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td>${escapeHtml(row.label)}</td>
              <td class="numeric">${row.count}</td>
              <td class="numeric">${formatPercent(row.ratio)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDailyDecisionAggregation(data) {
  const q14Config = QUESTION_CONFIG.q14;
  const q15Config = QUESTION_CONFIG.q15;
  const q14Rows = getValidRows(data, q14Config);
  const q15Rows = getValidRows(data, q15Config);
  const factors = new Set();
  const q14Counts = {};
  const q15Counts = {};

  q14Rows.forEach(row => {
    const values = normalizeValues(row[q14Config.field]).filter(value => !isSkipValue(value));
    [...new Set(values)].forEach(value => {
      q14Counts[value] = (q14Counts[value] || 0) + 1;
      factors.add(value);
    });
  });

  q15Rows.forEach(row => {
    const value = normalizeValues(row[q15Config.field]).filter(value => !isSkipValue(value))[0];
    if (!value) return;
    q15Counts[value] = (q15Counts[value] || 0) + 1;
    factors.add(value);
  });

  const baseRows = [...factors].map(factor => {
    const importance = q14Rows.length ? (q14Counts[factor] || 0) / q14Rows.length : 0;
    const rejection = q15Rows.length ? (q15Counts[factor] || 0) / q15Rows.length : 0;
    const universality = importance - rejection;
    return { factor, importance, rejection, universality };
  });

  const mean = baseRows.length ? baseRows.reduce((sum, row) => sum + row.universality, 0) / baseRows.length : 0;
  const variance = baseRows.length ? baseRows.reduce((sum, row) => sum + Math.pow(row.universality - mean, 2), 0) / baseRows.length : 0;
  const std = Math.sqrt(variance);
  const rows = baseRows
    .map(row => ({ ...row, preference: std ? (row.universality - mean) / std : 0 }))
    .sort((a, b) => b.universality - a.universality);

  return `
    <div class="aggregation-block">
      <h3>${escapeHtml(q14Config.title)}</h3>
      <div class="aggregation-meta">Q14 有效样本 n=${q14Rows.length}｜Q15 有效样本 n=${q15Rows.length}｜普适性 P = 重视度 A - 排斥度 B｜偏好度 Z = P 在本题因素中的标准化得分</div>
      ${renderDailyDecisionTable(rows)}
    </div>
  `;
}

function renderDailyDecisionTable(rows) {
  if (!rows.length) return '<div class="empty-state">无有效数据。</div>';
  return `
    <div class="report-table-wrap">
      <table class="report-table aggregation-table">
        <thead><tr><th>因素</th><th class="numeric">重视度 A</th><th class="numeric">排斥度 B</th><th class="numeric">普适性 P</th><th class="numeric">偏好度 Z</th></tr></thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td>${escapeHtml(row.factor)}</td>
              <td class="numeric">${formatPercent(row.importance)}</td>
              <td class="numeric">${formatPercent(row.rejection)}</td>
              <td class="numeric">${formatDecimal(row.universality)}</td>
              <td class="numeric">${formatDecimal(row.preference)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderProcessedFoodAggregation(data) {
  const processedRows = getValidRows(data, QUESTION_CONFIG.q26);
  const intro = `
    <div class="aggregation-note">
      加工品专项有效样本：<strong>n=${processedRows.length}</strong>。以下统计已排除 “(跳过)” 数据；各题分子与分母均不包含跳过样本。
    </div>
  `;
  return intro + ["q26", "q27", "q28"].map(key => renderQuestionDistribution(processedRows, QUESTION_CONFIG[key])).join("");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map(item => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (isTableStart(lines, index)) {
      flushParagraph();
      flushList();
      const { tableHtml, nextIndex } = parseMarkdownTable(lines, index);
      html.push(tableHtml);
      index = nextIndex;
      continue;
    }
    if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      html.push(`<h4>${formatInline(line.replace(/^####\s+/, ""))}</h4>`);
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      html.push(`<h3>${formatInline(line.replace(/^###\s+/, ""))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${formatInline(line.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }
    if (/^-\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^-\s+/, ""));
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return html.join("\n");
}

function isTableStart(lines, index) {
  const current = lines[index] ? lines[index].trim() : "";
  const next = lines[index + 1] ? lines[index + 1].trim() : "";
  return current.startsWith("|") && next.startsWith("|") && /\|\s*-{3,}/.test(next);
}

function parseMarkdownTable(lines, startIndex) {
  const tableLines = [];
  let index = startIndex;
  while (index < lines.length && lines[index].trim().startsWith("|")) {
    tableLines.push(lines[index].trim());
    index += 1;
  }
  const headers = splitTableRow(tableLines[0]);
  const bodyRows = tableLines.slice(2).map(splitTableRow);
  const thead = `<thead><tr>${headers.map(cell => `<th>${formatInline(cell)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${bodyRows.map(row => `<tr>${row.map(cell => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  return {
    tableHtml: `<div class="report-table-wrap"><table class="report-table">${thead}${tbody}</table></div>`,
    nextIndex: index - 1,
  };
}

function splitTableRow(row) {
  return row.replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());
}

function render() {
  renderSummary();
  renderProfileSummary();
  renderCoreGroupNote();
  renderSceneContent();
}

loadData().catch(err => {
  console.error(err);
  if (profileSummaryEl) profileSummaryEl.innerHTML = '<div class="error-state">数据加载失败，请检查路径或本地服务。</div>';
  if (sceneContentEl) sceneContentEl.innerHTML = `<div class="error-state"><strong>加载失败</strong><pre>${escapeHtml(err.stack || String(err))}</pre></div>`;
  if (reportStatusEl) reportStatusEl.textContent = "加载失败";
});
