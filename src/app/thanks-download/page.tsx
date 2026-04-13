import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import ThanksDownloadRedesign from '@/src/components/thanks/ThanksDownloadRedesign';
import ThanksPageView from '@/src/components/ThanksPageView';

export const metadata: Metadata = {
  title: '資料をお送りしました | PLEX丸投げ節税',
  robots: 'noindex, nofollow',
};

export default function ThanksDownloadPage() {
  return (
    <>
      <Header variant="thanks-download" />
      <ThanksPageView formType="download" />
      <ThanksDownloadRedesign />
    </>
  );
}
