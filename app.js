/* ===================================
   PORTFOLIO SIMULATOR — APP LOGIC
   Enhanced: All-age support, age-based
   recommendations, specific product listings
   =================================== */

// ===== CONFIGURATION =====
const PRODUCTS = [
    { id: 'deposit', color: '#60a5fa', yieldLow: 1.3, yieldHigh: 1.55, riskMaxLoss: 0, liquidityScore: 60 },
    { id: 'bond', color: '#34d399', yieldLow: 1.8, yieldHigh: 2.0, riskMaxLoss: 0, liquidityScore: 60 },
    { id: 'wealth', color: '#a78bfa', yieldLow: 3.5, yieldHigh: 4.0, riskMaxLoss: 3, liquidityScore: 20 },
    { id: 'insurance', color: '#f472b6', yieldLow: 2.0, yieldHigh: 3.5, riskMaxLoss: 2, liquidityScore: 10 },
    { id: 'reits', color: '#fbbf24', yieldLow: 5.0, yieldHigh: 7.0, riskMaxLoss: 15, liquidityScore: 75 },
    { id: 'dividend', color: '#f87171', yieldLow: 4.0, yieldHigh: 5.0, riskMaxLoss: 25, liquidityScore: 90 },
    { id: 'stock', color: '#22d3ee', yieldLow: 6.0, yieldHigh: 10.0, riskMaxLoss: 35, liquidityScore: 95 },
    { id: 'gold', color: '#facc15', yieldLow: 0, yieldHigh: 0, riskMaxLoss: 15, liquidityScore: 80 },
];

// ===== AGE-BASED PRESETS =====
// 5 patterns covering all life stages
const PRESETS = {
    // 20-35歳: 積極成長型
    aggressive: {
        deposit: 5, bond: 0, wealth: 0, insurance: 0, reits: 15, dividend: 15, stock: 55, gold: 10,
    },
    // 35-45歳: 成長型
    growth: {
        deposit: 10, bond: 5, wealth: 10, insurance: 0, reits: 15, dividend: 20, stock: 30, gold: 10,
    },
    // 45-55歳: 安定成長型
    balanced: {
        deposit: 15, bond: 10, wealth: 20, insurance: 0, reits: 20, dividend: 20, stock: 5, gold: 10,
    },
    // 55-70歳: 保守型
    conservative: {
        deposit: 20, bond: 15, wealth: 25, insurance: 0, reits: 15, dividend: 15, stock: 0, gold: 10,
    },
    // 70歳+: 超保守型
    ultraSafe: {
        deposit: 40, bond: 30, wealth: 0, insurance: 20, reits: 0, dividend: 0, stock: 0, gold: 10,
    },
};

