'use client';
import { useState, useRef, useCallback } from 'react';
import FadeIn from './FadeIn';

const faqs = [
  {
    q: '完全成果報酬とは具体的にどういう仕組みですか？',
    a: '月次の効果額（企業削減＋個人手取り増の合算）の20%を月額としてお支払いいただきます。初期費用は0円、効果が出なければ料金は発生しません。',
  },
  {
    q: '否認補償はどこまでカバーされますか？',
    a: 'PLEXが提案・運用したスキームが税務当局に否認された場合、PLEXがこれまでに受領した課金額を上限として補償します。架空計上・事実隠蔽などお客様側の重過失は対象外です。',
  },
  {
    q: '効果はどのように計測しますか？',
    a: '毎月、給与データ・社保等級・出張実績などをもとに、PLEXが実効果を算定し、月次レポートで開示します。見込み額固定ではなく、実効果ベースで課金します。',
  },
  {
    q: '顧問税理士を変える必要はありますか？',
    a: 'ありません。既存の顧問税理士はそのままに、節税スキームの設計・規程整備・月次運用をPLEXが代行します。',
  },
  {
    q: '顧問税理士・節税コンサルとの違いは？',
    a: '顧問税理士は申告中心で節税の能動提案は限定的、節税コンサルは提案後の運用と否認リスクが顧客に残ります。PLEXは「提案＋運用代行＋否認補償」までセットで提供します。',
  },
  {
    q: '対応エリアはありますか？',
    a: '全国対応可能です。月次運用はオンライン中心、必要に応じて訪問対応します。',
  },
  {
    q: '社員数が少ないのですが効果は出ますか？',
    a: '社員数より「社長の年収」「住居費」「出張頻度」が効果を左右します。10名未満でも年数百万円の効果が出るケースが多数あります。まずは無料相談で見込みをご確認ください。',
  },
  {
    q: '契約までの流れを教えてください。',
    a: '①無料相談（オンライン60分）→ ②効果見込みのご提示（書面）→ ③ご契約 → ④初月の規程整備 → ⑤翌月から月次運用開始、という流れです。最短4週間で運用開始可能です。',
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
