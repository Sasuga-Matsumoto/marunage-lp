import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

export default function MeritSection() {
  return (
    <section className="section merit" id="merit">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">MERIT</div>
          <h2 className="section-title">社長にも会社にも大きなメリット</h2>
        </FadeIn>

        <div className="merit-grid" style={{ marginTop: '36px' }}>
          <FadeIn delay={1}>
            <div className="merit-block-label">経営者のメリット</div>
            <div className="merit-card card-employee">
              <h3>社長の手取りが<br />年間100万円以上アップ</h3>
              <p>役員報酬の構成最適化・社宅・出張旅費などを組み合わせ、給与総額は変えずに社長個人の社保・所得税負担を合法的に軽減。将来の退職金原資の積み上げも同時に実現します。</p>
            </div>
          </FadeIn>
          <FadeIn delay={2}>
            <div className="merit-block-label">会社のメリット</div>
            <div className="merit-card card-company">
              <h3>会社の社保負担も<br />年間数百万円ダウン</h3>
              <p>社会保険料は労使折半のため、役員・従業員分の保険料削減は会社負担分も同額削減できます。福利厚生の充実による採用力・定着率の向上、規程整備による税務リスクの低減も同時に進みます。</p>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'merit' }}>まずは無料で資料請求</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