// ===== SEARCH KEYWORD GUIDE (China) =====
// 具体的銘柄コード/利回りの代わりに、検索キーワードと概要を提供（投資助言に該当しない）
const PRODUCT_GUIDE = {
    deposit: {
        zh: {
            desc: '中国国有商业银行及全国性股份制银行均提供定期存款和大额存单。存款利率因银行和期限不同而异。',
            keywords: ['大额存单', '定期存款利率对比', '银行存款保险制度'],
            tips: '可前往各银行官网或手机银行APP查看最新挂牌利率，对比后选择。50万元以内受存款保险制度保障。',
        },
        ja: {
            desc: '中国の国有商業銀行および全国規模の株式制銀行が定期預金・大額存単を提供。利率は銀行・期間により異なります。',
            keywords: ['大额存单', '定期存款利率对比', '银行存款保险制度'],
            tips: '各銀行の公式サイトやアプリで最新利率を比較可能。50万元以内は預金保険制度で保護されます。',
        },
    },
    bond: {
        zh: {
            desc: '财政部发行的储蓄国债是最安全的投资之一，利息免税。也可通过证券账户购买国债ETF。',
            keywords: ['储蓄国债', '国债ETF', '债券基金'],
            tips: '储蓄国债可在银行柜台购买（每年多次发行）。国债ETF可在证券交易软件中搜索购买。',
        },
        ja: {
            desc: '財政部が発行する貯蓄国債は最も安全な投資の一つで、利子は非課税です。証券口座から国債ETFも購入可能。',
            keywords: ['储蓄国债', '国债ETF', '债券基金'],
            tips: '貯蓄国債は銀行窓口で購入（年数回発行）。国債ETFは証券取引ソフトで検索可能。',
        },
    },
    wealth: {
        zh: {
            desc: '各商业银行理财子公司推出的养老理财产品，通常为固收+策略，风险评级以R2为主。',
            keywords: ['养老理财产品', '银行理财 R2', '固收+理财'],
            tips: '可在手机银行APP的"理财"栏目中，筛选"养老"类别查看在售产品，注意封闭期和风险评级。',
        },
        ja: {
            desc: '各商業銀行の理財子会社が提供する養老理財商品。通常は固収+戦略で、リスク評価はR2が主流。',
            keywords: ['养老理财产品', '银行理财 R2', '固收+理财'],
            tips: '銀行アプリの「理財」欄で「養老」カテゴリを絞り込み検索。封鎖期間とリスク等級に注意。',
        },
    },
    insurance: {
        zh: {
            desc: '专属商业养老保险和增额终身寿险是中国市场常见的保险类储蓄产品，长期持有可获得稳定回报。',
            keywords: ['专属商业养老保险', '增额终身寿险', '年金险 对比'],
            tips: '建议对比多家保险公司产品的IRR（内部收益率），可在保险经纪平台上获取详细对比信息。',
        },
        ja: {
            desc: '専属商業養老保険や増額終身寿険は、中国市場で一般的な保険型貯蓄商品。長期保有で安定した利回り。',
            keywords: ['专属商业养老保险', '增额终身寿险', '年金险 对比'],
            tips: '複数の保険会社のIRR（内部収益率）を比較推奨。保険仲介プラットフォームで詳細比較可能。',
        },
    },
    reits: {
        zh: {
            desc: '中国公募REITs覆盖基础设施、仓储物流、产业园区、保障性住房等多个领域，在沪深交易所上市交易。',
            keywords: ['公募REITs', '基础设施REITs', 'REITs 分红率'],
            tips: '在证券交易软件中搜索"REITs"或"基础设施基金"即可查看所有已上市的公募REITs及其分红信息。',
        },
        ja: {
            desc: '中国の公募REITsはインフラ・倉庫物流・産業パーク・保障性住宅等をカバーし、上海/深圳取引所で取引可能。',
            keywords: ['公募REITs', '基础设施REITs', 'REITs 分红率'],
            tips: '証券取引ソフトで「REITs」「基础设施基金」で検索すると、全上場REITsと分配情報を確認できます。',
        },
    },
    dividend: {
        zh: {
            desc: '红利ETF追踪高股息率指数，适合追求稳定分红收入的投资者。红利低波类产品兼顾收益与稳定性。',
            keywords: ['红利ETF', '红利低波ETF', '高股息ETF'],
            tips: '在证券交易软件中搜索"红利"关键词，可以找到多种红利类ETF产品，对比规模和跟踪指数后选择。',
        },
        ja: {
            desc: '紅利ETFは高配当利回り指数に連動し、安定した分配収入を求める投資家に適しています。',
            keywords: ['红利ETF', '红利低波ETF', '高股息ETF'],
            tips: '証券取引ソフトで「红利」を検索すると複数の紅利ETFが見つかります。規模と連動指数を比較して選択。',
        },
    },
    stock: {
        zh: {
            desc: '股票指数ETF一键投资一篮子股票，涵盖沪深300、中证500等主要宽基指数，适合长期定投。',
            keywords: ['沪深300ETF', '中证500ETF', '创业板ETF', '宽基指数ETF'],
            tips: '在证券交易软件中搜索主要指数名称（如"沪深300"）即可找到对应的ETF产品。建议定期定额投资。',
        },
        ja: {
            desc: '株式指数ETFで一括分散投資。沪深300・中証500等の主要指数をカバーし、長期積立に適しています。',
            keywords: ['沪深300ETF', '中证500ETF', '创业板ETF', '宽基指数ETF'],
            tips: '証券取引ソフトで主要指数名（「沪深300」等）を検索すると対応ETFが見つかります。定期積立を推奨。',
        },
    },
    gold: {
        zh: {
            desc: '黄金ETF跟踪金价走势，可在证券账户中买卖。银行也提供积存金和纸黄金等低门槛黄金投资方式。',
            keywords: ['黄金ETF', '积存金', '纸黄金'],
            tips: '在证券交易软件搜索"黄金"可找到ETF产品；银行APP搜索"积存金"或"账户贵金属"可进行小额买入。',
        },
        ja: {
            desc: '黄金ETFは金価格に連動し、証券口座で売買可能。銀行でも積存金や紙黄金等の低門檻投資が可能。',
            keywords: ['黄金ETF', '积存金', '纸黄金'],
            tips: '証券取引ソフトで「黄金」を検索するとETFが見つかります。銀行アプリで「积存金」検索で少額購入も可能。',
        },
    },
};

