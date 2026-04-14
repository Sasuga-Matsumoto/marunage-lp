// PLEX丸投げ節税 効果シミュレーションのロジック
// 「丸投げ_簡易シミュレーション」スプレッドシートと同じ算定式を再現。
// 定数シート・制度未利用時／制度利用時シートの計算フローに準拠。

// ===== 固定パラメータ（シート「入力」より） =====
const NICHITO_PER_DIEM = 20000;          // 日当（円/回）
const NICHITO_TIMES_PER_MONTH = 10;      // 日当回数/月
const YAKUIN_DISPERSE_AMOUNT = 104000;   // 役員報酬分散額（円）
const YAKUIN_DISPERSE_COUNT = 3;         // 分散人数
const SHATAKU_RENT_RATIO = 0.25;         // 家賃 = 月給 × 1/4
const SHATAKU_REDUCTION_RATE = 0.8;      // 役員社宅の経費化割合
const MEAL_COUNT_PER_MONTH = 15;         // 残業食事回数/月
const MEAL_UNIT = 2000;                  // 食事単価（円）
const DB_CONTRIB = 100000;               // 選択制DB 拠出額（円/月）

// ===== 税・保険料定数（シート「定数」より） =====
const EMPLOYMENT_RATE = 0.006;           // 雇用保険料率 0.60%
const JUMIN_RATE = 0.10;                 // 住民税 所得割 10%
const JUMIN_KINT_KAWARI = 5000;          // 住民税 均等割
const JUMIN_BASIC_DEDUCTION = 430000;    // 基礎控除（住民税）
const SHOHI_RATE = 0.1 / 1.1;            // 消費税還付率（10/110）

// 標準報酬月額表: [標準報酬月額, 報酬月額以上, 報酬月額未満, 健康保険折半, 厚生年金折半]
const SST: readonly [number, number, number, number, number][] = [
  [58000, 0, 63000, 2873.9, 8052],
  [68000, 63000, 73000, 3369.4, 8052],
  [78000, 73000, 83000, 3864.9, 8052],
  [88000, 83000, 93000, 4360.4, 8052],
  [98000, 93000, 101000, 4855.9, 8967],
  [104000, 101000, 107000, 5153.2, 9516],
  [110000, 107000, 114000, 5450.5, 10065],
  [118000, 114000, 122000, 5846.9, 10797],
  [126000, 122000, 130000, 6243.3, 11529],
  [134000, 130000, 138000, 6639.7, 12261],
  [142000, 138000, 146000, 7036.1, 12993],
  [150000, 146000, 155000, 7432.5, 13725],
  [160000, 155000, 165000, 7928, 14640],
  [170000, 165000, 175000, 8423.5, 15555],
  [180000, 175000, 185000, 8919, 16470],
  [190000, 185000, 195000, 9414.5, 17385],
  [200000, 195000, 210000, 9910, 18300],
  [220000, 210000, 230000, 10901, 20130],
  [240000, 230000, 250000, 11892, 21960],
  [260000, 250000, 270000, 12883, 23790],
  [280000, 270000, 290000, 13874, 25620],
  [300000, 290000, 310000, 14865, 27450],
  [320000, 310000, 330000, 15856, 29280],
  [340000, 330000, 350000, 16847, 31110],
  [360000, 350000, 370000, 17838, 32940],
  [380000, 370000, 395000, 18829, 34770],
  [410000, 395000, 425000, 20315.5, 37515],
  [440000, 425000, 455000, 21802, 40260],
  [470000, 455000, 485000, 23288.5, 43005],
  [500000, 485000, 515000, 24775, 45750],
  [530000, 515000, 545000, 26261.5, 48495],
  [560000, 545000, 575000, 27748, 51240],
  [590000, 575000, 605000, 29234.5, 53985],
  [620000, 605000, 635000, 30721, 56730],
  [650000, 635000, 665000, 32207.5, 59475],
  [680000, 665000, 695000, 33694, 59475],
  [710000, 695000, 730000, 35180.5, 59475],
  [750000, 730000, 770000, 37162.5, 59475],
  [790000, 770000, 810000, 39144.5, 59475],
  [830000, 810000, 855000, 41126.5, 59475],
  [880000, 855000, 905000, 43604, 59475],
  [930000, 905000, 955000, 46081.5, 59475],
  [980000, 955000, 1005000, 48559, 59475],
  [1030000, 1005000, 1055000, 51036.5, 59475],
  [1090000, 1055000, 1115000, 54009.5, 59475],
  [1150000, 1115000, 1175000, 56982.5, 59475],
  [1210000, 1175000, 1235000, 59955.5, 59475],
  [1270000, 1235000, 1295000, 62928.5, 59475],
  [1330000, 1295000, 1355000, 65901.5, 59475],
  [1390000, 1355000, Infinity, 68874.5, 59475],
];

