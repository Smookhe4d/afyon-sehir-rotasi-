# G-005 doğrulama ve teslim

## Onaylanan kapsam

Proje sahibi, ilk plandaki G-005/G-006 ayrımını genişletti. Bu teslim arayüzün yanında 14 rotanın ve 86 durağın İngilizce anlatımlarını, İngilizce seslendirmeyi ve yeni dil seçimi düzenini içerir. Bu açık onay görev tanımının eski içerik ve görsel tasarım kapsam sınırından önce gelir. G-006'nın görev durumu yöneticiye bırakıldı.

Türkçe özgün rota ve durak içerikleri korundu. İngilizce karşılıklar messages/content/en.json içinde rota slug ve durak id değerleriyle tutulur. 743 benzersiz içerik değeri işlendi. Yer adları, kişi adları, kaynak adresleri, fotoğraf sahipleri ve lisansları korundu. Kullanıcı içerikleri ve duyurular yazıldıkları dilde kalır.

## Uygulama

- Arayüz, sayfa başlıkları, hukuki metinler, formlar, boş durumlar, erişilebilirlik etiketleri ve hata mesajları messages/tr.json ve en.json dosyalarına taşındı. Tekrarlanan metinler ui grubunda, değişkenli metinler dynamic grubunda, etiketler labels, rozetler badges, fotoğraf açıklamaları photos ve navigasyon navigation grubunda bulunur.
- lib/content.ts ve i18n/useContent.ts aynı dildeki veriyi sunucu sayfaları, istemci kartları, arama, filtreler ve harita için sağlar. Rota/durak ayrıntıları, meta veriler ve sesli rehber aynı çeviri kaynağını kullanır. Koordinatlar, kimlikler, kategori kodları, güzergâhlar ve kaynak URL'leri değişmedi.
- Sunucu eylemleri next-intl/server ile isteğin etkin dilinde mesaj döndürür. Mevcut Result yapısı, izinler ve veri tabanı işlemleri korunur. Dil yalnızca NEXT_LOCALE çerezinden okunmaz. İngilizce tercih çerezi varken Türkçe URL'den yapılan eylemin Türkçe hata döndüğü gerçek tarayıcı testinde doğrulandı.
- Yazılı navigasyon, yön bilgisi, kavşak ve dönüş metinleri çevrildi. Sesli rehber ve navigasyon en-US / tr-TR kullanır. Dil ile eşleşen ses seçilir, İngilizcede varsa en-US tercih edilir. Dil değişiminde eski ses kuyruğu iptal edilir. Yol ve yer adları özgün biçimleriyle okunur.
- Tarihler, sayılar, mesafe ve süreler etkin dile göre biçimlendirilir. İngilizce çoğullar ICU mesajlarıyla verilir. Türkçe özgün metinler ve mevcut noktalama korunur.
- Gizlilik ve kullanım şartlarının İngilizce sayfalarında istenen çeviri/bağlayıcılık notu bulunur.

## Dil seçimi

Üst menüdeki TR/EN düğmeleri ve öneri bandı kaldırıldı. Profilin en altında Dil / Language ayarı bulunur. İlk ziyarette iki dilli bir seçim penceresi açılır. Önce dil seçilir, ardından tanıtım gösterilir. Eski NEXT_LOCALE tercihleri korunur. Seçim hatırlanır, kullanıcı daha sonra profilden değiştirebilir.

Dil bağlantılarında lang ve hreflang bulunur. Türkçe hedef doğrudan öneksiz URL'dir. İlk seçim bulunduğu sayfayı ve sorgu parametrelerini temel alır. Mevcut localeDetection: false politikası korundu, açık Türkçe ve İngilizce URL'ler kendi dillerinde açılır.

## Doğrulama