// ===== AGE-BASED RECOMMENDATION ENGINE =====
function getAgeProfile(age) {
    if (age < 30) {
        return {
            key: 'aggressive',
            zh: { style: '🚀 积极成长型', desc: '年轻是最大的资本，可承受高波动换取高成长', tag: '适合20~30岁', color: '#22d3ee' },
            ja: { style: '🚀 積極成長型', desc: '若さが最大の資本、高ボラティリティを許容し高成長を目指す', tag: '20〜30歳向け', color: '#22d3ee' },
        };
    } else if (age < 40) {
        return {
            key: 'growth',
            zh: { style: '📈 成长型', desc: '事业上升期，在成长与稳健间取得平衡', tag: '适合30~40岁', color: '#34d399' },
            ja: { style: '📈 成長型', desc: 'キャリア上昇期、成長と安定のバランスを取る', tag: '30〜40歳向け', color: '#34d399' },
        };
    } else if (age < 55) {
        return {
            key: 'balanced',
            zh: { style: '⚖️ 稳健成长型', desc: '家庭责任期，注重资产保值与适度增长', tag: '适合40~55岁', color: '#a78bfa' },
            ja: { style: '⚖️ 安定成長型', desc: '家庭責任期、資産保全と適度な成長を重視', tag: '40〜55歳向け', color: '#a78bfa' },
        };
    } else if (age < 70) {
        return {
            key: 'conservative',
            zh: { style: '🛡️ 保守型', desc: '退休准备/退休初期，稳定收入优先，控制风险', tag: '适合55~70岁', color: '#60a5fa' },
            ja: { style: '🛡️ 保守型', desc: '退職準備・退職初期、安定収入優先、リスク管理', tag: '55〜70歳向け', color: '#60a5fa' },
        };
    } else {
        return {
            key: 'ultraSafe',
            zh: { style: '🏦 超保守型', desc: '高龄期，最大限度保全资产，极简运营', tag: '适合70岁以上', color: '#fbbf24' },
            ja: { style: '🏦 超保守型', desc: '高齢期、資産の最大限の保全、運用を極力シンプルに', tag: '70歳以上向け', color: '#fbbf24' },
        };
    }
}

// ===== I18N =====
let currentLang = 'zh';

