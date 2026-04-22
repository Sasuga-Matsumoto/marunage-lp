'use client';
import { useState, useRef, useCallback } from 'react';
import FadeIn from './FadeIn';

const faqs = [
  {
    q: 'どのような節税スキームを扱っていますか？',
    a: '出張旅費日当の最大化、家賃の9割経費化、1人での食事代経費化、非常勤役員での所得分散、報酬構成の最適化など、複数の節税制度を組み合わせてご提案します。',
  },
  {
    q: '具体的にどのくらいの削減効果が見込めますか？',
    a: '月給80万円の社長で年間約319万円、月給100万円で約416万円、月給120万円で約488万円のメリット（税・社保削減額からサービス費を差し引いた金額）が見込めます。実額は給与構成・住居費・出張頻度等によって変動します。',
  },
  {
    q: 'PLEXのサポート範囲はどこまでですか？',
    a: 'ご状況ヒアリング → 最適化プラン作成 → 規程整備の雛形提供 → 運用フロー設計 → 証拠保管の雛形まで、各種雛形と情報を一気通貫でご提供します。規程整備自体はお客様側でご対応いただきます。',
  },
  {
    q: '顧問税理士は変える必要がありますか？',
    a: '変更不要です。顧問税理士の主務は申告・記帳で構造的に節税の能動提案が難しく、社保も守備範囲外となります。PLEXは節税スキームの設計と、規程整備に必要な雛形・情報の提供で補完する立て付けです。',
  },
  {
    q: '契約から導入までどのくらいかかりますか？',
    a: '契約書のご提出から最短1週間で利用開始が可能です（目安1週間〜1ヶ月）。契約書提出 → ヒアリング・プラン作成 → 規程整備の雛形提供・社内決議 → 運用開始 の流れで進みます。',
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = useCallback((i: number) => {
    setActiveIndex(prev => prev === i ? null : i);
  }, []);

  return (
    <section className="section faq" id="faq">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">よくあるご質問</h2>
        </FadeIn>

        <FadeIn>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${activeIndex === i ? ' active' : ''}`}>
                <button
                  className="faq-question"
                  aria-expanded={activeIndex === i}
                  aria-controls={`faq-a${i + 1}`}
                  onClick={() => toggle(i)}
                >
                  Q. {faq.q}
                </button>
                <div
                  className="faq-answer"
                  id={`faq-a${i + 1}`}
                  role="region"
                  ref={el => { answerRefs.current[i] = el; }}
                  style={{ maxHeight: activeIndex === i ? `${answerRefs.current[i]?.scrollHeight || 200}px` : '0' }}
                >
                  <div className="faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
