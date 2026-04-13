'use client';

import { useState, useMemo } from 'react';
import FadeIn from './FadeIn';
import TrackedLink from './TrackedLink';

const NICHITO_PER_DIEM = 20000;       // 円 / 回
const NICHITO_TIMES_PER_MONTH = 10;   // 回 / 月
const SHATAKU_RENT_RATIO = 0.25;      // 家賃 = 月給 × 1/4
const MEAL_PER_USE = 2000;            // 円 / 回
const MEAL_TIMES_PER_WEEK = 3;        // 回 / 週
const DB_CONTRIB_RATIO = 0.2;         // 月給の 20% を拠出
const TAX_SAVE_RATE = 0.5;            // 税・社保削減率（日当／社宅／残業食事）
const SHAHO_SAVE_RATE = 0.3;          // 社保削減率（企業型DB）

function formatMan(yen: number): string {
  return Math.round(yen / 10000).toLocaleString('ja-JP');
}

export default function SimulatorSection() {
  const [monthlySalary, setMonthlySalary] = useState<number>(80);

  const results = useMemo(() => {
    const m = Math.max(0, monthlySalary);

    const nichito = NICHITO_PER_DIEM * NICHITO_TIMES_PER_MONTH * 12 * TAX_SAVE_RATE;
    const shataku = m * 10000 * SHATAKU_RENT_RATIO * 12 * TAX_SAVE_RATE;
    const meal = MEAL_PER_USE * MEAL_TIMES_PER_WEEK * 52 * TAX_SAVE_RATE;
    const db = m * 10000 * DB_CONTRIB_RATIO * 12 * SHAHO_SAVE_RATE;

    const total = nichito + shataku + meal + db;
    const monthlyFee = (total * 0.2) / 12;

    return {
      nichito, shataku, meal, db, total,
      annualLow: total * 0.75,
      annualHigh: total * 1.25,
      monthlyLow: monthlyFee * 0.75,
      monthlyHigh: monthlyFee * 1.25,
    };
  }, [monthlySalary]);

  return (
    <section className="section simulator" id="simulator">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SIMULATION</div>
          <h2 className="section-title">社長の効果シミュレーション</h2>
          <p className="section-desc">社長の月額報酬を入力するだけで、年間効果と月課金のレンジを試算します。正確な効果額は無料診断で個別にご提示します。</p>
        </FadeIn>

        <FadeIn>
          <div className="sim-card">
            <div className="sim-inputs">
              <div className="sim-input-group">
                <label htmlFor="sim-salary">
                  社長の月額報酬
                  <span className="sim-input-badge">{monthlySalary} 万円</span>
                </label>
                <input
                  id="sim-salary"
                  type="range"
                  min={40}
                  max={300}
                  step={10}
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                />
                <div className="sim-input-scale">
                  <span>40万</span>
                  <span>300万</span>
                </div>
              </div>
            </div>

            <div className="sim-output">
              <div className="sim-headline">
                <div className="sim-headline-label">年間効果レンジ</div>
                <div className="sim-headline-value">
                  約 {formatMan(results.annualLow)}〜{formatMan(results.annualHigh)}
                  <span className="sim-headline-unit">万円</span>
                </div>
              </div>

              <div className="sim-sub">
                <div className="sim-sub-label">うち月課金レンジ（効果額の20%）</div>
                <div className="sim-sub-value">約 {formatMan(results.monthlyLow)}〜{formatMan(results.monthlyHigh)} 万円／月</div>
              </div>

              <div className="sim-breakdown">
                <div className="sim-breakdown-label">内訳（中央値）</div>
                <ul>
                  <li><span>出張日当</span><span>約 {formatMan(results.nichito)} 万円</span></li>
                  <li><span>役員社宅</span><span>約 {formatMan(results.shataku)} 万円</span></li>
                  <li><span>残業食事規程</span><span>約 {formatMan(results.meal)} 万円</span></li>
                  <li><span>企業型DB（選択制）</span><span>約 {formatMan(results.db)} 万円</span></li>
                </ul>
              </div>

              <p className="sim-note">※ 試算前提：日当 2万円×月10回／役員社宅 家賃=月給の1/4／残業食事規程 2,000円×週3回／企業型DB 拠出=月給の20%。効果率は日当・社宅・残業食事で50%、企業型DBで30%として算出。社長個人の効果額のみを試算しており、従業員向けの借上社宅・食事補助等は含みません。</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/contact/" className="btn btn-primary" eventParams={{ form_type: 'contact', cta_location: 'simulator' }}>無料診断で正確な効果額を確認</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