const I18N = {
    zh: {
        appTitle: '资产配置模拟器',
        appSubtitle: '从职场新人到退休生活，精心规划每一分资产',
        langLabel: '日本語',
        inputTitle: '📋 基本设置',
        initialLabel: '初始投资金额（万元）',
        amountUnit: '万元',
        yearsLabel: '模拟期间（年）',
        yearsUnit: '年',
        inflationLabel: '年通胀率（%）',
        ageLabel: '起始年龄',
        ageUnit: '岁',
        pensionLabel: '每月养老金/被动收入（元）',
        pensionUnit: '元/月',
        presetTitle: '🎯 投资组合方案',
        allocTitle: '⚙️ 资产配置比例',
        allocDesc: '拖动滑块自定义配置比例，总计必须为100%',
        totalLabel: '合计：',
        kpiYieldLabel: '预期年化收益率',
        kpiMonthlyLabel: '月均收入',
        kpiTotalLabel: '累计收入总额',
        kpiRealLabel: '实质购买力（末年月）',
        pieTitle: '资产配置比例',
        lineTitle: '资产推移与累计收入',
        tableTitle: '📊 年度现金流明细',
        thAge: '年龄',
        thYear: '年份',
        thBalance: '资产残高',
        thAnnual: '年收入',
        thMonthly: '月收入',
        thPensionIncome: '养老金+投资',
        thCumulative: '累计收入',
        thReal: '实质购买力/月',
        riskTitle: '⚠️ 风险评估',
        riskLabel1: '最大预估亏损',
        riskLabel2: '安全资产占比',
        riskLabel3: '流动性评分',
        footerText: '⚠️ 本工具仅供参考，不构成投资建议。实际投资请咨询专业理财顾问。',
        productsTitle: '🔍 各资产类别 — 如何查找投资产品',
        productsDesc: '以下为各资产类别的概述及搜索方法指引。请在相关平台自行搜索以下关键词查找适合的产品（仅显示配置比例 > 0% 的类别）',
        guideKeywords: '搜索关键词',
        guideTips: '💡 操作提示',
        guideSearch: '在相关平台搜索：',
        recommendTitle: '💡 年龄适配推荐',
        recommendApply: '应用此方案',
        recommendCurrent: '当前方案',
        deposit: '银行存款/存单',
        bond: '国债',
        wealth: '养老理财',
        insurance: '养老保险',
        reits: '公募REITs',
        dividend: '红利ETF',
        stock: '股票指数ETF',
        gold: '黄金',
    },
    ja: {
        appTitle: '資産配分シミュレーター',
        appSubtitle: '社会人デビューから退職後まで、資産を最適配分',
        langLabel: '中文',
        inputTitle: '📋 基本設定',
        initialLabel: '初期投資額（万元）',
        amountUnit: '万元',
        yearsLabel: 'シミュレーション期間（年）',
        yearsUnit: '年',
        inflationLabel: '年間インフレ率（%）',
        ageLabel: '開始年齢',
        ageUnit: '歳',
        pensionLabel: '月額年金/パッシブ収入（元）',
        pensionUnit: '元/月',
        presetTitle: '🎯 ポートフォリオ方案',
        allocTitle: '⚙️ 資産配分比率',
        allocDesc: 'スライダーで配分をカスタマイズ（合計100%にしてください）',
        totalLabel: '合計：',
        kpiYieldLabel: '期待年化利回り',
        kpiMonthlyLabel: '月平均収入',
        kpiTotalLabel: '累計受取総額',
        kpiRealLabel: '実質購買力（最終年月）',
        pieTitle: '資産配分比率',
        lineTitle: '資産推移と累計収入',
        tableTitle: '📊 年間キャッシュフロー明細',
        thAge: '年齢',
        thYear: '年目',
        thBalance: '資産残高',
        thAnnual: '年間収入',
        thMonthly: '月間収入',
        thPensionIncome: '年金+投資',
        thCumulative: '累計収入',
        thReal: '実質購買力/月',
        riskTitle: '⚠️ リスク評価',
        riskLabel1: '最大想定損失',
        riskLabel2: '安全資産比率',
        riskLabel3: '流動性スコア',
        footerText: '⚠️ 本ツールは参考情報であり、投資助言ではありません。実際の投資判断は専門家にご相談ください。',
        productsTitle: '🔍 資産クラス別 — 投資商品の探し方ガイド',
        productsDesc: '各資産クラスの概要と検索キーワードをご案内します。各プラットフォームでキーワード検索してご自身に合った商品をお探しください（配分>0%のクラスのみ表示）',
        guideKeywords: '検索キーワード',
        guideTips: '💡 操作ヒント',
        guideSearch: '関連プラットフォームで検索：',
        recommendTitle: '💡 年齢別推奨プラン',
        recommendApply: 'このプランを適用',
        recommendCurrent: '現在のプラン',
        deposit: '銀行預金/存単',
        bond: '国債',
        wealth: '養老理財',
        insurance: '養老保険',
        reits: '公募REITs',
        dividend: '紅利ETF',
        stock: '株式指数ETF',
        gold: '黄金',
    }
};

function t(key) {
    return I18N[currentLang][key] || key;
}

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'ja' : 'zh';
    applyLanguage();
    updateAll();
}

