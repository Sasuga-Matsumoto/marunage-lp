import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import ContactForm from '@/src/components/ContactForm';
import FormStartTracker from '@/src/components/FormStartTracker';

export const metadata: Metadata = {
  title: 'お問い合わせ | PLEX丸投げ節税',
  description: 'PLEX丸投げ節税へのお問い合わせはこちら。無料相談のご依頼やサービスに関するご質問など、お気軽にお問い合わせください。',
};

export default function ContactPage() {
  return (
    <>
      <Header variant="contact" />
      <FormStartTracker formType="contact" />
      <ContactForm />
    </>
  );
}
