import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import DownloadForm from '@/src/components/DownloadForm';
import FormStartTracker from '@/src/components/FormStartTracker';

export const metadata: Metadata = {
  title: '資料ダウンロード | PLEX丸投げ節税',
  description: 'PLEX丸投げ節税のサービス資料をダウンロードいただけます。節税スキームの概要、完全成果報酬の課金ロジック、導入事例をまとめています。',
};

export default function DownloadPage() {
  return (
    <>
      <Header variant="download" />
      <FormStartTracker formType="download" />
      <DownloadForm />
    </>
  );
}