function applyLanguage() {
    const map = {
        'app-title': 'appTitle',
        'app-subtitle': 'appSubtitle',
        'lang-label': 'langLabel',
        'input-title': 'inputTitle',
        'initial-label': 'initialLabel',
        'amount-unit': 'amountUnit',
        'years-label': 'yearsLabel',
        'years-unit': 'yearsUnit',
        'inflation-label': 'inflationLabel',
        'age-label': 'ageLabel',
        'age-unit': 'ageUnit',
        'pension-label': 'pensionLabel',
        'pension-unit': 'pensionUnit',
        'preset-title': 'presetTitle',
        'alloc-title': 'allocTitle',
        'alloc-desc': 'allocDesc',
        'total-label': 'totalLabel',
        'kpi-yield-label': 'kpiYieldLabel',
        'kpi-monthly-label': 'kpiMonthlyLabel',
        'kpi-total-label': 'kpiTotalLabel',
        'kpi-real-label': 'kpiRealLabel',
        'pie-title': 'pieTitle',
        'line-title': 'lineTitle',
        'table-title': 'tableTitle',
        'th-age': 'thAge',
        'th-year': 'thYear',
        'th-balance': 'thBalance',
        'th-annual': 'thAnnual',
        'th-monthly': 'thMonthly',
        'th-pension-income': 'thPensionIncome',
        'th-cumulative': 'thCumulative',
        'th-real': 'thReal',
        'risk-title': 'riskTitle',
        'risk-label-1': 'riskLabel1',
        'risk-label-2': 'riskLabel2',
        'risk-label-3': 'riskLabel3',
        'footer-text': 'footerText',
        'products-title': 'productsTitle',
        'products-desc': 'productsDesc',
    };

    for (const [id, key] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    }

    // Update allocation slider labels
    PRODUCTS.forEach(p => {
        const label = document.getElementById(`alloc-name-${p.id}`);
        if (label) label.textContent = t(p.id);
    });
}

// ===== ALLOCATION STATE =====
let allocation = { ...PRESETS.conservative };
let activePresetKey = 'conservative';

function applyPresetByKey(key) {
    activePresetKey = key;
    allocation = { ...PRESETS[key] };

    // Update sliders
    PRODUCTS.forEach(p => {
        const slider = document.getElementById(`slider-${p.id}`);
        const pctEl = document.getElementById(`pct-${p.id}`);
        if (slider) slider.value = allocation[p.id] || 0;
        if (pctEl) pctEl.textContent = (allocation[p.id] || 0) + '%';
    });

    updateAll();
}

// ===== BUILD PRESETS (Dynamic based on age) =====
function buildPresets() {
    const container = document.getElementById('preset-grid');
    if (!container) return;
    container.innerHTML = '';

    const age = parseInt(document.getElementById('start-age').value) || 60;
    const recommended = getAgeProfile(age);

    // All 5 presets
    const allPresets = [
        { key: 'aggressive', icon: '🚀' },
        { key: 'growth', icon: '📈' },
        { key: 'balanced', icon: '⚖️' },
        { key: 'conservative', icon: '🛡️' },
        { key: 'ultraSafe', icon: '🏦' },
    ];

    const presetNames = {
        zh: {
            aggressive: { title: '积极成长型', desc: '目标 6%~8%', tag: '20~30岁' },
            growth: { title: '成长型', desc: '目标 4%~5.5%', tag: '30~40岁' },
            balanced: { title: '稳健成长型', desc: '目标 3.5%~4.5%', tag: '40~55岁' },
            conservative: { title: '保守型', desc: '目标 3.0%~3.5%', tag: '55~70岁' },
            ultraSafe: { title: '超保守型', desc: '目标 2.0%~2.5%', tag: '70岁以上' },
        },
        ja: {
            aggressive: { title: '積極成長型', desc: '目標 6%〜8%', tag: '20〜30歳' },
            growth: { title: '成長型', desc: '目標 4%〜5.5%', tag: '30〜40歳' },
            balanced: { title: '安定成長型', desc: '目標 3.5%〜4.5%', tag: '40〜55歳' },
            conservative: { title: '保守型', desc: '目標 3.0%〜3.5%', tag: '55〜70歳' },
            ultraSafe: { title: '超保守型', desc: '目標 2.0%〜2.5%', tag: '70歳以上' },
        },
    };

    const colorMap = {
        aggressive: '#22d3ee',
        growth: '#34d399',
        balanced: '#a78bfa',
        conservative: '#60a5fa',
        ultraSafe: '#fbbf24',
    };

    allPresets.forEach(p => {
        const info = presetNames[currentLang][p.key];
        const isRecommended = p.key === recommended.key;
        const isActive = p.key === activePresetKey;

        const card = document.createElement('button');
        card.className = 'preset-card' + (isActive ? ' active' : '') + (isRecommended ? ' recommended-glow' : '');
        card.onclick = () => applyPresetByKey(p.key);

        const badgeColor = colorMap[p.key];

        card.innerHTML = `
            <div class="preset-badge" style="background: ${badgeColor}22; color: ${badgeColor};">${p.icon}</div>
            <h3>${info.title}</h3>
            <p class="preset-card-desc">${info.desc}</p>
            <span class="preset-tag ${isRecommended ? 'recommended' : ''}">${isRecommended ? (currentLang === 'zh' ? '★ 年龄推荐' : '★ 年齢推奨') : info.tag}</span>
        `;

        container.appendChild(card);
    });

    // Update recommendation banner
    updateRecommendationBanner(age, recommended);
}

