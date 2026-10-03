import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Kullanım Şartları" };
export default function Sartlar() {
  return (
    <LegalPage eyebrow="YASAL" title="Kullanım Şartları" items={[
      ["Genel bilgi", "Afyon Şehir Rotası, Afyonkarahisar'ı gezenler için hazırlanmış bir rehberdir. Açılış saatleri, ücretler ve erişim koşulları değişebilir; ziyaretten önce ilgili kurumdan doğrulayınız."],
      ["Güvenlik", "Doğa ve yürüyüş rotalarında hava durumunu, yol ve patika durumunu kontrol edin; zor rotalarda yalnız çıkmayın. Rota bilgileri yönlendirme amaçlıdır; kendi güvenliğinizden siz sorumlusunuz. Acil durumda 112'yi arayın."],
      ["Topluluk içeriği", "Paylaştığınız yorum ve fotoğraflardan siz sorumlusunuz. Hakaret, nefret söylemi, başkalarının haklarını ihlal eden veya yasa dışı içerik kaldırılabilir."],
      ["Fotoğraflar ve kaynaklar", "Duraklardaki fotoğraflar Wikimedia Commons üzerinden, sahiplerinin belirttiği Creative Commons veya kamu malı lisanslarıyla gösterilir; her fotoğrafın altında sahibi ve lisansı belirtilir."],
    ]} />
  );
}