function lookupInsurance(monthlySalary: number): { health: number; pension: number } {
  for (const r of SST) {
    if (monthlySalary < r[2]) return { health: r[3], pension: r[4] };
  }
  const last = SST[SST.length - 1];
  return { health: last[3], pension: last[4] };
}

// 給与所得控除（シート「給与所得控除」に準拠）
function salaryDeduction(annualIncome: number): number {
  if (annualIncome <= 1900000) return 650000;
  if (annualIncome <= 3600000) return annualIncome * 0.30 + 80000;
  if (annualIncome <= 6600000) return annualIncome * 0.20 + 440000;
  if (annualIncome <= 8500000) return annualIncome * 0.10 + 1100000;
  return 1950000;
}

// 基礎控除（所得税・令和8年分以降）
function basicDeductionIncome(grossIncome: number): number {
  if (grossIncome < 1320000) return 950000;
  if (grossIncome < 3360000) return 880000;
  if (grossIncome < 4890000) return 680000;
  if (grossIncome < 6550000) return 630000;
  if (grossIncome < 23500000) return 580000;
  if (grossIncome < 24000000) return 480000;
  if (grossIncome < 24500000) return 320000;
  if (grossIncome < 25000000) return 160000;
  return 0;
}

// 所得税（累進）
function incomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 1949000) return taxableIncome * 0.05;
  if (taxableIncome <= 3299000) return taxableIncome * 0.10 - 97500;
  if (taxableIncome <= 6949000) return taxableIncome * 0.20 - 427500;
  if (taxableIncome <= 8999000) return taxableIncome * 0.23 - 636000;
  if (taxableIncome <= 17999000) return taxableIncome * 0.33 - 1536000;
  if (taxableIncome <= 39999000) return taxableIncome * 0.40 - 2796000;
  return taxableIncome * 0.45 - 4796000;
}

export interface SchemeFlags {
  nichito: boolean;      // 日当最大化
  yakuinOpt: boolean;    // 役員報酬の最適化
  shataku: boolean;      // 役員社宅の8割経費化
  zangyoMeal: boolean;   // 残業食事規程の活用
  db: boolean;           // 選択制DBの活用
}

export interface TaxResult {
  shotokuzei: number;
  juminzei: number;
  shahoIndividual: number;
  shahoCompany: number;
  shohizei: number;            // 法人の消費税還付（マイナス値=削減）
  individualSum: number;       // 所得税+住民税+社保個
  companySum: number;          // 社保法人+消費税
  total: number;               // individualSum + companySum
  effectiveMonthly: number;    // 各スキーム適用後の月給
}

export function computeTax(monthlySalary: number, flags: SchemeFlags): TaxResult {
  let m = monthlySalary;
  if (flags.nichito) m -= NICHITO_PER_DIEM * NICHITO_TIMES_PER_MONTH;
  if (flags.yakuinOpt) m -= YAKUIN_DISPERSE_AMOUNT * YAKUIN_DISPERSE_COUNT;
  if (flags.shataku) m -= monthlySalary * SHATAKU_RENT_RATIO * SHATAKU_REDUCTION_RATE;
  if (flags.zangyoMeal) m -= MEAL_COUNT_PER_MONTH * MEAL_UNIT;
  if (flags.db) m -= DB_CONTRIB;
  m = Math.max(0, m);

  const annualIncome = m * 12;
  const ins = lookupInsurance(m);
  const shahoIndividual = (ins.health + ins.pension) * 12 + m * EMPLOYMENT_RATE * 12;
  const shahoCompany = shahoIndividual;

  const sDed = salaryDeduction(annualIncome);
  const incomeAfterSalaryDed = Math.max(0, annualIncome - sDed);
  const juminTaxable = Math.max(0, incomeAfterSalaryDed - shahoIndividual - JUMIN_BASIC_DEDUCTION);
  const juminzei = Math.round(juminTaxable * JUMIN_RATE + JUMIN_KINT_KAWARI);

  const basicDed = basicDeductionIncome(incomeAfterSalaryDed);
  const shotokuTaxable = Math.max(0, incomeAfterSalaryDed - shahoIndividual - basicDed);
  const shotokuzei = Math.round(incomeTax(shotokuTaxable));

  const nichitoAnnual = NICHITO_PER_DIEM * NICHITO_TIMES_PER_MONTH * 12;
  const shohizei = flags.nichito ? -Math.round(nichitoAnnual * SHOHI_RATE) : 0;

  const individualSum = shotokuzei + juminzei + Math.round(shahoIndividual);
  const companySum = Math.round(shahoCompany) + shohizei;
  const total = individualSum + companySum;

  return {
    shotokuzei,
    juminzei,
    shahoIndividual: Math.round(shahoIndividual),
    shahoCompany: Math.round(shahoCompany),
    shohizei,
    individualSum,
    companySum,
    total,
    effectiveMonthly: Math.round(m),
  };
}

export const BASELINE_FLAGS: SchemeFlags = {
  nichito: false,
  yakuinOpt: false,
  shataku: false,
  zangyoMeal: false,
  db: false,
};
