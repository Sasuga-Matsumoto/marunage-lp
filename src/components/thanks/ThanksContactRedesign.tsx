import ScheduleButton from '@/src/components/ScheduleButton';

export default function ThanksContactRedesign() {
  return (
    <section className="thanks-section">
      <div className="thanks-inner fade-up">
        <div className="thanks-card">
          <div className="thanks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>

          <h1 className="thanks-title">お問い合わせありがとうございます</h1>

          <p className="thanks-message">PLEX丸投げ節税は、社宅・旅費規程・役員報酬最適化など<br />多岐にわたる節税スキームを<strong>完全成果報酬で丸ごと代行</strong>するサービスです。</p>

          <div className="thanks-schedule">
            <p className="thanks-schedule-text">お問い合わせ内容を踏まえて、30分程度でご説明します</p>
            <ScheduleButton label="空き日程を見る" formType="contact" />
          </div>

          <div className="thanks-divider"></div>

          <div className="thanks-features">
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">0<span style={{ fontSize: '0.9rem' }}>円</span></div>
              <div className="thanks-feature-label">完全成果報酬</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">20<span style={{ fontSize: '0.9rem' }}>%</span></div>
              <div className="thanks-feature-label">月次効果額の課金率</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">100<span style={{ fontSize: '0.9rem' }}>%</span></div>
              <div className="thanks-feature-label">否認補償</div>
            </div>
          </div>

          <div className="thanks-divider"></div>

          <div className="thanks-steps">
            <div className="thanks-steps-label">Next Steps</div>
            <div className="thanks-step">
              <div className="thanks-step-num">1</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">お電話でヒアリング</div>
                <div className="thanks-step-desc">翌営業日</div>
              </div>
            </div>
            <div className="thanks-step">
              <div className="thanks-step-num">2</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">無料診断・効果見込みのご提示</div>
                <div className="thanks-step-desc">書面で具体的な年間効果額をお見せします</div>
              </div>
            </div>
            <div className="thanks-step">
              <div className="thanks-step-num">3</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">規程整備・月次運用開始</div>
                <div className="thanks-step-desc">導入から運用まで一気通貫で代行</div>
              </div>
            </div>
          </div>

          <div className="thanks-notice">
            <div className="thanks-notice-item">
              <span className="thanks-notice-icon">&#x1F4DE;</span>
              <span>翌営業日に担当者からお電話いたします。お問い合わせ内容について詳しくご案内いたします。</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
