# G-001: Metin ve sayfa envanteri

Tarih: 15 Ekim 2026. Kaynak: ekip/kurulum dalındaki 5501bb2 commit’i. Görev dalı: codex/G-001-metin-envanteri.

## Kapsam ve yöntem

Bu belge mevcut davranışı kaydeder. Kod veya içerik düzeltmesi yapılmadı. app/ ve components/ altındaki tüm TypeScript dosyaları sözdizim ağacıyla tarandı. JSX metinleri, sabit dizgiler, şablon dizgileri, erişilebilirlik etiketleri, sunucu eylemlerinin hata metinleri ve meta veriler incelendi. Aynı metnin farklı konumları ayrı satırlardır. Aynı dosya, satır, metin ve tür tekrarı tekilleştirilmiştir. Dinamik şablonlar kaynak gösterimiyle korunur. JSX içindeki ayrı metin parçaları ayrı satırlardır.

Metin sütunu kaynak alıntısıdır. Mevcut noktalı virgüller, yazım ve diğer işaretler değiştirilmedi. Bunlar yeni metin önerisi değildir. Kullanıcı içeriği, veri tabanından gelen duyurular ve dış hizmetlerin ürettiği metinler sabit metin sayılmadı. Dekoratif simgeler ve sayı birimleri, tamlık için açıklama türüyle yer alır.

## Sayfalar ve ekran görüntüleri

15 page.tsx dosyası ve 30 ekran görüntüsü vardır. Çekimler başarılı üretim build’iyle http://localhost:3000 üzerinde Codex tarayıcı otomasyonuyla yapıldı. Telefon viewport’u 390 × 844, masaüstü viewport’u 1280 × 900 CSS piksel olarak ayarlandı. Dosya adındaki sayı viewport genişliğidir. Tam sayfa yakalamada tarayıcının döndürdüğü raster ölçüsü kaydırma çubuğu ve tarayıcı yakalama davranışı nedeniyle farklı olabilir. Görüntüler ölçeklenmedi. İlk teslimdeki PNG dosyaları denetim sonrası kalite 80 WebP biçimine dönüştürüldü. Yeniden çekim, ölçekleme veya kırpma yapılmadı. Her dosya 400 KB altında, en büyük dosya 204.630 bayt ve toplam boyut 2.004.412 bayttır. Başka bir ekran yakalama yöntemi kullanılmadı. İlk açılış tanıtımı Atla düğmesiyle kapatıldı.

| Adres | Dosya yolu | İşlev | Çekim durumu | 390 px | 1280 px |
|---|---|---|---|---|---|
| / | app/page.tsx | Tur rotalarını, aramayı, duyuruları ve hava durumunu sunar. | Oturum kapalı | [Görsel](ekran/G-001/ana-sayfa-390.webp) | [Görsel](ekran/G-001/ana-sayfa-1280.webp) |
| /rotalar | app/rotalar/page.tsx | Hazır rotaları kategoriye göre listeler ve arar. | Oturum kapalı | [Görsel](ekran/G-001/rotalar-390.webp) | [Görsel](ekran/G-001/rotalar-1280.webp) |
| /rotalar/[slug] | app/rotalar/[slug]/page.tsx | Rota açıklamasını, haritayı, durakları ve başlatma kontrollerini sunar. | Örnek: /rotalar/frig-yolu-afyonkarahisar, oturum kapalı | [Görsel](ekran/G-001/rota-frig-yolu-390.webp) | [Görsel](ekran/G-001/rota-frig-yolu-1280.webp) |
| /duraklar/[id] | app/duraklar/[id]/page.tsx | Durak bilgisini, kaynaklarını, sesli rehberini ve konumunu sunar. | Örnek: /duraklar/ayazini, oturum kapalı | [Görsel](ekran/G-001/durak-ayazini-390.webp) | [Görsel](ekran/G-001/durak-ayazini-1280.webp) |
| /harita | app/harita/page.tsx | Durakları haritada gösterir ve sorgu parametreleriyle yönlendirme veya grup turu açar. | Tüm duraklar, konum izni verilmedi | [Görsel](ekran/G-001/harita-390.webp) | [Görsel](ekran/G-001/harita-1280.webp) |
| /rotani-belirle | app/rotani-belirle/page.tsx | Durak seçimi ve sıralamasıyla özel rota oluşturur ve kayıtlı rotaları listeler. | Oturum kapalı, seçim yapılmadı | [Görsel](ekran/G-001/rotani-belirle-390.webp) | [Görsel](ekran/G-001/rotani-belirle-1280.webp) |
| /sosyal | app/sosyal/page.tsx | Oturum durumuna göre giriş davetini veya paylaşım ve yorum akışını sunar. | Oturum kapalı, giriş daveti | [Görsel](ekran/G-001/sosyal-390.webp) | [Görsel](ekran/G-001/sosyal-1280.webp) |
| /profil | app/profil/page.tsx | Kullanıcının ilerlemesini, rozetlerini, favorilerini ve hesap işlemlerini sunar. | /giris > Misafir olarak devam et ile açılan misafir hesabı, görünen ad Gezgin | [Görsel](ekran/G-001/profil-390.webp) | [Görsel](ekran/G-001/profil-1280.webp) |
| /giris | app/giris/page.tsx | Giriş, kayıt, şifre sıfırlama ve misafir oturumu seçeneklerini sunar. | Oturum kapalı, Giriş yap sekmesi | [Görsel](ekran/G-001/giris-390.webp) | [Görsel](ekran/G-001/giris-1280.webp) |
| /qr | app/qr/page.tsx | Kamera veya elle girilen rota koduyla rota açar. | Kamera açılıyor… mesajı görüldü, kamera görüntüsü alınamadı, elle kod alanı boş | [Görsel](ekran/G-001/qr-390.webp) | [Görsel](ekran/G-001/qr-1280.webp) |
| /geri-bildirim | app/geri-bildirim/page.tsx | Öneri, katkı, şikayet ve hata iletmek için form sunar. | Boş form, Öneri seçili, gönderilmedi | [Görsel](ekran/G-001/geri-bildirim-390.webp) | [Görsel](ekran/G-001/geri-bildirim-1280.webp) |
| /hakkinda | app/hakkinda/page.tsx | Uygulamayı, kaynak yaklaşımını ve katkı yollarını açıklar. | Oturum kapalı | [Görsel](ekran/G-001/hakkinda-390.webp) | [Görsel](ekran/G-001/hakkinda-1280.webp) |
| /gizlilik | app/gizlilik/page.tsx | Veri işleme, ölçüm, konum ve kullanıcı hakları hakkında bilgi verir. | Oturum kapalı | [Görsel](ekran/G-001/gizlilik-390.webp) | [Görsel](ekran/G-001/gizlilik-1280.webp) |
| /sartlar | app/sartlar/page.tsx | Kullanım, güvenlik ve topluluk içeriği koşullarını sunar. | Oturum kapalı | [Görsel](ekran/G-001/sartlar-390.webp) | [Görsel](ekran/G-001/sartlar-1280.webp) |
| /yonetim | app/yonetim/page.tsx | Yetki kontrolünden sonra site istatistiklerini, geri bildirimleri ve duyuruları yönetir. | Yönetici yetkisi verilmeyen misafir oturumu. Gerçekte Kurulum gerekli ekranı görüldü, Yetkiniz yok ekranı doğrulanamadı | [Görsel](ekran/G-001/yonetim-390.webp) | [Görsel](ekran/G-001/yonetim-1280.webp) |

### Diğer App Router dosyaları

- app/not-found.tsx: geçersiz adreslerde görünen 404 arayüzü, ayrı page.tsx değildir.
- app/loading.tsx: sayfa geçişlerindeki yüklenme arayüzü.
- app/layout.tsx ve app/template.tsx: ortak sayfa iskeleti ve geçiş kapsayıcısı.
- app/auth/callback/route.ts ve app/auth/cikis/route.ts: oturum dönüşü ve çıkış uçları, görsel sayfa değildir.
- app/manifest.ts, app/robots.ts ve app/sitemap.ts: makine tarafından kullanılan uygulama, tarama ve adres verileri.

## Sabit metinler


