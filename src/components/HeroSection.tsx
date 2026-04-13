import TrackedLink from '@/src/components/TrackedLink';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="inner">
        <div className="hero-label">PLEX MARUNAGE TAX OPTIMIZATION</div>
        <h1 className="hero-title">年間100万円以上の手取りアップ<br />PLEX丸投げ節税</h1>
        <div className="hero-sub-pitch">
          <span>完全成果報酬</span>
          <span>否認保証付き</span>
          <span>手間なし</span>
        </div>
        <div className="cta-group">
          <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'hero' }}>まずは無料で資料請求</TrackedLink>
          <TrackedLink href="/contact/" className="btn btn-outline-blue hero-contact" eventParams={{ form_type: 'contact', cta_location: 'hero' }}>無料相談を予約する</TrackedLink>
        </div>
        <div className="hero-note">※ 効果は企業規模・役員報酬・出張頻度等により変動します</div>
      </div>
    </section>
  );
}