- npm run build başarılı. Önce ve sonra 236 çıktı, prerender manifestinde 192 rota. Statik üretim kaybı yok.
- node --test tests/i18n.test.cjs: 16 test geçti. Mesaj anahtarları ve ICU argümanları eşit. Bütün statik tx/dx referansları mevcut. İngilizce içerik 14 rota ve 86 durağı kapsıyor, id/koordinat/kaynak ve dizi uzunlukları korunuyor. Sunucu ve yönetim eylemi hataları iki dilde kontrol edildi. Eski QR, önbellek yenileme, oturum çerezi, callback ve 404 altyapı testleri korundu.
- node tests/check-local.cjs http://localhost:3000: 30 sayfa, dil/meta verileri, sitemap ve 200/307/404 kontrolü geçti. Altı olmayan adres HEAD ve GET ile 404, iki yanlış dil adresi 307 dönüyor.
- node tests/browser-auth.cjs http://localhost:3000: gerçek Supabase misafir oturumu ile iki dilde giriş, yenileme, dil değişimi ve çıkış geçti. Geçersiz ad formu gönderilerek gerçek sunucu eyleminin iki dilde hata yanıtı doğrulandı. Geçersiz ad veri tabanına yazılmaz.
- node tests/browser-i18n.cjs http://localhost:3000: ilk seçim, tercih çerezi, profil altındaki ayar, lang/hreflang, doğrudan Türkçe bağlantı, İngilizce ekranlar ve ses istekleri geçti. Ses API'si, GPS ve OSRM yanıtı denetimli olarak taklit edildi. İngilizce anlatım ve navigasyon metninin en-US ses/voice seçimine, Türkçe anlatımın tr-TR seçimine gönderildiği doğrulandı. Fiziksel cihazda işitsel dinleme yapılmadı.
- node tests/check-translations.cjs: açıklamasız Türkçe arayüz dizgisi yok. Kalan her sonuç [dizgi tarama raporunda](G-005-dizgi-taramasi.md) gerekçesiyle listelendi.
- Paket eklenmedi, package.json ve lock dosyası değişmedi. .env.local okunmadı ve commit edilmedi. G-004'teki Supabase kurulum/oturum doğrulama işi değiştirilmedi.

Kayıtlı test hesabı ve yönetici hesabı bulunmadığı için gerçek kayıtlı kullanıcıyla yorum paylaşımı ve yetkili yönetici ekranının canlı veri işlemleri denenmedi. Bunların mesajları ve hata dalları otomatik test ve kod taramasıyla kontrol edildi. Önceki denetimde ertelenen kayıtlı yorum testi canlıda yapılacak.

## Sözlük dışındaki ortak karşılıklar

| Türkçe | İngilizce |
|---|---|
| Paylaşım | Post |
| Akış | Feed |
| Ziyaret edildi | Visited |
| Favori | Favorite |
| Geri bildirim | Feedback |
| Katkı | Contribution |
| Şikayet | Complaint |
| İnceleniyor | Under review |
| Konaklama | Accommodation / Overnight stay (bağlama göre) |
| Ören yeri | Archaeological site (özel yer adları korunur) |
| Külliye | Complex (açıklama metninde) |
| Yılkı atları | Free-roaming horses |

## Ekranlar

27 WebP, toplam 1.413.104 bayt. En büyük dosya 161.926 bayt. Genişlikler tam 390 ve 1280 px. Telefon ekranları 390 × 844 dokunmatik cihaz öykünmesiyle alındı.

| Sayfa | Önce 390 | Sonra 390 | Önce 1280 | Sonra 1280 |
|---|---|---|---|---|
| Ana sayfa | [Önce](ekran/G-005/once-ana-en-390.webp) | [Sonra](ekran/G-005/sonra-ana-en-390.webp) | [Önce](ekran/G-005/once-ana-en-1280.webp) | [Sonra](ekran/G-005/sonra-ana-en-1280.webp) |
| Rota | [Önce](ekran/G-005/once-rota-en-390.webp) | [Sonra](ekran/G-005/sonra-rota-en-390.webp) | [Önce](ekran/G-005/once-rota-en-1280.webp) | [Sonra](ekran/G-005/sonra-rota-en-1280.webp) |
| Durak | [Önce](ekran/G-005/once-durak-en-390.webp) | [Sonra](ekran/G-005/sonra-durak-en-390.webp) | [Önce](ekran/G-005/once-durak-en-1280.webp) | [Sonra](ekran/G-005/sonra-durak-en-1280.webp) |
| Harita | [Önce](ekran/G-005/once-harita-en-390.webp) | [Sonra](ekran/G-005/sonra-harita-en-390.webp) | [Önce](ekran/G-005/once-harita-en-1280.webp) | [Sonra](ekran/G-005/sonra-harita-en-1280.webp) |
| Profil | [Önce](ekran/G-005/once-profil-en-390.webp) | [Sonra](ekran/G-005/sonra-profil-en-390.webp) | [Önce](ekran/G-005/once-profil-en-1280.webp) | [Sonra](ekran/G-005/sonra-profil-en-1280.webp) |
| Giriş | [Önce](ekran/G-005/once-giris-en-390.webp) | [Sonra](ekran/G-005/sonra-giris-en-390.webp) | [Önce](ekran/G-005/once-giris-en-1280.webp) | [Sonra](ekran/G-005/sonra-giris-en-1280.webp) |

[İlk dil seçimi](ekran/G-005/sonra-ilk-dil-secimi-390.webp), [profil Dil ayarı, 390 px](ekran/G-005/sonra-profil-dil-en-390.webp), [profil Dil ayarı, 1280 px](ekran/G-005/sonra-profil-dil-en-1280.webp).
