import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

export default function FinalCtaSection() {
  return (
    <section className="final-cta" id="contact">
      <FadeIn className="inner">
        <h2>節税は、丸ごとPLEXへ</h2>
        <p>会社情報と給与構成をお伺いするだけで、年間効果見込みを書面でご提示します。初期費用0円・完全成果報酬・否認補償付き。</p>
        <div className="cta-group">
          <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'final_cta' }}>まずは無料で資料請求</TrackedLink>
          <TrackedLink href="/contact/" className="btn btn-outline-blue hero-contact" eventParams={{ form_type: 'contact', cta_location: 'final_cta' }}>無料相談を予約する</TrackedLink>
        </div>
      </FadeIn>
    </section>
  );
}
