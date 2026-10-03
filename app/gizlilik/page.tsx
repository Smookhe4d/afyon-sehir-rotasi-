import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Gizlilik" };
export default function Gizlilik() {
  return (
    <LegalPage eyebrow="YASAL" title="Gizlilik" items={[
      ["Hangi verileri topluyoruz?", "Hesap oluşturduğunuzda e-posta adresiniz ve görünen adınız; kullanım sırasında favori rotalarınız, ziyaret ettiğiniz duraklar, yorumlarınız ve paylaştığınız fotoğraflar saklanır. Misafir olarak gezenlerden kişisel veri istenmez."],
      ["Konum bilgisi", "Haritadaki canlı konum yalnızca sizin izninizle ve cihazınızda kullanılır; sunucularımıza kaydedilmez."],
      ["Verilerin kullanımı", "Veriler yalnızca uygulamanın çalışması için kullanılır; üçüncü kişilere satılmaz veya reklam amacıyla paylaşılmaz. Altyapı sağlayıcıları: Supabase (veri tabanı ve oturum), Vercel (barındırma)."],
      ["Haklarınız", "Hesabınızın ve verilerinizin silinmesini veya düzeltilmesini talep edebilirsiniz. Talepler için uygulama sahibine e-posta ile ulaşabilirsiniz."],
    ]} />
  );
}
