'use client';

import { useState, useMemo } from 'react';
import FadeIn from './FadeIn';
import TrackedLink from './TrackedLink';
import { computeTax, BASELINE_FLAGS, type SchemeFlags } from '@/src/lib/simulator';

function formatYen(v: number): string {
  const sign = v < 0 ? '-' : '';
  return `${sign}¥${Math.abs(Math.round(v)).toLocaleString('ja-JP')}`;
}

const SCHEME_LABELS: { key: keyof SchemeFlags; label: string }[] = [
  { key: 'nichito', label: '日当の最大化' },
  { key: 'yakuinOpt', label: '役員報酬の最適化' },
  { key: 'shataku', label: '役員社宅の8割経費化' },
  { key: 'zangyoMeal', label: '残業食事規程の活用' },
  { key: 'db', label: '選択制DBの活用' },
];

const SALARY_MIN = 40;
const SALARY_MAX = 300;

export default function SimulatorSection() {
  const [monthlySalary, setMonthlySalary] = useState<number>(100);
  const [flags, setFlags] = useState<SchemeFlags>({
    nichito: true,
    yakuinOpt: true,
    shataku: true,
    zangyoMeal: true,
    db: true,
  });

  const { before, after, diffs } = useMemo(() => {
    const m = monthlySalary * 10000;
    const before = computeTax(m, BASELINE_FLAGS);
    const after = computeTax(m, flags);
    const diffs = {
      shotokuzei: before.shotokuzei - after.shotokuzei,
      juminzei: before.juminzei - after.juminzei,
      shahoIndividual: before.shahoIndividual - after.shahoIndividual,
      shahoCompany: before.shahoCompany - after.shahoCompany,
      shohizei: before.shohizei - after.shohizei,
      individualSum: before.individualSum - after.individualSum,
      companySum: before.companySum - after.companySum,
      total: before.total - after.total,
    };
    return { before, after, diffs };
  }, [monthlySalary, flags]);

  const monthlyTotal = diffs.total / 12;
  const salaryFillPct = ((monthlySalary - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100;

  return (
    <section className="section simulator" id="simulator">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SIMULATION</div>
          <h2 className="section-title">社長の効果シミュレーション</h2>
          <p className="section-desc">社長の月額報酬と利用する施策を選ぶだけで、年間の税・社保削減額と内訳を試算します。正確な効果額は無料診断で個別にご提示します。</p>
        </FadeIn>

        <FadeIn>
          <div className="sim-card">
            <div className="sim-inputs">
              <div className="sim-input-group">
                <label htmlFor="sim-salary">
                  社長の月額報酬（額面）
                  <span className="sim-input-badge">{monthlySalary} 万円</span>
                </label>
                <input
                  id="sim-salary"
                  type="range"
                  min={SALARY_MIN}
                  max={SALARY_MAX}
                  step={10}
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  style={{ '--sim-fill': `${salaryFillPct}%` } as React.CSSProperties}
                />
                <div className="sim-input-scale">
                  <span>{SALARY_MIN}万</span>
                  <span>{SALARY_MAX}万</span>
                </div>
              </div>

              <div className="sim-schemes">
                <div className="sim-schemes-title">併用する施策</div>
                <div className="sim-schemes-list">
                  {SCHEME_LABELS.map((s) => (
                    <label key={s.key} className="sim-scheme">
                      <input
                        type="checkbox"
                        checked={flags[s.key]}
                        onChange={(e) => setFlags({ ...flags, [s.key]: e.target.checked })}
                      />
                      <span className="sim-scheme-label">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sim-output">
              <div className="sim-headline">
                <div className="sim-headline-label">年間の削減額合計</div>
                <div className="sim-headline-value">{formatYen(diffs.total)}</div>
                <div className="sim-headline-sub">月額換算 {formatYen(monthlyTotal)} ／月</div>
              </div>

              <div className="sim-split">
                <div className="sim-split-item">
                  <div className="sim-split-label">社長の手取りアップ</div>
                  <div className="sim-split-value">{formatYen(diffs.individualSum)}</div>
                  <div className="sim-split-sub">月額換算 {formatYen(diffs.individualSum / 12)}</div>
                </div>
                <div className="sim-split-item">
                  <div className="sim-split-label">法人負担の削減額</div>
                  <div className="sim-split-value">{formatYen(diffs.companySum)}</div>
                  <div className="sim-split-sub">月額換算 {formatYen(diffs.companySum / 12)}</div>
                </div>
              </div>

              <div className="sim-breakdown">
                <div className="sim-breakdown-label">内訳（年額）</div>
                <table className="sim-table">
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>未利用時</th>
                      <th>利用時</th>
                      <th>削減額</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>所得税</td>
                      <td>{formatYen(before.shotokuzei)}</td>
                      <td>{formatYen(after.shotokuzei)}</td>
                      <td className="sim-diff">{formatYen(diffs.shotokuzei)}</td>
                    </tr>
                    <tr>
                      <td>住民税</td>
                      <td>{formatYen(before.juminzei)}</td>
                      <td>{formatYen(after.juminzei)}</td>
                      <td className="sim-diff">{formatYen(diffs.juminzei)}</td>
                    </tr>
                    <tr>
                      <td>社会保険料（個人）</td>
                      <td>{formatYen(before.shahoIndividual)}</td>
                      <td>{formatYen(after.shahoIndividual)}</td>
                      <td className="sim-diff">{formatYen(diffs.shahoIndividual)}</td>
                    </tr>
                    <tr>
                      <td>社会保険料（法人）</td>
                      <td>{formatYen(before.shahoCompany)}</td>
                      <td>{formatYen(after.shahoCompany)}</td>
                      <td className="sim-diff">{formatYen(diffs.shahoCompany)}</td>
                    </tr>
                    <tr>
                      <td>消費税（法人・還付）</td>
                      <td>{formatYen(before.shohizei)}</td>
                      <td>{formatYen(after.shohizei)}</td>
                      <td className="sim-diff">{formatYen(diffs.shohizei)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="sim-note">※ 東京都・扶養なし・賞与なしの前提で試算。標準報酬月額・所得税率・給与所得控除・基礎控除（令和8年分以降）は現行の法令に基づく。実際の効果額は無料診断で個別にご提示します。</p>
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