### app/actions.ts

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/actions.ts | 18 | Rota bulunamadı. | hata |
| app/actions.ts | 20 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 26 | İşlem kaydedilemedi. | hata |
| app/actions.ts | 32 | Rota bulunamadı. | hata |
| app/actions.ts | 34 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 37 | Rota başlatılamadı. | hata |
| app/actions.ts | 44 | Durak bulunamadı. | hata |
| app/actions.ts | 46 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 49 | Önce rotayı başlatın. | hata |
| app/actions.ts | 57 | Durak güncellenemedi. | hata |
| app/actions.ts | 64 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 67 | Sıfırlanamadı. | hata |
| app/actions.ts | 74 | Rota bulunamadı. | hata |
| app/actions.ts | 75 | Yorum 1–500 karakter olmalı. | hata |
| app/actions.ts | 77 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 79 | Yorum yazmak için hesap oluşturmanız gerekir. | hata |
| app/actions.ts | 81 | Yorum gönderilemedi. | hata |
| app/actions.ts | 88 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 91 | Yorum silinemedi. | hata |
| app/actions.ts | 98 | Metin 1–1000 karakter olmalı. | hata |
| app/actions.ts | 99 | Rota bulunamadı. | hata |
| app/actions.ts | 101 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 103 | Paylaşım yapmak için hesap oluşturmanız gerekir. | hata |
| app/actions.ts | 104 | Geçersiz fotoğraf. | hata |
| app/actions.ts | 106 | Paylaşım gönderilemedi. | hata |
| app/actions.ts | 113 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 117 | Paylaşım silinemedi. | hata |
| app/actions.ts | 125 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 131 | Beğeni kaydedilemedi. | hata |
| app/actions.ts | 138 | Yorum 1–500 karakter olmalı. | hata |
| app/actions.ts | 140 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 142 | Yorum yazmak için hesap oluşturmanız gerekir. | hata |
| app/actions.ts | 144 | Yorum gönderilemedi. | hata |
| app/actions.ts | 151 | Rota adı 3–80 karakter olmalı. | hata |
| app/actions.ts | 153 | En az 2 durak seçin. | hata |
| app/actions.ts | 154 | En fazla 30 durak seçebilirsiniz. | hata |
| app/actions.ts | 155 | Geçersiz durak. | hata |
| app/actions.ts | 157 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 160 | Rota kaydedilemedi. | hata |
| app/actions.ts | 167 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 170 | Rota silinemedi. | hata |
| app/actions.ts | 177 | Ad 2–40 karakter olmalı. | hata |
| app/actions.ts | 179 | Bu işlem için giriş yapmalısınız. | hata |
| app/actions.ts | 182 | Ad güncellenemedi. | hata |
| app/actions.ts | 190 | Geçersiz tür. | hata |
| app/actions.ts | 192 | Mesaj 5 ile 2000 karakter arasında olmalı. | hata |
| app/actions.ts | 197 | Geri bildirim sistemi henüz etkinleştirilmedi. | hata |
| app/actions.ts | 197 | Gönderilemedi. Lütfen tekrar deneyin. | hata |

### app/duraklar/[id]/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/duraklar/[id]/page.tsx | 46 | Ziyaret ipuçları | başlık |
| app/duraklar/[id]/page.tsx | 51 | Haritada | başlık |
| app/duraklar/[id]/page.tsx | 58 | Bu durağın konumu henüz doğrulanmadı; doğrulandığında haritada görünecek. | açıklama |
| app/duraklar/[id]/page.tsx | 62 | Bu durağın yer aldığı rotalar | başlık |
| app/duraklar/[id]/page.tsx | 66 | Bilgi hatalı mı, eklemek istediğiniz var mı? | hata |
| app/duraklar/[id]/page.tsx | 66 | › | düğme |
| app/duraklar/[id]/page.tsx | 69 | Kaynaklar | başlık |

### app/geri-bildirim/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/geri-bildirim/page.tsx | 4 | Geri Bildirim | başlık |
| app/geri-bildirim/page.tsx | 10 | BİZE ULAŞIN | başlık |
| app/geri-bildirim/page.tsx | 10 | Geri Bildirim | başlık |
| app/geri-bildirim/page.tsx | 11 | Önerileriniz, yanlış gördüğünüz bilgiler, fotoğraf ve içerik katkılarınız ve şikayetleriniz için buradan yazabilirsiniz. Giriş yapmanız gerekmez. | açıklama |

### app/giris/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/giris/page.tsx | 6 | Giriş | başlık |
| app/giris/page.tsx | 16 | AFYONKARAHİSAR | açıklama |
| app/giris/page.tsx | 17 | Afyon Şehir Rotası | başlık |
| app/giris/page.tsx | 18 | Kale, çarşı ve Frig vadilerinde rehberli rotalar; QR ile başlayan anlatım. | açıklama |
| app/giris/page.tsx | 26 | Kurulum tamamlanmadı | açıklama |
| app/giris/page.tsx | 27 | Uygulama henüz bir Supabase projesine bağlanmadı. | açıklama |
| app/giris/page.tsx | 27 | NEXT_PUBLIC_SUPABASE_URL | açıklama |
| app/giris/page.tsx | 27 | ve | açıklama |
| app/giris/page.tsx | 27 | NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | açıklama |
| app/giris/page.tsx | 27 | ortam değişkenlerini ekleyin. | açıklama |
| app/giris/page.tsx | 31 | Giriş yapmadan göz at | düğme |
| app/giris/page.tsx | 32 | Gizlilik | düğme |
| app/giris/page.tsx | 32 | · | açıklama |
| app/giris/page.tsx | 32 | Kullanım Şartları | düğme |

### app/gizlilik/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/gizlilik/page.tsx | 2 | Gizlilik | başlık |
| app/gizlilik/page.tsx | 5 | YASAL | başlık |
| app/gizlilik/page.tsx | 5 | Gizlilik | başlık |
| app/gizlilik/page.tsx | 6 | Hangi verileri topluyoruz? | açıklama |
| app/gizlilik/page.tsx | 6 | Hesap oluşturduğunuzda e-posta adresiniz ve görünen adınız; kullanım sırasında favori rotalarınız, ziyaret ettiğiniz duraklar, yorumlarınız ve paylaştığınız fotoğraflar saklanır. Misafir olarak gezenlerden kişisel veri istenmez. | açıklama |
| app/gizlilik/page.tsx | 7 | Ziyaret ölçümü | açıklama |
| app/gizlilik/page.tsx | 7 | Sayfa görüntülemeleri çerezsiz ve anonim olarak sayılır (yalnızca sayfa yolu ve oturuma özel rastgele bir kimlik); Vercel Analytics ve Speed Insights de kimlik belirtmeyen toplu ölçüm yapar. Tarayıcınızda “Do Not Track” açıksa ölçüm yapılmaz. | açıklama |
| app/gizlilik/page.tsx | 8 | Geri bildirim ve grup turu | açıklama |
| app/gizlilik/page.tsx | 8 | Geri bildirim formuna yazdıklarınız ve isteğe bağlı iletişim bilginiz yalnızca site yöneticisi tarafından görülür. Grup turunda adınız ve canlı konumunuz yalnızca aynı koddaki grup üyelerine anlık iletilir; kaydedilmez. | açıklama |
| app/gizlilik/page.tsx | 9 | Konum bilgisi | açıklama |
| app/gizlilik/page.tsx | 9 | Haritadaki canlı konum yalnızca sizin izninizle ve cihazınızda kullanılır; sunucularımıza kaydedilmez. | açıklama |
| app/gizlilik/page.tsx | 10 | Verilerin kullanımı | açıklama |
| app/gizlilik/page.tsx | 10 | Veriler yalnızca uygulamanın çalışması için kullanılır; üçüncü kişilere satılmaz veya reklam amacıyla paylaşılmaz. Altyapı sağlayıcıları: Supabase (veri tabanı ve oturum), Vercel (barındırma). | açıklama |
| app/gizlilik/page.tsx | 11 | Haklarınız | açıklama |
| app/gizlilik/page.tsx | 11 | Hesabınızın ve verilerinizin silinmesini veya düzeltilmesini talep edebilirsiniz. Talepler için uygulama sahibine e-posta ile ulaşabilirsiniz. | açıklama |

### app/hakkinda/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/hakkinda/page.tsx | 3 | Hakkında | başlık |
| app/hakkinda/page.tsx | 7 | BİLGİLENDİRME | başlık |
| app/hakkinda/page.tsx | 7 | Hakkında | başlık |
| app/hakkinda/page.tsx | 8 | Afyon Şehir Rotası nedir? | açıklama |
| app/hakkinda/page.tsx | 8 | Afyonkarahisar'ı gezenler için hazırlanmış, ücretsiz bir dijital rehberdir: kaynaklı durak anlatımları, hazır rotalar, canlı yönlendirmeli harita, sesli rehber ve grup turu. | açıklama |
| app/hakkinda/page.tsx | 9 | Bilgiler nereden geliyor? | açıklama |
| app/hakkinda/page.tsx | 9 | Durak metinleri ve rotalar resmî kurum yayınları ve akademik kaynaklardan derlenir; her durak sayfasında kaynaklar listelenir. Fotoğraflar Wikimedia Commons'tan, sahiplerinin belirttiği lisansla gösterilir. | açıklama |
| app/hakkinda/page.tsx | 10 | Nasıl katkı sunabilirim? | açıklama |
| app/hakkinda/page.tsx | 10 | Yanlış veya eksik bir bilgi, yeni bir durak ya da rota önerisi, fotoğraf katkısı veya şikayetiniz için Geri Bildirim sayfasını kullanın. Her mesaj okunur. | açıklama |
| app/hakkinda/page.tsx | 11 | Grup turu | açıklama |
| app/hakkinda/page.tsx | 11 | Rota sayfasından “Grupla başla”ya basarak bir kod oluşturun, arkadaşlarınıza gönderin. Herkes haritada birbirini canlı görür; rehber durakları ilerlettiğinde grup birlikte ilerler. | açıklama |
| app/hakkinda/page.tsx | 13 | Geri bildirim gönder | düğme |

### app/harita/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/harita/page.tsx | 5 | Harita | başlık |
| app/harita/page.tsx | 17 | Rotam | başlık |
| app/harita/page.tsx | 17 | Tüm duraklar | başlık |
| app/harita/page.tsx | 18 | Rota seçimi | erişilebilirlik etiketi |
| app/harita/page.tsx | 19 | Tümü | düğme |

