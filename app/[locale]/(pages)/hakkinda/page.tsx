import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import LegalPage from "@/components/LegalPage";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/hakkinda", pageTitle(locale, "about"));
}
export default async function Hakkinda({ params }: { params: Promise<{locale: Locale}> }) {
  setRequestLocale((await params).locale);
  return (
    <>
      <LegalPage eyebrow="BİLGİLENDİRME" title="Hakkında" items={[
        ["Afyon Şehir Rotası nedir?", "Afyonkarahisar'ı gezenler için hazırlanmış, ücretsiz bir dijital rehberdir: kaynaklı durak anlatımları, hazır rotalar, canlı yönlendirmeli harita, sesli rehber ve grup turu."],
        ["Bilgiler nereden geliyor?", "Durak metinleri ve rotalar resmî kurum yayınları ve akademik kaynaklardan derlenir; her durak sayfasında kaynaklar listelenir. Fotoğraflar Wikimedia Commons'tan, sahiplerinin belirttiği lisansla gösterilir."],
        ["Nasıl katkı sunabilirim?", "Yanlış veya eksik bir bilgi, yeni bir durak ya da rota önerisi, fotoğraf katkısı veya şikayetiniz için Geri Bildirim sayfasını kullanın. Her mesaj okunur."],
        ["Grup turu", "Rota sayfasından “Grupla başla”ya basarak bir kod oluşturun, arkadaşlarınıza gönderin. Herkes haritada birbirini canlı görür; rehber durakları ilerlettiğinde grup birlikte ilerler."],
      ]} />
      <div className="-mt-4 px-5 pb-10"><Link href="/geri-bildirim" className="terra-grad flex h-14 items-center justify-center rounded-full font-bold text-white">Geri bildirim gönder</Link></div>
    </>
  );
}
