import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

export default function PainSolutionSection() {
  return (
    <section className="section pain-solution" id="pain">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SOLUTION</div>
          <h2 className="section-title">こんなお悩み、ありませんか？</h2>
        </FadeIn>

        <FadeIn>
          <div className="pain-cards">
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>節税コンサルに払ったのに<br />思ったほど効果が出ない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>規程整備や月次運用の手間が多く<br />導入に踏み切れない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>否認されたら全て自己責任で<br />リスクを取り切れない</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="solution-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </FadeIn>

        <FadeIn className="section-center">
          <h3 className="section-title" style={{ fontSize: '1.3rem' }}>どのお悩みも、PLEX丸投げ節税が解決します</h3>
        </FadeIn>

        <FadeIn>
          <div className="solution-cards">
            <div className="solution-card">
              <div className="solution-num">01</div>
              <h4>効果が出た分だけ、<br />完全成果報酬</h4>
              <p>初期費用0円、月次効果額の20%のみをお支払いいただく完全成果報酬。効果が出ない月は課金ゼロ、実質ノーリスクで導入いただけます。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">02</div>
              <h4>規程整備から月次運用まで<br />全て丸投げ</h4>
              <p>導入から運用まで一気通貫で、PLEXが代行。お客様は給与データの提出と月次レポートの承認だけで、本業に集中いただけます。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">03</div>
              <h4>業界唯一の<br />否認リスク補償</h4>
              <p>「提案して終わり」の節税コンサルとは違い、運用後の責任までPLEXが引き受けます。万一の否認時も当社が補償し、安心してご導入いただけます。</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'pain_solution' }}>まずは無料で資料請求</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