### app/layout.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/layout.tsx | 16 | Afyon Şehir Rotası | başlık |
| app/layout.tsx | 17 | Afyonkarahisar için resmî rehber rotaları, QR ile başlayan sesli anlatım ve canlı harita. | açıklama |
| app/layout.tsx | 20 | Afyon Şehir Rotası | başlık |
| app/layout.tsx | 20 | Afyonkarahisar için rehber rotaları, sesli anlatım ve canlı yönlendirmeli harita. | açıklama |

### app/loading.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/loading.tsx | 3 | Yükleniyor | erişilebilirlik etiketi |

### app/manifest.ts

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/manifest.ts | 3 | Afyon Şehir Rotası | açıklama |
| app/manifest.ts | 3 | Şehir Rotası | açıklama |
| app/manifest.ts | 3 | Afyonkarahisar için rehberli rotalar, sesli anlatım ve canlı harita. | açıklama |

### app/not-found.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/not-found.tsx | 3 | Sayfa bulunamadı | hata |
| app/not-found.tsx | 10 | 404 | açıklama |
| app/not-found.tsx | 11 | Bu yol bir yere çıkmıyor | başlık |
| app/not-found.tsx | 12 | Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. | açıklama |
| app/not-found.tsx | 14 | Keşfet'e dön | düğme |
| app/not-found.tsx | 15 | Rotalar | düğme |

### app/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/page.tsx | 12 | Rota | açıklama |
| app/page.tsx | 13 | `Durak · ${p.area}` | açıklama |
| app/page.tsx | 23 | AFYONKARAHİSAR | açıklama |
| app/page.tsx | 24 | Keşfet | başlık |
| app/page.tsx | 25 | Frig vadilerinden Ulu Cami'ye, Afyonkarahisar'ın | açıklama |
| app/page.tsx | 25 | önerilen tur rotası. | açıklama |
| app/page.tsx | 26 | Rotaları keşfet | düğme |
| app/page.tsx | 26 | Haritayı aç | düğme |
| app/page.tsx | 29 | Afyonkarahisar Kalesi ve eski şehir, suluboya | erişilebilirlik etiketi |
| app/page.tsx | 32 | Afyonkarahisar rotaları | başlık |
| app/page.tsx | 44 | Haritada keşfet | düğme |
| app/page.tsx | 44 | Duraklar ve canlı konumunuz | düğme |
| app/page.tsx | 44 | › | düğme |
| app/page.tsx | 45 | QR ile rota başlat | düğme |

### app/profil/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/profil/page.tsx | 10 | Profil | başlık |
| app/profil/page.tsx | 15 | HESABIM | başlık |
| app/profil/page.tsx | 15 | Profil | başlık |
| app/profil/page.tsx | 15 | İlerlemenizi kaydedin | başlık |
| app/profil/page.tsx | 15 | Giriş yaparak favori rotalarınızı, ziyaret ettiğiniz durakları ve rozetlerinizi saklayın. | açıklama |
| app/profil/page.tsx | 29 | Gezgin | açıklama |
| app/profil/page.tsx | 37 | Misafir hesabı | açıklama |
| app/profil/page.tsx | 38 | Misafir olarak rota gezebilir, favori ekleyebilirsiniz. Paylaşım ve yorum için hesap oluşturun. | açıklama |
| app/profil/page.tsx | 38 | Kayıt ol | düğme |
| app/profil/page.tsx | 41 | Tamamlanan | açıklama |
| app/profil/page.tsx | 41 | Ziyaret edilen durak | açıklama |
| app/profil/page.tsx | 41 | Rozet | açıklama |
| app/profil/page.tsx | 48 | QR ile rota başlat | düğme |
| app/profil/page.tsx | 48 | Durakta kodu okut, rota açılsın | düğme |
| app/profil/page.tsx | 51 | Rozetler | başlık |
| app/profil/page.tsx | 57 | Kazanıldı | açıklama |
| app/profil/page.tsx | 61 | Devam eden rotalar | başlık |
| app/profil/page.tsx | 64 | DEVAM EDEN | düğme |
| app/profil/page.tsx | 64 | / | düğme |
| app/profil/page.tsx | 64 | durak | düğme |
| app/profil/page.tsx | 68 | Favori rotalar | başlık |
| app/profil/page.tsx | 69 | Henüz favori rota yok. | boş durum |
| app/profil/page.tsx | 73 | Diğer | erişilebilirlik etiketi |
| app/profil/page.tsx | 74 | Öneri, katkı ve şikayet | açıklama |
| app/profil/page.tsx | 74 | Hakkında | açıklama |
| app/profil/page.tsx | 74 | Gizlilik | açıklama |
| app/profil/page.tsx | 74 | Kullanım Şartları | açıklama |
| app/profil/page.tsx | 74 | Yönetim paneli | açıklama |
| app/profil/page.tsx | 75 | › | düğme |
| app/profil/page.tsx | 78 | Çıkış yap | düğme |

### app/qr/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/qr/page.tsx | 3 | QR ile Başlat | başlık |
| app/qr/page.tsx | 8 | Kapat | erişilebilirlik etiketi |
| app/qr/page.tsx | 8 | × | düğme |
| app/qr/page.tsx | 9 | Rota QR kodunu okutun | başlık |
| app/qr/page.tsx | 10 | Kodu çerçevenin içine hizalayın | açıklama |

### app/rotalar/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/rotalar/page.tsx | 4 | Rotalar | başlık |
| app/rotalar/page.tsx | 9 | AFYONKARAHİSAR | başlık |
| app/rotalar/page.tsx | 9 | Rotalar | başlık |

### app/rotalar/[slug]/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/rotalar/[slug]/page.tsx | 39 | Gezgin | açıklama |
| app/rotalar/[slug]/page.tsx | 43 | Kültür turizmi | açıklama |
| app/rotalar/[slug]/page.tsx | 56 | Geri | erişilebilirlik etiketi |
| app/rotalar/[slug]/page.tsx | 56 | ‹ | düğme |
| app/rotalar/[slug]/page.tsx | 70 | Uzunluk | açıklama |
| app/rotalar/[slug]/page.tsx | 70 | km | açıklama |
| app/rotalar/[slug]/page.tsx | 71 | Yapılabilirlik | açıklama |
| app/rotalar/[slug]/page.tsx | 72 | Zorluk | açıklama |
| app/rotalar/[slug]/page.tsx | 73 | Güvenlik: Hava ve patika durumunu kontrol edin, yeterli su ve uygun ayakkabı alın, mümkünse yalnız çıkmayın. Acil durumda 112. | açıklama |
| app/rotalar/[slug]/page.tsx | 77 | Harita | erişilebilirlik etiketi |
| app/rotalar/[slug]/page.tsx | 79 | Haritada | başlık |
| app/rotalar/[slug]/page.tsx | 80 | Tam ekran harita › | düğme |
| app/rotalar/[slug]/page.tsx | 85 | Telefona gönder | açıklama |
| app/rotalar/[slug]/page.tsx | 85 | Telefon kamerasıyla okutun; rota telefonunuzda açılır ve oradan canlı yönlendirmeyle başlarsınız. | açıklama |
| app/rotalar/[slug]/page.tsx | 86 | Haritada gösterilemeyen duraklar (konum doğrulanıyor): | açıklama |
| app/rotalar/[slug]/page.tsx | 86 | . | açıklama |
| app/rotalar/[slug]/page.tsx | 92 | İpuçları | başlık |
| app/rotalar/[slug]/page.tsx | 94 | Kaynak: | açıklama |

### app/rotani-belirle/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/rotani-belirle/page.tsx | 4 | Rotanı Belirle | başlık |
| app/rotani-belirle/page.tsx | 11 | YENİ ROTA | başlık |
| app/rotani-belirle/page.tsx | 11 | Rotanı Belirle | başlık |

### app/sartlar/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/sartlar/page.tsx | 2 | Kullanım Şartları | başlık |
| app/sartlar/page.tsx | 5 | YASAL | başlık |
| app/sartlar/page.tsx | 5 | Kullanım Şartları | başlık |
| app/sartlar/page.tsx | 6 | Genel bilgi | açıklama |
| app/sartlar/page.tsx | 6 | Afyon Şehir Rotası, Afyonkarahisar'ı gezenler için hazırlanmış bir rehberdir. Açılış saatleri, ücretler ve erişim koşulları değişebilir; ziyaretten önce ilgili kurumdan doğrulayınız. | açıklama |
| app/sartlar/page.tsx | 7 | Güvenlik | açıklama |
| app/sartlar/page.tsx | 7 | Doğa ve yürüyüş rotalarında hava durumunu, yol ve patika durumunu kontrol edin; zor rotalarda yalnız çıkmayın. Rota bilgileri yönlendirme amaçlıdır; kendi güvenliğinizden siz sorumlusunuz. Acil durumda 112'yi arayın. | açıklama |
| app/sartlar/page.tsx | 8 | Topluluk içeriği | açıklama |
| app/sartlar/page.tsx | 8 | Paylaştığınız yorum ve fotoğraflardan siz sorumlusunuz. Hakaret, nefret söylemi, başkalarının haklarını ihlal eden veya yasa dışı içerik kaldırılabilir. | açıklama |
| app/sartlar/page.tsx | 9 | Fotoğraflar ve kaynaklar | açıklama |
| app/sartlar/page.tsx | 9 | Duraklardaki fotoğraflar Wikimedia Commons üzerinden, sahiplerinin belirttiği Creative Commons veya kamu malı lisanslarıyla gösterilir; her fotoğrafın altında sahibi ve lisansı belirtilir. | açıklama |

