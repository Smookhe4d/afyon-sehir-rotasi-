import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import LegalPage from "@/components/LegalPage";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/sartlar", pageTitle(locale, "terms"));
}
export default async function Sartlar({ params }: { params: Promise<{locale: Locale}> }) {
  setRequestLocale((await params).locale);
  return (
    <LegalPage eyebrow="YASAL" title="Kullanım Şartları" items={[
      ["Genel bilgi", "Afyon Şehir Rotası, Afyonkarahisar'ı gezenler için hazırlanmış bir rehberdir. Açılış saatleri, ücretler ve erişim koşulları değişebilir; ziyaretten önce ilgili kurumdan doğrulayınız."],
      ["Güvenlik", "Doğa ve yürüyüş rotalarında hava durumunu, yol ve patika durumunu kontrol edin; zor rotalarda yalnız çıkmayın. Rota bilgileri yönlendirme amaçlıdır; kendi güvenliğinizden siz sorumlusunuz. Acil durumda 112'yi arayın."],
      ["Topluluk içeriği", "Paylaştığınız yorum ve fotoğraflardan siz sorumlusunuz. Hakaret, nefret söylemi, başkalarının haklarını ihlal eden veya yasa dışı içerik kaldırılabilir."],
      ["Fotoğraflar ve kaynaklar", "Duraklardaki fotoğraflar Wikimedia Commons üzerinden, sahiplerinin belirttiği Creative Commons veya kamu malı lisanslarıyla gösterilir; her fotoğrafın altında sahibi ve lisansı belirtilir."],
    ]} />
  );
}