function updateRecommendationBanner(age, profile) {
    const banner = document.getElementById('recommendation-banner');
    if (!banner) return;

    const info = profile[currentLang];
    banner.style.borderColor = info.color;
    banner.style.background = info.color + '10';

    const isCurrentlyApplied = activePresetKey === profile.key;

    banner.innerHTML = `
        <div class="recommend-header">
            <span class="recommend-style" style="color: ${info.color}">${info.style}</span>
            <span class="recommend-tag">${info.tag}</span>
        </div>
        <p class="recommend-desc">${info.desc}</p>
        <button class="recommend-btn ${isCurrentlyApplied ? 'applied' : ''}" onclick="applyPresetByKey('${profile.key}')" ${isCurrentlyApplied ? 'disabled' : ''}>
            ${isCurrentlyApplied ? (currentLang === 'zh' ? '✓ 当前方案' : '✓ 現在のプラン') : (currentLang === 'zh' ? '应用此方案' : 'このプランを適用')}
        </button>
    `;
}

// ===== BUILD SLIDERS =====
function buildSliders() {
    const container = document.getElementById('allocation-sliders');
    container.innerHTML = '';

    PRODUCTS.forEach(p => {
        const row = document.createElement('div');
        row.className = 'alloc-row';

        const colorDot = document.createElement('div');
        colorDot.className = 'alloc-color';
        colorDot.style.background = p.color;

        const name = document.createElement('span');
        name.className = 'alloc-name';
        name.id = `alloc-name-${p.id}`;
        name.textContent = t(p.id);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'alloc-slider';
        slider.id = `slider-${p.id}`;
        slider.min = 0;
        slider.max = 100;
        slider.step = 5;
        slider.value = allocation[p.id] || 0;
        slider.style.setProperty('--thumb-color', p.color);
        slider.addEventListener('input', () => {
            allocation[p.id] = parseInt(slider.value);
            document.getElementById(`pct-${p.id}`).textContent = slider.value + '%';
            activePresetKey = null;
            buildPresets();
            updateAll();
        });

        const pct = document.createElement('span');
        pct.className = 'alloc-pct';
        pct.id = `pct-${p.id}`;
        pct.textContent = (allocation[p.id] || 0) + '%';

        row.appendChild(colorDot);
        row.appendChild(name);
        row.appendChild(slider);
        row.appendChild(pct);
        container.appendChild(row);
    });
}

// ===== BUILD PRODUCT LISTINGS =====
function buildProductListings() {
    const container = document.getElementById('product-listings');
    if (!container) return;
    container.innerHTML = '';

    PRODUCTS.forEach(p => {
        const pct = allocation[p.id] || 0;
        if (pct <= 0) return;

        const guide = PRODUCT_GUIDE[p.id];
        if (!guide) return;
        const info = guide[currentLang];
        if (!info) return;

        const section = document.createElement('div');
        section.className = 'product-section';

        const header = document.createElement('div');
        header.className = 'product-section-header';
        header.innerHTML = `
            <div class="product-color-bar" style="background: ${p.color}"></div>
            <h4>${t(p.id)}</h4>
            <span class="product-alloc-badge" style="background: ${p.color}22; color: ${p.color}">${pct}%</span>
        `;

        const card = document.createElement('div');
        card.className = 'guide-card';
        card.innerHTML = `
            <p class="guide-desc">${info.desc}</p>
            <div class="guide-keywords">
                <span class="guide-label">${t('guideSearch')}</span>
                ${info.keywords.map(kw => `<span class="guide-keyword-tag">${kw}</span>`).join('')}
            </div>
            <p class="guide-tips">${info.tips}</p>
        `;

        section.appendChild(header);
        section.appendChild(card);
        container.appendChild(section);
    });
}