### app/sosyal/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/sosyal/page.tsx | 8 | Sosyal | başlık |
| app/sosyal/page.tsx | 12 | Gezgin | açıklama |
| app/sosyal/page.tsx | 16 | TOPLULUK | başlık |
| app/sosyal/page.tsx | 16 | Sosyal | başlık |
| app/sosyal/page.tsx | 16 | Topluluğa katılın | başlık |
| app/sosyal/page.tsx | 16 | Gezginlerin fotoğraflarını ve rota yorumlarını görmek, kendi paylaşımınızı yapmak için giriş yapın. | açıklama |
| app/sosyal/page.tsx | 34 | TOPLULUK | başlık |
| app/sosyal/page.tsx | 34 | Sosyal | başlık |
| app/sosyal/page.tsx | 37 | Akış yüklenemedi. Lütfen sayfayı yenileyin. | hata |
| app/sosyal/page.tsx | 38 | Henüz paylaşım yok. İlk paylaşımı siz yapın. | boş durum |

### app/yonetim/actions.ts

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/yonetim/actions.ts | 17 | Yetkisiz. | hata |
| app/yonetim/actions.ts | 18 | Geçersiz durum. | hata |
| app/yonetim/actions.ts | 20 | Kaydedilemedi. | hata |
| app/yonetim/actions.ts | 24 | Yetkisiz. | hata |
| app/yonetim/actions.ts | 26 | Silinemedi. | hata |
| app/yonetim/actions.ts | 30 | Yetkisiz. | hata |
| app/yonetim/actions.ts | 32 | Başlık 3-100, metin 3-600 karakter olmalı. | hata |
| app/yonetim/actions.ts | 34 | Eklenemedi. | hata |
| app/yonetim/actions.ts | 38 | Yetkisiz. | hata |
| app/yonetim/actions.ts | 40 | Güncellenemedi. | hata |
| app/yonetim/actions.ts | 44 | Yetkisiz. | hata |
| app/yonetim/actions.ts | 46 | Silinemedi. | hata |

### app/yonetim/page.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| app/yonetim/page.tsx | 8 | Yönetim | başlık |
| app/yonetim/page.tsx | 19 | SİTE YÖNETİMİ | başlık |
| app/yonetim/page.tsx | 19 | Yönetim | başlık |
| app/yonetim/page.tsx | 20 | Yönetici girişi | başlık |
| app/yonetim/page.tsx | 20 | Bu sayfa yalnızca site yöneticileri içindir. | açıklama |
| app/yonetim/page.tsx | 22 | Kurulum gerekli | başlık |
| app/yonetim/page.tsx | 22 | Yönetim tabloları henüz oluşturulmamış. Supabase SQL Editor'de supabase/migrations/002_yonetim.sql dosyasını çalıştırın. | açıklama |
| app/yonetim/page.tsx | 23 | Yetkiniz yok | başlık |
| app/yonetim/page.tsx | 23 | Hesabınız yönetici olarak tanımlı değil. | açıklama |
| app/yonetim/page.tsx | 41 | Özet | başlık |
| app/yonetim/page.tsx | 43 | Bugün görüntüleme | açıklama |
| app/yonetim/page.tsx | 43 | Bugün ziyaretçi | açıklama |
| app/yonetim/page.tsx | 44 | 7 gün görüntüleme | açıklama |
| app/yonetim/page.tsx | 44 | 7 gün ziyaretçi | açıklama |
| app/yonetim/page.tsx | 45 | Kayıtlı kullanıcı | açıklama |
| app/yonetim/page.tsx | 45 | Misafir hesap | açıklama |
| app/yonetim/page.tsx | 46 | Başlatılan rota | açıklama |
| app/yonetim/page.tsx | 46 | Tamamlanan rota | açıklama |
| app/yonetim/page.tsx | 47 | Paylaşım / yorum | açıklama |
| app/yonetim/page.tsx | 47 | Favori | açıklama |
| app/yonetim/page.tsx | 51 | Son 14 gün · sayfa görüntüleme | açıklama |
| app/yonetim/page.tsx | 52 | Günlük görüntüleme grafiği | erişilebilirlik etiketi |
| app/yonetim/page.tsx | 53 | `${d.d}: ${d.views} görüntüleme, ${d.visitors} ziyaretçi` | başlık |
| app/yonetim/page.tsx | 60 | En çok açılan sayfalar (7 gün) | açıklama |
| app/yonetim/page.tsx | 64 | Özet alınamadı: SQL dosyasının tamamını çalıştırdığınızdan emin olun. | hata |
| app/yonetim/page.tsx | 66 | Geri bildirimler | başlık |
| app/yonetim/page.tsx | 66 | · | başlık |
| app/yonetim/page.tsx | 66 | yeni | başlık |
| app/yonetim/page.tsx | 69 | Duyurular | başlık |
| app/yonetim/page.tsx | 72 | Siteye dön | düğme |

### components/admin/AdminClient.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/admin/AdminClient.tsx | 7 | Öneri | açıklama |
| components/admin/AdminClient.tsx | 7 | Şikayet | açıklama |
| components/admin/AdminClient.tsx | 7 | Katkı | açıklama |
| components/admin/AdminClient.tsx | 7 | Hata | açıklama |
| components/admin/AdminClient.tsx | 8 | Yeni | açıklama |
| components/admin/AdminClient.tsx | 8 | İnceleniyor | açıklama |
| components/admin/AdminClient.tsx | 8 | Çözüldü | açıklama |
| components/admin/AdminClient.tsx | 8 | Reddedildi | açıklama |
| components/admin/AdminClient.tsx | 19 | Tümü | açıklama |
| components/admin/AdminClient.tsx | 24 | Kayıt yok. | boş durum |
| components/admin/AdminClient.tsx | 33 | İletişim: | açıklama |
| components/admin/AdminClient.tsx | 34 | Yönetici notu | açıklama |
| components/admin/AdminClient.tsx | 40 | Bu kayıt silinsin mi? | düğme |
| components/admin/AdminClient.tsx | 40 | Sil | düğme |
| components/admin/AdminClient.tsx | 56 | Başlık | açıklama |
| components/admin/AdminClient.tsx | 57 | Duyuru metni (Keşfet sayfasında görünür) | açıklama |
| components/admin/AdminClient.tsx | 59 | Yayınla | düğme |
| components/admin/AdminClient.tsx | 64 | (gizli) | açıklama |
| components/admin/AdminClient.tsx | 67 | Gizle | düğme |
| components/admin/AdminClient.tsx | 67 | Yayınla | düğme |
| components/admin/AdminClient.tsx | 68 | Duyuru silinsin mi? | düğme |
| components/admin/AdminClient.tsx | 68 | Sil | düğme |

### components/AudioGuide.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/AudioGuide.tsx | 68 | Duraklat | erişilebilirlik etiketi |
| components/AudioGuide.tsx | 68 | Sesli rehberi dinle | erişilebilirlik etiketi |
| components/AudioGuide.tsx | 72 | Sesli rehber | açıklama |
| components/AudioGuide.tsx | 72 | Dinleniyor… | açıklama |
| components/AudioGuide.tsx | 72 | Duraklatıldı | açıklama |
| components/AudioGuide.tsx | 72 | Anlatımı sesli dinleyin | açıklama |
| components/AudioGuide.tsx | 73 | Durdur | düğme |
| components/AudioGuide.tsx | 76 | Ses | açıklama |
| components/AudioGuide.tsx | 82 | Ses, cihazınızın yerleşik Türkçe sesidir. Daha doğal bir ses için cihaz ayarlarından gelişmiş (Enhanced/Natural) Türkçe sesi indirebilirsiniz. | açıklama |

### components/auth/AuthForm.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/auth/AuthForm.tsx | 10 | E-posta veya şifre hatalı. | hata |
| components/auth/AuthForm.tsx | 11 | Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin. | açıklama |
| components/auth/AuthForm.tsx | 12 | Şifre en az 8 karakter olmalı. | hata |
| components/auth/AuthForm.tsx | 13 | Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin. | açıklama |
| components/auth/AuthForm.tsx | 14 | E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzdaki bağlantıya tıklayın. | açıklama |
| components/auth/AuthForm.tsx | 15 | Misafir girişi şu an kapalı. | hata |
| components/auth/AuthForm.tsx | 16 | Bir sorun oluştu. Lütfen tekrar deneyin. | açıklama |
| components/auth/AuthForm.tsx | 32 | Oturum açılamadı. Lütfen tekrar deneyin. | hata |
| components/auth/AuthForm.tsx | 56 | Doğrulama bağlantısı e-posta adresinize gönderildi. Bağlantıya tıkladıktan sonra giriş yapabilirsiniz. | açıklama |
| components/auth/AuthForm.tsx | 60 | Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. | açıklama |
| components/auth/AuthForm.tsx | 72 | Google ile giriş şu an kullanılamıyor. | hata |
| components/auth/AuthForm.tsx | 86 | Giriş türü | erişilebilirlik etiketi |
| components/auth/AuthForm.tsx | 89 | Giriş yap | düğme |
| components/auth/AuthForm.tsx | 89 | Kayıt ol | düğme |
| components/auth/AuthForm.tsx | 94 | Ad Soyad | açıklama |
| components/auth/AuthForm.tsx | 94 | Ad Soyad | erişilebilirlik etiketi |
| components/auth/AuthForm.tsx | 95 | E-posta | açıklama |
| components/auth/AuthForm.tsx | 95 | E-posta | erişilebilirlik etiketi |
| components/auth/AuthForm.tsx | 96 | Şifre (en az 8 karakter) | hata |
| components/auth/AuthForm.tsx | 96 | Şifre | erişilebilirlik etiketi |
| components/auth/AuthForm.tsx | 99 | Lütfen bekleyin… | düğme |
| components/auth/AuthForm.tsx | 99 | Giriş yap | düğme |
| components/auth/AuthForm.tsx | 99 | Hesap oluştur | düğme |
| components/auth/AuthForm.tsx | 99 | Sıfırlama bağlantısı gönder | düğme |
| components/auth/AuthForm.tsx | 102 | Şifremi unuttum | düğme |
| components/auth/AuthForm.tsx | 103 | Girişe dön | düğme |
| components/auth/AuthForm.tsx | 106 | veya | açıklama |
| components/auth/AuthForm.tsx | 110 | Google ile devam et | düğme |
| components/auth/AuthForm.tsx | 113 | Misafir olarak devam et | düğme |

