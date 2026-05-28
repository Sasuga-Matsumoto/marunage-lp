'use client';

import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';
import { useABVariant } from '@/src/lib/use-ab-variant';

export default function FinalCtaSection() {
  // contact-direct-calendar A/Bテストに応じて最終CTAを切替
  const abVariant = useABVariant('contact-direct-calendar');
  const isCalendar = abVariant === 'calendar';
  const ctaText = isCalendar ? '無料で相談する' : 'お問い合わせ';
  const headline = isCalendar ? 'まずはお気軽にご相談ください' : 'まずはお気軽にお問い合わせください';

  return (
    <section className="final-cta" id="contact">
      <FadeIn className="inner">
        <h2>{headline}</h2>
        <p>会社情報と給与構成をお伺いするだけで、年間効果見込みを書面でご提示します。社長の手取りアップと会社のコスト削減を同時に実現します。</p>
        <div className="cta-group">
          <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'final_cta' }}>まずは無料で資料請求</TrackedLink>
          <TrackedLink href="/contact/" className="btn btn-outline-blue hero-contact" eventParams={{ form_type: 'contact', cta_location: 'final_cta' }}>{ctaText}</TrackedLink>
        </div>
      </FadeIn>
    </section>
  );
}