// ===== CALCULATIONS =====
function getInputs() {
    return {
        initialAmount: parseFloat(document.getElementById('initial-amount').value) * 10000,
        simYears: parseInt(document.getElementById('sim-years').value),
        inflation: parseFloat(document.getElementById('inflation-rate').value) / 100,
        startAge: parseInt(document.getElementById('start-age').value),
        monthlyPension: parseInt(document.getElementById('monthly-pension').value),
    };
}

function calcWeightedYield() {
    let yieldLow = 0, yieldHigh = 0;
    PRODUCTS.forEach(p => {
        const w = (allocation[p.id] || 0) / 100;
        yieldLow += w * p.yieldLow;
        yieldHigh += w * p.yieldHigh;
    });
    return { low: yieldLow, high: yieldHigh, mid: (yieldLow + yieldHigh) / 2 };
}

function calcMaxLoss() {
    let loss = 0;
    PRODUCTS.forEach(p => {
        const w = (allocation[p.id] || 0) / 100;
        loss += w * p.riskMaxLoss;
    });
    return loss;
}

function calcSafeRatio() {
    return (allocation.deposit || 0) + (allocation.bond || 0);
}

function calcLiquidityScore() {
    let score = 0;
    PRODUCTS.forEach(p => {
        const w = (allocation[p.id] || 0) / 100;
        score += w * p.liquidityScore;
    });
    return Math.round(score);
}

function calcCashflow(inputs) {
    const { initialAmount, simYears, inflation, startAge, monthlyPension } = inputs;
    const yields = calcWeightedYield();
    const annualYield = yields.mid / 100;

    const rows = [];
    let cumulative = 0;

    for (let y = 0; y < simYears; y++) {
        const age = startAge + y;
        // For younger ages, no yield reduction; for older ages, gradual reduction
        let ageAdjust = 1.0;
        if (age >= 75) ageAdjust = 0.75;
        else if (age >= 70) ageAdjust = 0.85;
        else if (age >= 65) ageAdjust = 0.93;

        const effectiveYield = annualYield * ageAdjust;
        const annualIncome = Math.round(initialAmount * effectiveYield);
        const monthlyIncome = Math.round(annualIncome / 12);
        const totalMonthly = monthlyIncome + monthlyPension;
        cumulative += annualIncome;
        const realPower = Math.round(monthlyIncome / Math.pow(1 + inflation, y + 1));

        rows.push({
            age,
            year: y + 1,
            balance: initialAmount,
            annualIncome,
            monthlyIncome,
            totalMonthly,
            cumulative,
            realPower,
        });
    }

    return rows;
}

// ===== CHART INSTANCES =====
let pieChart = null;
let lineChart = null;

function updatePieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const labels = PRODUCTS.filter(p => (allocation[p.id] || 0) > 0).map(p => t(p.id));
    const data = PRODUCTS.filter(p => (allocation[p.id] || 0) > 0).map(p => allocation[p.id]);
    const colors = PRODUCTS.filter(p => (allocation[p.id] || 0) > 0).map(p => p.color);

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderColor: 'rgba(10, 14, 26, 0.8)',
                borderWidth: 2,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { family: "'Inter', 'Noto Sans SC', sans-serif", size: 11 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
                    }
                }
            }
        }
    });
}