### components/BackButton.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/BackButton.tsx | 6 | Geri | erişilebilirlik etiketi |
| components/BackButton.tsx | 6 | ‹ | düğme |

### components/builder/Builder.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/builder/Builder.tsx | 28 | Rota kaydedildi. | açıklama |
| components/builder/Builder.tsx | 34 | Rota adı | açıklama |
| components/builder/Builder.tsx | 35 | Örn. Hafta sonu şehir yürüyüşü | açıklama |
| components/builder/Builder.tsx | 37 | Durak ekle | açıklama |
| components/builder/Builder.tsx | 38 | Durak veya mekân ara | açıklama |
| components/builder/Builder.tsx | 42 | + | düğme |
| components/builder/Builder.tsx | 44 | Eşleşen durak yok. | boş durum |
| components/builder/Builder.tsx | 47 | Seçilen duraklar | başlık |
| components/builder/Builder.tsx | 47 | · | başlık |
| components/builder/Builder.tsx | 48 | En az 2 durak seçin. | hata |
| components/builder/Builder.tsx | 54 | Yukarı taşı | erişilebilirlik etiketi |
| components/builder/Builder.tsx | 54 | ↑ | düğme |
| components/builder/Builder.tsx | 55 | Aşağı taşı | erişilebilirlik etiketi |
| components/builder/Builder.tsx | 55 | ↓ | düğme |
| components/builder/Builder.tsx | 56 | Kaldır | erişilebilirlik etiketi |
| components/builder/Builder.tsx | 56 | × | düğme |
| components/builder/Builder.tsx | 62 | Diğer kullanıcılar görebilsin | açıklama |
| components/builder/Builder.tsx | 65 | Başla | düğme |
| components/builder/Builder.tsx | 66 | Rotayı Kaydet | düğme |
| components/builder/Builder.tsx | 67 | Başla, rotayı haritada açar. Kaydetmek için giriş gerekir. | açıklama |
| components/builder/Builder.tsx | 69 | Kayıtlı rotalarım | başlık |
| components/builder/Builder.tsx | 71 | Henüz kayıtlı rota yok. | boş durum |
| components/builder/Builder.tsx | 74 | Herkese açık | açıklama |
| components/builder/Builder.tsx | 74 | Özel | açıklama |
| components/builder/Builder.tsx | 76 | Başla | düğme |
| components/builder/Builder.tsx | 77 | Sil | düğme |

### components/FeedbackForm.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/FeedbackForm.tsx | 7 | Öneri | açıklama |
| components/FeedbackForm.tsx | 7 | Yeni rota, özellik, fikir | açıklama |
| components/FeedbackForm.tsx | 8 | Katkı | açıklama |
| components/FeedbackForm.tsx | 8 | Bilgi, fotoğraf, düzeltme | açıklama |
| components/FeedbackForm.tsx | 9 | Şikayet | açıklama |
| components/FeedbackForm.tsx | 9 | Memnuniyetsizlik, uygunsuz içerik | açıklama |
| components/FeedbackForm.tsx | 10 | Hata | açıklama |
| components/FeedbackForm.tsx | 10 | Çalışmayan veya yanlış olan | açıklama |
| components/FeedbackForm.tsx | 25 | Teşekkürler! | açıklama |
| components/FeedbackForm.tsx | 26 | Mesajınız bize ulaştı. Katkılarınız Afyonkarahisar rehberini daha iyi yapıyor. | açıklama |
| components/FeedbackForm.tsx | 31 | Tür | erişilebilirlik etiketi |
| components/FeedbackForm.tsx | 39 | İlgili durak (isteğe bağlı) | açıklama |
| components/FeedbackForm.tsx | 41 | Genel | açıklama |
| components/FeedbackForm.tsx | 45 | Mesajınız | açıklama |
| components/FeedbackForm.tsx | 46 | Ne düşünüyorsunuz? | açıklama |
| components/FeedbackForm.tsx | 47 | /2000 | açıklama |
| components/FeedbackForm.tsx | 49 | E-posta veya telefon (isteğe bağlı, yanıt için) | açıklama |
| components/FeedbackForm.tsx | 54 | Gönderiliyor… | düğme |
| components/FeedbackForm.tsx | 54 | Gönder | düğme |
| components/FeedbackForm.tsx | 55 | Mesajlarınız yalnızca site yöneticisi tarafından görülür. | açıklama |
| components/FeedbackForm.tsx | 55 | Gizlilik | düğme |

### components/GlassTab.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/GlassTab.tsx | 11 | Ana gezinme | erişilebilirlik etiketi |

### components/LegalPage.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/LegalPage.tsx | 9 | Son güncelleme: Ekim 2026 | açıklama |

### components/map/LazyMap.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/map/LazyMap.tsx | 6 | Harita yükleniyor | erişilebilirlik etiketi |

### components/map/MapView.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/map/MapView.tsx | 6 | Harita yükleniyor… | açıklama |

### components/map/RouteMap.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/map/RouteMap.tsx | 271 | `${Math.round(step.dist / 10) * 10} metre sonra, ${step.text}` | açıklama |
| components/map/RouteMap.tsx | 281 | Rota haritası | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 286 | Geri | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 286 | ‹ | düğme |
| components/map/RouteMap.tsx | 290 | Tam ekran | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 293 | Tüm durakları göster | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 296 | Canlı konumu kapat | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 296 | Konumumu göster | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 306 | Gruba katılın | açıklama |
| components/map/RouteMap.tsx | 307 | Kod: | açıklama |
| components/map/RouteMap.tsx | 307 | . Grup arkadaşlarınız adınızı ve konumunuzu haritada görecek. | açıklama |
| components/map/RouteMap.tsx | 308 | Adınız | açıklama |
| components/map/RouteMap.tsx | 309 | Katıl | düğme |
| components/map/RouteMap.tsx | 321 | `${Math.round(step.dist / 10) * 10} m` | açıklama |
| components/map/RouteMap.tsx | 322 | `${target.name} ${bearingText(me.pos, target.coords)} yönünde, ${formatDistance(straightD)}${navFail ? "" : " · yol hesaplanıyor"}` | açıklama |
| components/map/RouteMap.tsx | 322 | · yol hesaplanıyor | açıklama |
| components/map/RouteMap.tsx | 322 | Yol hesaplanıyor… | açıklama |
| components/map/RouteMap.tsx | 322 | Konumunuz bekleniyor… | açıklama |
| components/map/RouteMap.tsx | 324 | Sesli yönlendirme | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 337 | Grup kodu | açıklama |
| components/map/RouteMap.tsx | 338 | Afyon turuna katıl | düğme |
| components/map/RouteMap.tsx | 338 | `Afyon Şehir Rotası grup turuna katıl (kod ${grup})` | düğme |
| components/map/RouteMap.tsx | 338 | Kopyalandı | düğme |
| components/map/RouteMap.tsx | 338 | Davet et | düğme |
| components/map/RouteMap.tsx | 341 | `${gname} (siz)` | açıklama |
| components/map/RouteMap.tsx | 344 | · rehber | açıklama |
| components/map/RouteMap.tsx | 345 | konum yok | açıklama |
| components/map/RouteMap.tsx | 353 | Grup | düğme |
| components/map/RouteMap.tsx | 353 | · | düğme |
| components/map/RouteMap.tsx | 353 | kişi | düğme |
| components/map/RouteMap.tsx | 353 | · bağlantı yok | düğme |
| components/map/RouteMap.tsx | 353 | · bağlanıyor | düğme |
| components/map/RouteMap.tsx | 357 | Konumunuz aranıyor… | açıklama |
| components/map/RouteMap.tsx | 358 | Konum izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz. | hata |
| components/map/RouteMap.tsx | 359 | Konum alınamadı. Daha açık bir alanda tekrar deneyin. | hata |
| components/map/RouteMap.tsx | 360 | En yakın durak: | düğme |
| components/map/RouteMap.tsx | 360 | · | düğme |
| components/map/RouteMap.tsx | 365 | Vardınız · | açıklama |
| components/map/RouteMap.tsx | 365 | / | açıklama |
| components/map/RouteMap.tsx | 367 | Durak ziyaret edildi olarak işaretlendi. | açıklama |
| components/map/RouteMap.tsx | 369 | Anlatımı dinle | düğme |
| components/map/RouteMap.tsx | 370 | Rehber ilerletince grup sonraki durağa geçer | açıklama |
| components/map/RouteMap.tsx | 370 | `Sonraki: ${stops[cur + 1].name}` | düğme |
| components/map/RouteMap.tsx | 370 | Rotayı bitir | düğme |
| components/map/RouteMap.tsx | 378 | Sıradaki durak · | açıklama |
| components/map/RouteMap.tsx | 378 | / | açıklama |
| components/map/RouteMap.tsx | 380 | `${formatDistance(nav.dist)} · yaklaşık ${formatDuration(nav.dur)}` | açıklama |
| components/map/RouteMap.tsx | 380 | `${formatDistance(straightD)} (kuş uçuşu)` | açıklama |
| components/map/RouteMap.tsx | 380 | Konum bekleniyor | açıklama |
| components/map/RouteMap.tsx | 381 | Konum yaklaşıktır; varış algılanmazsa “Atla”yı kullanın. | açıklama |
| components/map/RouteMap.tsx | 385 | Durak bilgisi | düğme |
| components/map/RouteMap.tsx | 386 | Atla | düğme |
| components/map/RouteMap.tsx | 394 | Rotayı tamamladınız! | açıklama |
| components/map/RouteMap.tsx | 395 | Tüm duraklar bitti. Yolculuğunuz için teşekkürler. | açıklama |
| components/map/RouteMap.tsx | 396 | Rotaya dön | düğme |
| components/map/RouteMap.tsx | 399 | Bir durağa dokunun · kümelere dokununca yakınlaşır | açıklama |
| components/map/RouteMap.tsx | 406 | ` · ${formatDistance(haversineM(me.pos, sel.coords))} uzaklıkta` | açıklama |
| components/map/RouteMap.tsx | 407 | Konum yaklaşıktır; bina doğrulanmadı. | açıklama |
| components/map/RouteMap.tsx | 411 | Önceki durak | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 411 | ‹ | düğme |
| components/map/RouteMap.tsx | 412 | Sonraki durak | erişilebilirlik etiketi |
| components/map/RouteMap.tsx | 412 | › | düğme |
| components/map/RouteMap.tsx | 417 | Durak bilgisi | düğme |
| components/map/RouteMap.tsx | 418 | Yol tarifi | düğme |

