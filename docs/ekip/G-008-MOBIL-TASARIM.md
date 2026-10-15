# G-008: Mobil tasarım incelemesi ve ilk uygulama

15 Ekim 2026. Başlangıç: `b96257e` (`main`). Çalışma: `codex/G-008-mobil-tasarim`.

## İnceleme

Next.js 15, React 19, next-intl, Tailwind 4, Motion ve Lenis mevcut. Yeni bir arayüz ya da hareket paketi gerekmiyor. İçerik ile bileşenler ayrılmış. 14 rota, arama, kategori filtreleri, harita, QR, sesli rehber, rota oluşturma, sosyal alan ve profil korunmalı.

Canlı Türkçe ilk ziyaret dil seçimi ve ardından üç adımlı tanıtımla başlıyor. Keşfet ekranında arama, başlık, suluboya kale, hava durumu ve yatay rota şeridi bulunuyor. Hava durumu rotaların ilk ekranda görünmesini geciktiriyor. Desenli zemin, güçlü gölgeler, cam yüzeyler ve turuncu geçişler aynı anda dikkat çekiyor. Alt menüde altı hedef bulunuyor. Bunları kaldırmak işlev kaybı yaratacağından altı hedef korundu.

Rota listesinde arama, kategori ve il içi/çevre il grupları iyi bir temel. Kart başlıklarının serif karakteri dar alanda yoğun görünüyor. Ortak PageHeader diğer sayfalara görsel tutarlılık vermek için uygun. Harita ve rota kontrol panelleri özel dokunma etkileşimleri içeriyor. Bunlara genel bir motion sarmalayıcısı eklenmedi.

## Uygulama

- Mineral beyazı, sis, bazalt ve bakır belirteçleri. Desenli ana zemin kaldırıldı, kart ve düğme gölgeleri hafifletildi. Kale suluboyası ve mevcut görsel telifleri korundu.
- Keşfet sırası: arama, başlık ve kale, rotalar, duyuru/hava durumu, harita ve QR. Hiçbir içerik kaldırılmadı. Açılış sırası yeni yerleşime uyarlandı.
- Mobil kartlar daha geniş fotoğraf, Jakarta başlık ve yatay kaydırmada hizalama kullanıyor. Masaüstü dört sütun korunuyor. Rota listesinde mevcut filtreleme davranışı korunuyor, kategori hedefleri en az 44 px.
- Alt gezinme ekranın güvenli alt boşluğunu dikkate alıyor. Aktif sekme sakin bir yüzeyle vurgulanıyor. Altı bağlantı ve aria-current korunuyor.
- Dil seçimi, tanıtım ve ortak sayfa başlığı aynı görsel dile alındı. Tanıtımın Atla hedefi büyütüldü. Kısa ekranlarda kaydırma mümkün.
- Mevcut sıralı beliriş, scroll reveal, basılma ve paralaks korunuyor. Masaüstünde kart fotoğraflarına hafif yakınlaşma eklendi. Azaltılmış hareket tercihi gözetiliyor. Klavye odak halkası ortaklaştırıldı.

## Doğrulama ve sınırlar

- `npm run build`: başarılı, 236 statik sayfa üretildi. Ana sayfa First Load JS 218 kB. Yeni bağımlılık yok.
- `node tests/i18n.test.cjs`: 16/16 başarılı.
- `node tests/check-translations.cjs`: başarılı, kullanıcıya dönük yeni sabit metin yok.
- `git diff --check`: başarılı.
- Türkçe/İngilizce Keşfet ve rota listesi: 390 ve 1280 px ekran görüntüleri alındı. Ekran aracı depodaki `tests/motion-capture.cjs` temelinden geçici olarak uyarlandı, hava durumu sabitlendi. Görüntüler `ekran/G-008/` içinde. Önce görüntüleri canlı siteden, sonra görüntüleri yerel üretim sürümünden, farklı yakalama araçlarıyla alındı. Bunlar piksel eşitliği kanıtı değildir.
- Tarayıcıda İngilizce Keşfet araması “Frig” ile dört sonuç verdi. Rota listesinde Phrygian filtresi bir il içi ve iki çevre il rotası gösterdi. Alt menüyle sayfa geçişi çalıştı.
- Azaltılmış hareketle Türkçe ana sayfa ve rota listesi görüntüleri alındı. JavaScript kapalı ana sayfa başlığı görünür. JavaScript kapalı rota listesi mevcut loading sınırında iskelette kalıyor, ekran betiğinin son görünürlük kontrolü bu nedenle başarısız. Bu davranış G-007 notlarında da kayıtlı. Bu teslim tüm tarayıcı kontrollerinin geçtiği iddiasında değildir.
- Supabase ortam değişkenleri depoda yok. Yerel rota ayrıntısı ve profil gibi oturum kullanan sayfalarda hata oluşuyor. Bu ekranlar için gerçek hesap, sosyal gönderi, QR/kamera, canlı konum ve navigasyon uçtan uca doğrulanmadı. Ortam bilgileri uydurulmadı, oturum kodu değiştirilmedi.
- Lighthouse/CLS ölçümü yapılmadı. Hava durumu kartı ve iskeleti için yer ayrıldı, CLS garantisi verilmez.

## Sonraki tasarım dilimi

Proje sahibi görsel yönü değerlendirdikten sonra rota ayrıntısındaki kapak ve durak listesi, harita alt paneli, rota oluşturucu ve oturumlu profil/sosyal ekranlar aynı sistemle ayrıntılandırılmalı. Eksik fotoğraflar mevcut yer tutucularla bırakıldı. main birleştirmesi ve canlı yayın bu çalışmaya dahil değildir.
