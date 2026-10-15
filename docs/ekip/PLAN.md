# Geliştirme planı

Kaynak: proje sahibinin 15 Ekim 2026 tarihli talebi. Bu dosya yönetici (Claude) tarafından güncellenir.

## Hedef

Sitenin tasarımını yapay zekâ ile üretilmiş izlenimi veren kalıplardan çıkarmak ve her ayrıntısı düşünülmüş bir arayüze dönüştürmek. Harita, mesafe, yönlendirme ve zamanlama özelliklerini güçlendirmek. Türkçe ve İngilizce dil desteği eklemek. Temaları ve sayfa arka plan illüstrasyonlarını geliştirmek. Eksik kalan diğer noktaları tamamlamak. Mobil uygulamaya geçilmiyor, yalnızca web sürümü geliştiriliyor.

## İş akışları

| Kod | İş akışı | Kapsam |
|---|---|---|
| A | Tasarım dili | Örnek tasarım araştırması, tasarım ilkeleri belgesi, belirteçler, yazı tipi, bileşenlerin yenilenmesi, boş ve hata durumları |
| B | Harita | Harita stili, durak işaretleri ve kümeleri, rota önizlemesi, konum doğruluğu, harita üzerindeki kontrollerin sadeleştirilmesi |
| C | Mesafe, yönlendirme, zamanlama | Rota toplam süresi (yol ve durakta geçen süre), durak bazında ziyaret süresi, açılış saatleri ve "şu an açık" bilgisi, varış zamanı tahmini, gün planı |
| D | Dil desteği | Türkçe ve İngilizce altyapı, dil seçici, `/en` adresleri, arayüz çevirisi, içerik çevirisi |
| E | Tema ve illüstrasyon | Tema seçeneklerinin gözden geçirilmesi, sayfa arka plan illüstrasyonlarının yeniden çizilmesi |
| F | Diğer eksikler | Erişilebilirlik, performans, arama motoru uyumu, çevrimdışı kullanım, geri bildirim akışları |

## Sıra

1. **Envanter** (G-001): Sabit metinlerin ve sayfaların dökümü. Hem dil desteğinin hem tasarım yenilemesinin girdisidir.
2. **Dil altyapısı** (D): Metinler tasarım yenilenmeden önce çeviri dosyalarına taşınır. Böylece aynı bileşenler iki kez elden geçmez.
3. **Tasarım araştırması ve ilkeler** (A): Yönetici, örnek tasarımları inceleyip bir tasarım ilkeleri belgesi hazırlar. Proje sahibi onaylamadan bileşen yenilemesine geçilmez.
4. **Belirteçler ve bileşenler** (A, E): Onaylanan ilkelere göre sayfa sayfa yenileme.
5. **Harita, yönlendirme, zamanlama** (B, C)
6. **Cilalama ve eksikler** (F)

Her iş akışı küçük görevlere bölünür. Bir görev tek bir dalda ve tek bir pull request ile teslim edilebilecek büyüklükte olur.