### components/Onboarding.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/Onboarding.tsx | 6 | Afyonkarahisar'ı keşfedin | başlık |
| components/Onboarding.tsx | 6 | Kale'den Ulu Cami'ye, Frig vadilerinden termal sulara; şehrin rehberli rotaları tek yerde. | açıklama |
| components/Onboarding.tsx | 7 | Haritada gezin | başlık |
| components/Onboarding.tsx | 7 | Duraklar, yürüyüş ve araç rotaları canlı haritada. Kendi rotanızı seçip tek dokunuşla başlatın. | açıklama |
| components/Onboarding.tsx | 8 | Sesli rehber eşlik etsin | başlık |
| components/Onboarding.tsx | 8 | Her durağın hikâyesini dinleyin. Giriş yapmadan da her şeyi gezebilirsiniz. | açıklama |
| components/Onboarding.tsx | 20 | Tanıtım | erişilebilirlik etiketi |
| components/Onboarding.tsx | 25 | Atla | düğme |
| components/Onboarding.tsx | 36 | Keşfetmeye başla | düğme |
| components/Onboarding.tsx | 36 | Devam | düğme |

### components/PhotoSlot.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/PhotoSlot.tsx | 9 | Fotoğraf yakında eklenecek | erişilebilirlik etiketi |
| components/PhotoSlot.tsx | 10 | Fotoğraf yakında | açıklama |
| components/PhotoSlot.tsx | 18 | Foto: | düğme |
| components/PhotoSlot.tsx | 18 | · | düğme |

### components/ProfileBanner.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/ProfileBanner.tsx | 5 | Gece | açıklama |
| components/ProfileBanner.tsx | 6 | Gün batımı | açıklama |
| components/ProfileBanner.tsx | 7 | Haşhaş | açıklama |
| components/ProfileBanner.tsx | 8 | Zeytin | açıklama |
| components/ProfileBanner.tsx | 9 | Termal | açıklama |
| components/ProfileBanner.tsx | 10 | Mermer | açıklama |
| components/ProfileBanner.tsx | 11 | Lokum | açıklama |
| components/ProfileBanner.tsx | 12 | Kale | açıklama |
| components/ProfileBanner.tsx | 99 | Tema | düğme |
| components/ProfileBanner.tsx | 103 | Profil teması | erişilebilirlik etiketi |
| components/ProfileBanner.tsx | 111 | Kapat | erişilebilirlik etiketi |
| components/ProfileBanner.tsx | 111 | × | düğme |

### components/ProfileName.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/ProfileName.tsx | 7 | Düzenle | düğme |
| components/ProfileName.tsx | 10 | Ad | erişilebilirlik etiketi |
| components/ProfileName.tsx | 11 | Kaydet | düğme |

### components/qr/Scanner.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/qr/Scanner.tsx | 30 | Bu QR kodu bir Afyon Şehir Rotası kodu değil. | açıklama |
| components/qr/Scanner.tsx | 70 | Kamera görüntüsü | erişilebilirlik etiketi |
| components/qr/Scanner.tsx | 75 | Kamera açılıyor… | açıklama |
| components/qr/Scanner.tsx | 76 | Kamera izni verilmedi. Tarayıcı ayarlarından izin verin veya aşağıdan kodu elle girin. | hata |
| components/qr/Scanner.tsx | 77 | Bu cihazda kamera kullanılamıyor. Kodu elle girebilirsiniz. | hata |
| components/qr/Scanner.tsx | 83 | Rota kodu veya bağlantı | açıklama |
| components/qr/Scanner.tsx | 83 | Rota kodu | erişilebilirlik etiketi |
| components/qr/Scanner.tsx | 84 | Aç | düğme |

### components/route/Comments.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/route/Comments.tsx | 13 | Yorumlar | erişilebilirlik etiketi |
| components/route/Comments.tsx | 14 | Yorumlar | başlık |
| components/route/Comments.tsx | 14 | · | başlık |
| components/route/Comments.tsx | 17 | Bu rota hakkında ne düşünüyorsunuz? | açıklama |
| components/route/Comments.tsx | 17 | Yorum | erişilebilirlik etiketi |
| components/route/Comments.tsx | 18 | Gönder | düğme |
| components/route/Comments.tsx | 20 | Yorum yazmak için misafir oturumundan çıkıp hesap oluşturun. | açıklama |
| components/route/Comments.tsx | 23 | Henüz yorum yok. İlk yorumu siz yazın. | boş durum |
| components/route/Comments.tsx | 28 | Sil | düğme |

### components/route/RouteControls.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/route/RouteControls.tsx | 10 | Başlangıç | açıklama |
| components/route/RouteControls.tsx | 10 | Bitiş | açıklama |
| components/route/RouteControls.tsx | 10 | Mola | açıklama |
| components/route/RouteControls.tsx | 10 | Konaklama | açıklama |
| components/route/RouteControls.tsx | 16 | Favorilere eklemek için giriş yap | erişilebilirlik etiketi |
| components/route/RouteControls.tsx | 21 | Favorilerden çıkar | erişilebilirlik etiketi |
| components/route/RouteControls.tsx | 21 | Favorilere ekle | erişilebilirlik etiketi |
| components/route/RouteControls.tsx | 37 | Paylaş | erişilebilirlik etiketi |
| components/route/RouteControls.tsx | 38 | Kopyalandı | düğme |
| components/route/RouteControls.tsx | 53 | İşlem başarısız. | hata |
| components/route/RouteControls.tsx | 71 | Duraklar | erişilebilirlik etiketi |
| components/route/RouteControls.tsx | 73 | Duraklar | başlık |
| components/route/RouteControls.tsx | 73 | · | başlık |
| components/route/RouteControls.tsx | 74 | / | açıklama |
| components/route/RouteControls.tsx | 74 | ziyaret edildi | açıklama |
| components/route/RouteControls.tsx | 77 | Misafir olarak ilerlemeniz yalnızca bu sayfada tutulur. Kaydetmek için | açıklama |
| components/route/RouteControls.tsx | 77 | giriş yapın | düğme |
| components/route/RouteControls.tsx | 77 | . | açıklama |
| components/route/RouteControls.tsx | 86 | · | düğme |
| components/route/RouteControls.tsx | 89 | Bilgi › | düğme |
| components/route/RouteControls.tsx | 89 | Haritada › | düğme |
| components/route/RouteControls.tsx | 92 | `${s.place.name} ziyaret edildi` | erişilebilirlik etiketi |
| components/route/RouteControls.tsx | 102 | Rotayı Başlat | düğme |
| components/route/RouteControls.tsx | 102 | canlı yönlendirme | düğme |
| components/route/RouteControls.tsx | 105 | Tebrikler, rotayı tamamladınız! | açıklama |
| components/route/RouteControls.tsx | 105 | Rota devam ediyor. | açıklama |
| components/route/RouteControls.tsx | 106 | Yönlendirmeyi sürdür | düğme |
| components/route/RouteControls.tsx | 107 | Sıfırla | düğme |

