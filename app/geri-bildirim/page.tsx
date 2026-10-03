import PageHeader from "@/components/PageHeader";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata = { title: "Geri Bildirim" };

export default async function GeriBildirim({ searchParams }: { searchParams: Promise<{ durak?: string; tur?: string }> }) {
  const { durak, tur } = await searchParams;
  return (
    <main className="pb-10">
      <PageHeader eyebrow="BİZE ULAŞIN" title="Geri Bildirim" />
      <p className="mx-5 mt-4 text-sm leading-relaxed text-ink-2">Önerileriniz, yanlış gördüğünüz bilgiler, fotoğraf ve içerik katkılarınız ve şikayetleriniz için buradan yazabilirsiniz. Giriş yapmanız gerekmez.</p>
      <FeedbackForm placeId={durak} kind0={tur} />
    </main>
  );
}
