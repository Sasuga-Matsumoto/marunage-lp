import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Footer from '@/src/components/Footer';
import UtmCapture from '@/src/components/UtmCapture';

// TODO: 本番発行後にID文字列（例: 'GTM-XXXXXXX'）を設定。空文字のうちはGTMタグを埋め込まない。
const GTM_ID_MAIN = '';
const GTM_ID_AB = '';

export const metadata: Metadata = {
  title: 'PLEX丸投げ節税 | 完全成果報酬で年間100万円以上の手取りアップ',
  description: 'PLEX丸投げ節税は、社宅・旅費規程・役員報酬最適化・企業型DBなど6つの節税スキームの提案から規程整備・月次運用までを完全成果報酬で丸ごと引き受けるフルマネージドサービスです。初期費用0円・否認保証付き。',
  other: {
    'theme-color': '#1E3A8A',
  },
  icons: {
    icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/favicon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* TODO: 本番GTMコンテナID発行後に差し替え（計測用） */}
        {GTM_ID_MAIN ? (
          <Script id="gtm" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID_MAIN}');
          `}</Script>
        ) : null}
        {/* TODO: A/Bテスト用GTMコンテナID発行後に差し替え（バリアント割当・impression計測用） */}
        {GTM_ID_AB ? (
          <Script id="gtm-ab" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID_AB}');
          `}</Script>
        ) : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {GTM_ID_MAIN ? (
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID_MAIN}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        ) : null}
        {GTM_ID_AB ? (
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID_AB}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        ) : null}
        <UtmCapture />
        {children}
        <Footer />
      </body>
    </html>
  );
}