### components/route/StartPanel.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/route/StartPanel.tsx | 34 | Bireysel başla | düğme |
| components/route/StartPanel.tsx | 37 | Grupla | düğme |
| components/route/StartPanel.tsx | 42 | Grup turu | erişilebilirlik etiketi |
| components/route/StartPanel.tsx | 47 | Grup kur | düğme |
| components/route/StartPanel.tsx | 47 | Koda katıl | düğme |
| components/route/StartPanel.tsx | 50 | Adınız | açıklama |
| components/route/StartPanel.tsx | 51 | Grupta görünecek ad | açıklama |
| components/route/StartPanel.tsx | 55 | Grup kodunuz | açıklama |
| components/route/StartPanel.tsx | 57 | Siz rehbersiniz: durakları siz ilerletirsiniz, grup birlikte ilerler. Herkes haritada birbirini canlı görür. | açıklama |
| components/route/StartPanel.tsx | 59 | `Afyon turuna katıl! Kod: ${code}\n${link(code)}` | düğme |
| components/route/StartPanel.tsx | 59 | WhatsApp | düğme |
| components/route/StartPanel.tsx | 60 | Kopyalandı | düğme |
| components/route/StartPanel.tsx | 60 | Bağlantıyı kopyala | düğme |
| components/route/StartPanel.tsx | 62 | Turu başlat | düğme |
| components/route/StartPanel.tsx | 66 | Grup kodu | açıklama |
| components/route/StartPanel.tsx | 67 | Örn. K7M2QX | açıklama |
| components/route/StartPanel.tsx | 69 | Gruba katıl | düğme |

### components/RouteBrowser.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/RouteBrowser.tsx | 25 | Rota veya mekân ara (ör. Ulu Cami) | açıklama |
| components/RouteBrowser.tsx | 25 | Rota ara | erişilebilirlik etiketi |
| components/RouteBrowser.tsx | 26 | Kategori | erişilebilirlik etiketi |
| components/RouteBrowser.tsx | 27 | Tümü | açıklama |
| components/RouteBrowser.tsx | 32 | Aramanızla eşleşen rota bulunamadı. | hata |
| components/RouteBrowser.tsx | 35 | · | başlık |
| components/RouteBrowser.tsx | 35 | rota | başlık |

### components/RouteMeta.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/RouteMeta.tsx | 6 | `${r.distanceNote?.startsWith("Yaklaşık") &#124;&#124; r.distanceNote === "Toplam, yaklaşık" ? "~" : ""}${r.distanceKm} km` | açıklama |
| components/RouteMeta.tsx | 7 | `${r.stops.length} durak` | açıklama |

### components/SearchBox.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/SearchBox.tsx | 18 | Rota veya mekân ara | açıklama |
| components/SearchBox.tsx | 19 | Rota veya mekân ara | açıklama |
| components/SearchBox.tsx | 23 | Sonuç bulunamadı. | hata |

### components/SignInPrompt.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/SignInPrompt.tsx | 8 | Giriş yap veya kayıt ol | düğme |
| components/SignInPrompt.tsx | 9 | Rotalara, haritaya ve duraklara giriş yapmadan da göz atabilirsiniz. | açıklama |
| components/SignInPrompt.tsx | 9 | Gizlilik | düğme |
| components/SignInPrompt.tsx | 9 | · | açıklama |
| components/SignInPrompt.tsx | 9 | Şartlar | düğme |
| components/SignInPrompt.tsx | 9 | Geri bildirim | düğme |

### components/social/Feed.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/social/Feed.tsx | 19 | Paylaşım yapmak için misafir oturumundan çıkıp hesap oluşturun. | açıklama |
| components/social/Feed.tsx | 26 | Yalnızca JPG, PNG veya WebP yükleyin. | açıklama |
| components/social/Feed.tsx | 27 | Fotoğraf en fazla 5 MB olabilir. | hata |
| components/social/Feed.tsx | 31 | Fotoğraf yüklenemedi. | hata |
| components/social/Feed.tsx | 36 | Paylaşılamadı. | açıklama |
| components/social/Feed.tsx | 41 | Bugünkü rotanı paylaş… | açıklama |
| components/social/Feed.tsx | 41 | Paylaşım metni | erişilebilirlik etiketi |
| components/social/Feed.tsx | 43 | Rota | erişilebilirlik etiketi |
| components/social/Feed.tsx | 44 | Rota seç (isteğe bağlı) | açıklama |
| components/social/Feed.tsx | 48 | Fotoğraf seçildi | açıklama |
| components/social/Feed.tsx | 48 | Fotoğraf | açıklama |
| components/social/Feed.tsx | 50 | Gönderiliyor… | düğme |
| components/social/Feed.tsx | 50 | Paylaş | düğme |
| components/social/Feed.tsx | 65 | Sil | düğme |
| components/social/Feed.tsx | 80 | Sil | düğme |
| components/social/Feed.tsx | 84 | Yorum yaz | açıklama |
| components/social/Feed.tsx | 84 | Yorum | erişilebilirlik etiketi |
| components/social/Feed.tsx | 85 | Gönder | düğme |
| components/social/Feed.tsx | 87 | Yorum yazmak için hesap oluşturun. | açıklama |

### components/TopNav.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/TopNav.tsx | 5 | Keşfet | açıklama |
| components/TopNav.tsx | 5 | Rotalar | açıklama |
| components/TopNav.tsx | 5 | Harita | açıklama |
| components/TopNav.tsx | 5 | Rotanı Belirle | açıklama |
| components/TopNav.tsx | 5 | Sosyal | açıklama |
| components/TopNav.tsx | 5 | Hakkında | açıklama |
| components/TopNav.tsx | 13 | Ana menü | erişilebilirlik etiketi |
| components/TopNav.tsx | 17 | Afyon Şehir Rotası | düğme |
| components/TopNav.tsx | 24 | Profil | düğme |

### components/WeatherCard.tsx

| Dosya | Satır | Metin | Tür |
|---|---:|---|---|
| components/WeatherCard.tsx | 11 | Açık | açıklama |
| components/WeatherCard.tsx | 12 | Parçalı bulutlu | açıklama |
| components/WeatherCard.tsx | 13 | Kapalı | açıklama |
| components/WeatherCard.tsx | 14 | Sisli | açıklama |
| components/WeatherCard.tsx | 15 | Çisenti | açıklama |
| components/WeatherCard.tsx | 16 | Yağmurlu | açıklama |
| components/WeatherCard.tsx | 17 | Karlı | açıklama |
| components/WeatherCard.tsx | 18 | Gök gürültülü fırtına | açıklama |
| components/WeatherCard.tsx | 34 | Bugün | açıklama |
| components/WeatherCard.tsx | 69 | Hava durumu yükleniyor | erişilebilirlik etiketi |
| components/WeatherCard.tsx | 72 | Yağış var: müze ve camilerin olduğu kapalı mekân rotası iyi bir seçim. | açıklama |
| components/WeatherCard.tsx | 72 | Merkez Kültür Rotası | açıklama |
| components/WeatherCard.tsx | 73 | Çok sıcak: yürüyüşleri sabaha alın, öğleden sonra termal ve müzeleri tercih edin. | açıklama |
| components/WeatherCard.tsx | 73 | Rotalara bak | açıklama |
| components/WeatherCard.tsx | 74 | Soğuk bir gün: kalın giyinin, kapalı mekânlı rotaları seçin. | açıklama |
| components/WeatherCard.tsx | 74 | Merkez Kültür Rotası | açıklama |
| components/WeatherCard.tsx | 75 | Dışarıda gezmek için güzel bir gün. | açıklama |
| components/WeatherCard.tsx | 75 | Rotalara bak | açıklama |
| components/WeatherCard.tsx | 78 | Hava durumu | erişilebilirlik etiketi |
| components/WeatherCard.tsx | 82 | Bulunduğunuz yer | açıklama |
| components/WeatherCard.tsx | 82 | Afyonkarahisar | açıklama |
| components/WeatherCard.tsx | 82 | · şu an | açıklama |
| components/WeatherCard.tsx | 83 | ° | açıklama |
| components/WeatherCard.tsx | 84 | Hissedilen | açıklama |
| components/WeatherCard.tsx | 84 | ° · Rüzgâr | açıklama |
| components/WeatherCard.tsx | 84 | km/sa · Yağış % | açıklama |
| components/WeatherCard.tsx | 84 | · | açıklama |
| components/WeatherCard.tsx | 84 | °/ | açıklama |
| components/WeatherCard.tsx | 84 | ° | açıklama |
| components/WeatherCard.tsx | 86 | Aranıyor… | düğme |
| components/WeatherCard.tsx | 86 | Konumum | düğme |
| components/WeatherCard.tsx | 89 | ° | açıklama |
| components/WeatherCard.tsx | 91 | › | düğme |
| components/WeatherCard.tsx | 94 | Yakınınızdaki duraklar | açıklama |

## İçerik dosyalarının özeti

Kimlik, slug, kategori kodu, koordinat, görsel yolu ve URL çeviri metni sayılmadı. Dolu metin alanı, kayıt içindeki metin özelliğidir. Dizi halinde tutulan bir özellik tek alan, her öğesi ayrı metin değeri olarak sayıldı. İç içe nesnelerde kullanıcıya gösterilen yaprak alanlar sayıldı. source başvuruları ve birleştirmeleri, kullanıcıya sunulan tek alan değeri olarak çözümlendi.