function updateLineChart(cashflow) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const labels = cashflow.map(r => r.age + (currentLang === 'zh' ? '岁' : '歳'));
    const incomeData = cashflow.map(r => r.cumulative);
    const monthlyData = cashflow.map(r => r.monthlyIncome);
    const realData = cashflow.map(r => r.realPower);

    if (lineChart) lineChart.destroy();

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: currentLang === 'zh' ? '累计收入（元）' : '累計収入（元）',
                    data: incomeData,
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    yAxisID: 'y',
                },
                {
                    label: currentLang === 'zh' ? '月投资收入（元）' : '月間投資収入（元）',
                    data: monthlyData,
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.05)',
                    fill: false,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    yAxisID: 'y1',
                },
                {
                    label: currentLang === 'zh' ? '实质购买力/月（元）' : '実質購買力/月（元）',
                    data: realData,
                    borderColor: '#fbbf24',
                    borderDash: [5, 3],
                    fill: false,
                    tension: 0.3,
                    borderWidth: 1.5,
                    pointRadius: 1,
                    pointHoverRadius: 4,
                    yAxisID: 'y1',
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: { family: "'Inter', 'Noto Sans SC', sans-serif", size: 11 },
                        usePointStyle: true,
                        pointStyleWidth: 10,
                        padding: 16,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} 元`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { size: 10 } },
                    grid: { color: 'rgba(255,255,255,0.03)' },
                },
                y: {
                    position: 'left',
                    ticks: {
                        color: '#a78bfa',
                        font: { size: 10 },
                        callback: (v) => (v / 10000).toFixed(0) + '万'
                    },
                    grid: { color: 'rgba(255,255,255,0.03)' },
                },
                y1: {
                    position: 'right',
                    ticks: {
                        color: '#60a5fa',
                        font: { size: 10 },
                        callback: (v) => v.toLocaleString()
                    },
                    grid: { drawOnChartArea: false },
                }
            }
        }
    });
}

// ===== UPDATE ALL =====
function updateAll() {
    const inputs = getInputs();

    // Update display values
    document.getElementById('amount-value').textContent = inputs.initialAmount / 10000;
    document.getElementById('years-value').textContent = inputs.simYears;
    document.getElementById('inflation-value').textContent = (inputs.inflation * 100).toFixed(1);
    document.getElementById('age-value').textContent = inputs.startAge;
    document.getElementById('pension-value').textContent = inputs.monthlyPension.toLocaleString();

    // Rebuild presets based on current age
    buildPresets();

    // Update total percentage
    const total = PRODUCTS.reduce((sum, p) => sum + (allocation[p.id] || 0), 0);
    const totalEl = document.getElementById('total-pct');
    const statusEl = document.getElementById('total-status');
    totalEl.textContent = total + '%';
    if (total === 100) {
        statusEl.textContent = '✓';
        statusEl.className = 'total-status ok';
    } else {
        statusEl.textContent = '✗ (' + (total > 100 ? '+' : '') + (total - 100) + '%)';
        statusEl.className = 'total-status error';
    }

    // Calculate
    const yields = calcWeightedYield();
    const cashflow = calcCashflow(inputs);
    const maxLoss = calcMaxLoss();
    const safeRatio = calcSafeRatio();
    const liquidityScore = calcLiquidityScore();

    // KPIs
    document.getElementById('kpi-yield').textContent = yields.mid.toFixed(2) + '%';
    const lastRow = cashflow[cashflow.length - 1];
    const firstRow = cashflow[0];
    document.getElementById('kpi-monthly').textContent = firstRow.monthlyIncome.toLocaleString() + ' 元';
    document.getElementById('kpi-total').textContent = lastRow.cumulative.toLocaleString() + ' 元';
    document.getElementById('kpi-real').textContent = lastRow.realPower.toLocaleString() + ' 元';

    // Risk
    document.getElementById('risk-value-1').textContent = '-' + maxLoss.toFixed(1) + '%';
    document.getElementById('risk-bar-1').style.width = Math.min(maxLoss / 30 * 100, 100) + '%';
    document.getElementById('risk-value-2').textContent = safeRatio + '%';
    document.getElementById('risk-bar-2').style.width = safeRatio + '%';
    document.getElementById('risk-value-3').textContent = liquidityScore + '/100';
    document.getElementById('risk-bar-3').style.width = liquidityScore + '%';

    // Charts
    updatePieChart();
    updateLineChart(cashflow);

    // Product Listings
    buildProductListings();

    // Table
    const tbody = document.getElementById('cashflow-body');
    tbody.innerHTML = '';
    cashflow.forEach(r => {
        const tr = document.createElement('tr');
        const ageUnit = currentLang === 'zh' ? '岁' : '歳';
        const yearUnit = currentLang === 'zh' ? '年' : '年目';
        tr.innerHTML = `
            <td>${r.age}${ageUnit}</td>
            <td>${r.year}${yearUnit}</td>
            <td>${r.balance.toLocaleString()}</td>
            <td>${r.annualIncome.toLocaleString()}</td>
            <td>${r.monthlyIncome.toLocaleString()}</td>
            <td style="color: var(--accent-green); font-weight:600;">${r.totalMonthly.toLocaleString()}</td>
            <td>${r.cumulative.toLocaleString()}</td>
            <td style="color: var(--accent-orange);">${r.realPower.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    buildSliders();
    // Default: use age-based recommendation
    const age = parseInt(document.getElementById('start-age').value) || 60;
    const profile = getAgeProfile(age);
    applyPresetByKey(profile.key);
});