| Dosya / koleksiyon | Kayıt | Dolu metin alanı | Metin değeri | Alan dağılımı (metin değeri sayısı) |
|---|---:|---:|---:|---|
| lib/routes.ts / routes | 14 | 107 | 141 | title 14, summary 14, description 29, distanceNote 5, difficultyNote 1, provinces 25, stops.note 33, tips 6, source 14 |
| lib/places.ts / list | 86 | 240 | 240 | name 86, area 86, note 68 |
| lib/placeExtra.ts / placeExtra | 67 | 779 | 865 | about 133, facts.label 251, facts.value 251, visitTips 74, sources.title 156 |
| lib/badges.ts / badgeDefs | 6 | 12 | 12 | label 6, hint 6 |

placeExtra içindeki 67 anahtar mevcut 86 durağın ayrıntı kayıtlarıdır, ayrı durak olarak toplanmaz. places ile placeList aynı 86 kaydı sunar. Rotaların 8’i il içi, 6’sı çevre illerle bağlantılıdır. 6 rotada distanceKm bulunur. Veride olmayan mesafe veya ziyaret süresi eklenmedi.

lib/routes.ts içindeki koleksiyon dışı sözlükler ayrıca 8 kategori, 2 kapsam, 3 ulaşım türü, 3 zorluk etiketi ve 5 eski gezinme etiketi içerir. Bunlar 14 rota hesabına dahil değildir. lib/places.ts içindeki bilinmeyen durak hatası da kayıt içeriği değildir.

## Tarih, saat, sayı ve mesafe biçimlendirmesi

| Dosya | Satır | İşlem ve mevcut gösterim |
|---|---:|---|
| components/admin/AdminClient.tsx | 30 | new Date(...).toLocaleString('tr-TR'), kısa tarih ve saat. |
| components/route/Comments.tsx | 11, 26 | Intl.DateTimeFormat('tr-TR'), gün, uzun ay ve yıl. |
| components/social/Feed.tsx | 13, 64 | Intl.DateTimeFormat('tr-TR'), gün, uzun ay, iki basamaklı saat ve dakika. |
| components/WeatherCard.tsx | 34 | ISO güne T12:00 eklenir, toLocaleDateString('tr-TR') ile kısa gün adı, ilk gün Bugün sabiti. |
| components/LegalPage.tsx | 9 | Son güncelleme: Ekim 2026 sabit metni. |
| app/yonetim/page.tsx | 53, 55 | Grafik ipucunda ham tarih, eksende slice(5) ile ay ve gün. |
| app/actions.ts | 55 | Tamamlanma anı toISOString() ile saklanır, doğrudan gösterim değildir. |
| lib/map/geo.ts | 10–12 | formatDistance: 950 m altında on metreye yuvarlama, üstünde km, 10 km altında bir ondalık. toFixed sonrası nokta virgüle çevrilir. m ve km sabit. |
| lib/map/nav.ts | 44 | formatDuration: 90 saniye altında 1 dk, bir saat altında yuvarlanmış dakika, üstünde saat ve dakika. sa ve dk sabit. Yuvarlama 60 dakika üretebilir, davranış değiştirilmedi. |
| components/map/RouteMap.tsx | 271 | Sesli yönergede on metreye yuvarlanan mesafe ve metre sonra sabiti. |
| components/map/RouteMap.tsx | 321–322 | Sıradaki manevra ve kuş uçuşu mesafede m veya formatDistance. Yön adı bearingText üzerinden gelir. |
| components/map/RouteMap.tsx | 360, 380, 406 | En yakın durak, yol ve seçili durağa uzaklıkta formatDistance, sürede formatDuration. yaklaşık ve kuş uçuşu metinleri bileşende. |
| components/RouteMeta.tsx | 6–9 | Koşullu ~ işareti, doğrudan distanceKm + km, durak sayısı ve orta nokta ayırıcı. Yaklaşık notu metin karşılaştırmasıyla belirlenir. |
| app/rotalar/[slug]/page.tsx | 64, 70–71 | İl adları virgülle, ulaşım türleri orta noktayla birleştirilir. distanceKm + km doğrudan gösterilir. |
| app/page.tsx | 25 | routes.length + önerilen tur rotası, sayı doğrudan basılır. |
| components/RouteBrowser.tsx | 35 | Kapsamdaki rota sayısı + rota, sayı doğrudan basılır. |
| app/profil/page.tsx | 41–42, 64–66 | Tamamlanan rota, ziyaret, rozet sayısı ve ziyaret / toplam durak. Yüzde yalnızca CSS genişliğidir. |
| components/route/RouteControls.tsx | 73–76, 85–87 | Durak sayısı, ziyaret / toplam ve birden başlayan sıra. Yüzde yalnızca CSS genişliğidir. |
| components/builder/Builder.tsx | 47, 52, 75 | Seçilen durak sayısı, birden başlayan sıra, okla birleştirilen durak adları. |
| app/yonetim/page.tsx | 34–35, 43–47, 53, 66 | İstatistikler, paylaşım / yorum, grafik ipucu ve yeni geri bildirim sayısı. Yerel sayı biçimi yok, eksik değerde kısa çizgi. |
| components/admin/AdminClient.tsx | 20 | Durum filtrelerinde orta nokta ve kayıt sayısı. |
| components/FeedbackForm.tsx | 47 | Mesaj uzunluğu /2000 sayacı. |
| components/route/Comments.tsx | 14 | Orta nokta ve yorum adedi. |
| components/WeatherCard.tsx | 47–49 | Sıcaklık, hissedilen sıcaklık ve rüzgâr Math.round ile tam sayıya yuvarlanır. |
| components/WeatherCard.tsx | 83–84, 89, 96 | Derece, km/sa, yüzde yağış, alt/üst sıcaklık ve formatDistance ile yakın durak mesafesi. |
| components/WeatherCard.tsx | 44 | Koordinatta toFixed(3), timezone=auto, API isteğinin teknik biçimidir. |
| components/social/Feed.tsx | 27 | 5 * 1024 * 1024 dosya sınırı ve sabit 5 MB uyarısı. |

Türkçe harf dönüşümleri: components/SearchBox.tsx:6, components/RouteBrowser.tsx:16–18 ve components/builder/Builder.tsx:19–20 aramada toLocaleLowerCase('tr') kullanır. app/profil/page.tsx:35 ve components/map/RouteMap.tsx:212,343 baş harfi toLocaleUpperCase('tr') ile üretir.

## Başka dosyalardan gelen arayüz metinleri

Bunlar app/ ve components/ sabit metin tablosu dışındaki bağımlılıklardır. İçerik koleksiyonlarının metinleri yukarıda yalnızca sayıldı.

| Kaynak | Tüketen alan ve not |
|---|---|
| lib/tabs.ts:2–7 | GlassTab için 6 gezinme etiketi, Belirle kısa biçimi dahil. |
| lib/routes.ts:231–237 | Kategori, kapsam, ulaşım ve zorluk etiketleri. |
| lib/map/nav.ts:14,21–26,48 | Haritanın yazılı ve sesli manevraları, kavşak çıkış numarası, yön ve yol adları. |
| lib/map/geo.ts:10–12 ve lib/map/nav.ts:44 | Mesafe ve süre birimleri. |
| lib/photos.ts | PhotoSlot için fotoğraf alternatif metni, yazar ve lisans. |
| Veri tabanı | Duyurular, yorumlar, sosyal içerik, profil ve yönetim kayıtları sabit çeviri metni değildir. |
| MapLibre / OpenFreeMap | Map, Toggle attribution ve kaynak gösterimi kütüphaneden gelir. |
| Cihaz ve tarayıcı | Ses adları, kamera izin arayüzü ve yerleşik form doğrulama metinleri. |

## Kontrol ve açık noktalar

- npm ci mevcut kilit dosyasıyla tamamlandı. Yeni paket veya paket sürümü eklenmedi.
- npm run build hatasız tamamlandı. Tür denetimi geçti, 120 statik çıktı üretildi. İlk sandbox denemesi ağ ve çıktı dizini erişiminde başarısızdı, gerekli izinle tekrarlanan komut başarılıdır.
- 15 page.tsx dosyasının tamamı sayfa tablosundadır. Her biri için iki genişlikte WebP bulunur.
- Sabit metin tablosu 603 satır içerir. Aynı kaynak satırındaki aynı metin ve tür tekilleştirilmiştir. 47 dosyada en az bir sabit metin vardır.
- .env.local içeriği okunmadı, belgeye veya ekran görüntüsüne alınmadı. Commit kapsamı yalnızca envanter, görev durumu ve ekran görüntüleridir.
- Yönetimde misafir kullanıcı için Kurulum gerekli görüldü. app/yonetim/page.tsx:22 bu mesajı is_admin RPC hatasında üretir. Bu gözlem tek başına tabloların eksik olduğunu kanıtlamaz. Veritabanı kurulumu yapılmadı.
- Soru: Yönetimin Yetkiniz yok ekranını da doğrulamak için gerekli Supabase kurulum kontrolü ayrı bir görev olarak açılacak mı?
- QR ekranı Kamera açılıyor… durumunda kaldı. Kamera erişimi etkinleştirilmedi, elle kod alanı görüntülendi. Tarayıcı otomasyonu kullanılabildi.
- Envanterde mevcut noktalı virgüllü metinler ve 44 px altında dokunma hedefleri görüldü. G-001 kapsamında düzeltilmedi.
