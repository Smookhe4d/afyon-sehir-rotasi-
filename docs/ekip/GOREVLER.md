# Görevler

Durumlar: **Taslak** (henüz tanımlanıyor), **Hazır** (uygulanabilir), **Uygulamada**, **İncelemede**, **Değişiklik istendi**, **Onaylandı** (proje sahibinin birleştirme onayını bekliyor), **Tamamlandı**.

Görevleri yalnızca yönetici yazar. Uygulayıcı yalnızca "Durum" ve "Uygulayıcı notu" alanlarını değiştirir.

---

## G-001: Metin ve sayfa envanteri

- **Durum:** Tamamlandı (PR #1, 15 Ekim 2026)
- **İş akışı:** D, A
- **Dal:** `codex/G-001-metin-envanteri`
- **Amaç:** Dil desteği ve tasarım yenilemesine başlamadan önce sitenin mevcut durumunu belgelemek. Bu görev aynı zamanda ekip çalışma akışının (dal, pull request, denetim) ilk denemesidir.

**Yapılacaklar**

1. `docs/ekip/envanter.md` dosyasını oluştur.
2. Sayfa listesi: `app/` altındaki her sayfa için adres, dosya yolu ve bir cümlelik işlev.
3. Sabit metin listesi: `app/` ve `components/` içinde kullanıcıya görünen her Türkçe metin. Tablo sütunları: dosya, satır, metin, tür (başlık, düğme, açıklama, hata, boş durum, erişilebilirlik etiketi). Rota ve durak içeriği (`lib/routes.ts`, `lib/places.ts`, `lib/placeExtra.ts`, `lib/badges.ts`) bu tabloya girmez, yalnızca kaç kayıt ve kaç metin alanı içerdiği özetlenir.
4. Tarih, saat, sayı ve mesafe biçimlendirmesinin yapıldığı yerlerin listesi (ör. `km`, `dk`, `toLocaleString`).
5. Her sayfanın 390 px ve 1280 px genişlikte ekran görüntüsünü `docs/ekip/ekran/G-001/` altına koy. Dosya adı: `<sayfa>-390.png`, `<sayfa>-1280.png`.
6. Kod davranışını değiştirme. Bu görev yalnızca belge ve ekran görüntüsü üretir.

**Kabul ölçütleri**

- Envanterde `app/` altındaki tüm sayfalar yer alıyor.
- Sabit metin tablosu eksiksiz. Denetimde rastgele seçilecek beş bileşende tabloda olmayan metin çıkmamalı.
- `npm run build` hatasız geçiyor.
- Kod dosyalarında değişiklik yok.

**Uygulayıcı notu**

- Denetim düzeltmesi, 15 Ekim 2026: a0013d9 commit’inin yerelde ve görev dalının geçmişinde olduğu teyit edildi. G-001 denetimi ve öğrenme notları okundu. Mevcut 30 PNG kalite 80 WebP’ye dönüştürüldü, PNG’ler kaldırıldı ve envanter bağlantıları güncellendi. Yeniden çekim, kırpma ve ölçekleme yapılmadı. Boyutlar korundu. En büyük dosya 204.630 bayt, toplam 2.004.412 bayttır. 30 bağlantının tamamı ve her dosyanın 400.000 bayt altında olduğu doğrulandı. npm run build tekrar hatasız geçti. G-004 ve yöneticinin denetim kaydı değiştirilmedi.
- 15 Ekim 2026: ekip/kurulum dalındaki 5501bb2 commit’inden codex/G-001-metin-envanteri dalı açıldı.
- Yapılanlar: docs/ekip/envanter.md oluşturuldu. 15 sayfa, 47 dosyada 603 sabit metin satırı, içerik kayıtları ve metin alanı sayıları, tarih, saat, sayı ve mesafe biçimlendirmeleri belgelendi.
- Değişen dosyalar: docs/ekip/envanter.md, docs/ekip/ekran/G-001/ altındaki 30 WebP ve bu görevin Durum ile Uygulayıcı notu alanları. Kod dosyaları, paket listesi ve kilit dosyası değiştirilmedi.
- Test: mevcut paketler npm ci ile kuruldu. npm run build gerekli ağ ve çıktı dizini izniyle hatasız tamamlandı, tür denetimi geçti ve 120 statik çıktı üretildi. İlk sandbox denemesi Google Fonts erişimi ve çıktı dizini izninde başarısız olmuştu.
- Ekranlar: başarılı build’in localhost:3000 sunucusunda tarayıcı otomasyonuyla, 390 × 844 ve 1280 × 900 CSS piksel viewport’larda tam sayfa çekildi. Tarayıcı çıktısı ölçeklenmeden PNG olarak kodlandı. Dosya adları viewport genişliğini gösterir, yakalama motorunun raster ölçüsü farklı olabilir. Dinamik örnekler /rotalar/frig-yolu-afyonkarahisar ve /duraklar/ayazini olarak kullanıldı.
- /profil için /giris sayfasındaki Misafir olarak devam et düğmesiyle giriş yapıldı. /yonetim misafir oturumunda Kurulum gerekli ekranını gösterdi. Kod bu mesajı is_admin çağrısı hata döndüğünde gösteriyor, tabloların eksikliği ayrıca doğrulanmadı.
- Soru: Yönetimin Yetkiniz yok ekranını da doğrulamak için gerekli Supabase kurulum kontrolü ayrı bir görev olarak açılacak mı? Bu görevde kurulum veya yetki değişikliği yapılmadı.
- QR ekranında Kamera açılıyor… mesajı kaldı ve kamera görüntüsü alınamadı. Elle kod alanı belgelendi, kamera erişimi etkinleştirilmedi. Tarayıcı otomasyonu kullanılabildi, başka yakalama yöntemine geçilmedi.
- Kapsam dışı gözlem: yerel sunucu kayıtlarında Supabase, getSession() ile gelen kullanıcı nesnesine güvenmek yerine getUser() ile doğrulama yapılması uyarısını verdi. Bu görevde oturum kodu değiştirilmedi, ayrı denetim gerektirir.
- .env.local git dışında kaldı, içeriği okunmadı ve notlara eklenmedi. Mevcut noktalı virgüllü metinler ve küçük dokunma hedefleri yalnızca kaydedildi.
- Teslim: dal GitHub’a gönderildi. [PR #1](https://github.com/Smookhe4d/afyon-sehir-rotasi-/pull/1) main hedefiyle açıldı. Görev teslimi b6c6fa1 commit’indedir, bu güncelleme denetim durumunu kaydeder. main karşılaştırması, görev dalının açıldığı ekip/kurulum dalındaki iki kurulum commit’ini de içerir. main dalına commit, push veya birleştirme yapılmadı.

---

## G-002: Dil desteği altyapısı (Türkçe ve İngilizce)

- **Durum:** Tamamlandı (PR #2, 15 Ekim 2026)
- **İş akışı:** D
- **Dal:** `codex/G-002-dil-altyapisi`
- **Amaç:** Sitenin Türkçe ve İngilizce sunulabilmesi için altyapıyı kurmak. Bu görevde altyapı, dil seçici ve ortak bileşenler tamamlanır. Kalan arayüz metinlerinin taşınması ve çevirisi G-005'te, rota ve durak içeriğinin çevirisi G-006'da yapılacaktır.

**Proje sahibinin kararları (değiştirilmez)**

- Kütüphane: `next-intl`. Paket eklenmesi bu görev için onaylıdır. Next.js 15.5 ile uyumlu güncel kararlı sürüm kullanılır, sürüm `package.json` içinde sabitlenir.
- Türkçe varsayılan dildir ve adreslerde önek kullanmaz. Var olan bütün Türkçe adresler ve QR bağlantıları aynen çalışmaya devam eder.
- İngilizce `/en` öneki ve İngilizce yol adlarıyla sunulur.
- Site Türkçe açılır. Tarayıcı dili İngilizce olan ziyaretçiye sayfanın üstünde küçük bir "English version" önerisi gösterilir. Otomatik yönlendirme yapılmaz. Ziyaretçinin seçimi hatırlanır ve öneri bir daha gösterilmez.

**Adres eşlemesi**

| Türkçe | İngilizce |
|---|---|
| `/` | `/en` |
| `/rotalar` | `/en/routes` |
| `/rotalar/[slug]` | `/en/routes/[slug]` |
| `/duraklar/[id]` | `/en/stops/[id]` |
| `/harita` | `/en/map` |
| `/rotani-belirle` | `/en/plan-your-route` |
| `/sosyal` | `/en/community` |
| `/profil` | `/en/profile` |
| `/giris` | `/en/sign-in` |
| `/qr` | `/en/qr` |
| `/geri-bildirim` | `/en/feedback` |
| `/hakkinda` | `/en/about` |
| `/gizlilik` | `/en/privacy` |
| `/sartlar` | `/en/terms` |
| `/yonetim` | `/en/admin` |

`/auth/callback` ve `/auth/cikis` dil öneki almaz. Rota `slug` değerleri ve durak `id` değerleri iki dilde aynıdır.

**Yapılacaklar**

1. `next-intl` kurulumu: `i18n/routing.ts` (diller `tr` ve `en`, `localePrefix: "as-needed"`, yukarıdaki `pathnames` eşlemesi), `i18n/request.ts`, `i18n/navigation.ts` (dile duyarlı `Link`, `useRouter`, `usePathname`, `redirect`).
2. Sayfalar `app/[locale]/` altına taşınır. `generateStaticParams` ile iki dil üretilir. `auth`, `manifest.ts`, `robots.ts`, `sitemap.ts`, ikonlar ve `globals.css` yerinde kalır.
3. `middleware.ts`: `next-intl` dil yönlendirmesi ile mevcut Supabase oturum tazelemesi tek bir ara katmanda birleştirilir. Supabase'in yazdığı çerezler `next-intl`'in döndürdüğü yanıta aktarılmalıdır, aksi hâlde oturum kaybolur. `/giris` yönlendirmesi iki dilde de çalışmalıdır.
4. `<html lang>` dile göre ayarlanır. Her sayfanın meta verisinde `alternates.languages` ile `tr` ve `en` karşılıkları ve `x-default` (Türkçe) verilir. `sitemap.ts` iki dilin adreslerini içerir. Open Graph `locale` değeri dile göre `tr_TR` ya da `en_US` olur.
5. Mesaj dosyaları `messages/tr.json` ve `messages/en.json` olarak oluşturulur. Anahtarlar bileşen ya da sayfa adına göre gruplanır (`nav`, `common`, `home`, `routes` gibi).
6. Bu görevde metni taşınacak bileşenler: `lib/tabs.ts` ve `components/GlassTab.tsx` (alt gezinme), `components/TopNav.tsx`, `app/[locale]/layout.tsx` ve meta veriler, `app/not-found.tsx`, `app/loading.tsx`, `components/PageHeader.tsx`, `components/BackButton.tsx`, `components/Onboarding.tsx`. Bu bileşenlerin İngilizce karşılıkları da yazılır.
7. Biçimlendirme: `lib/map/geo.ts` içindeki `formatDistance` ve `lib/map/nav.ts` içindeki `formatDuration` dili parametre olarak alacak biçimde güncellenir. Türkçede `1,2 km`, `15 dk`, `1 sa 5 dk`, İngilizcede `1.2 km`, `15 min`, `1 h 5 min` biçimi kullanılır. `formatDuration` içindeki 60 dakika üretme hatası (envanter notu) düzeltilir. Çağıran yerler mevcut davranışı korumak için şimdilik Türkçe parametre geçer.
8. Dil seçici: `TopNav` içinde ve `/profil` sayfasında "TR / EN" seçimi. Seçici bulunulan sayfanın diğer dildeki karşılığına gider (rota sayfasındaysa aynı rotanın İngilizce sayfasına). Seçim `NEXT_LOCALE` çerezinde saklanır.
9. Tarayıcı dili önerisi: Tarayıcı dili `en` ile başlayan ve henüz seçim yapmamış ziyaretçiye Türkçe sayfanın üstünde kapatılabilir bir bant gösterilir. Bant metni: "This site is also available in English." ve "Switch to English" bağlantısı. Kapatma ya da seçim hatırlanır. Bant içerik kaydırması (layout shift) yaratmamalıdır.
10. Henüz çevrilmemiş metinler İngilizce sayfada Türkçe görünmeye devam eder. Bu görevde eksik çeviri hata üretmemelidir. Eksik anahtarlar geliştirme modunda konsola uyarı olarak yazılır.

**Kapsam dışı**

- Bu listede olmayan bileşenlerdeki metinler (G-005).
- `lib/routes.ts`, `lib/places.ts`, `lib/placeExtra.ts`, `lib/badges.ts` içerikleri (G-006).
- Görsel tasarım değişikliği. Dil seçici ve bant mevcut belirteçlerle, sade biçimde yapılır.

**Kabul ölçütleri**

- G-001 envanterindeki 15 sayfanın tamamı Türkçe adresiyle eskisi gibi açılıyor. Görünüşte fark yok (dil seçici ve İngilizce kullanıcıya gösterilen bant hariç).
- 15 sayfanın tamamı İngilizce adresiyle açılıyor. Alt gezinme, üst çubuk, sayfa başlığı alanı, 404 ve yüklenme ekranı İngilizce.
- `/rotalar/frig-yolu-afyonkarahisar` sayfasında dil seçicisi `/en/routes/frig-yolu-afyonkarahisar` adresine, oradan geri dönüşte aynı Türkçe sayfaya gidiyor.
- Misafir girişi, oturum açık kalma ve `/auth/callback` dönüşü iki dilde de çalışıyor.
- Sayfa kaynağında `lang` özniteliği ve `hreflang` bağlantıları doğru.
- Tarayıcı dili İngilizce yapılmış bir oturumda bant görünüyor, kapatıldıktan sonra sayfa yenilendiğinde görünmüyor.
- `npm run build` hatasız geçiyor.
- Ekran görüntüleri: `/` ve `/rotalar/frig-yolu-afyonkarahisar` için Türkçe ve İngilizce, 390 px ve 1280 px, ayrıca bantlı Türkçe ana sayfa 390 px. WebP, en fazla 400 KB.

**Uygulayıcı notu**

- Onaylanan plan uygulandı. next-intl 4.14.9 sabitlendi, localeDetection: false kullanıldı. 15 sayfa app/[locale] altına taşındı. Auth uçları ve dil bağımsız dosyalar kökte kaldı. Dil altında not-found, loading ve [...rest] eklendi.
- i18n altında yönlendirme, mesaj yükleme, gezinme, meta veri ve önbellek yenileme yardımcıları oluşturuldu. Supabase oturum yenilemesi ile dil middleware yanıtının çerezleri ve başlıkları birleştirildi. getSession davranışı korundu, G-004'e dokunulmadı.
- Dil seçiciler ve istemcide navigator.language ile NEXT_LOCALE kullanan sabit konumlu öneri bandı eklendi. Kapatma tercihi hatırlanıyor. Bandın kapanması içerik konumunu değiştirmiyor.
- Yalnızca görevdeki ortak bileşenlerin kendi metinleri messages/tr.json ve en.json dosyalarına taşındı. PageHeader'a sayfalardan verilen başlıklar ve ana sayfanın Keşfet metni onay doğrultusunda G-005'e bırakıldı. Rota, durak ve rozet içerikleri değiştirilmedi.
- Tüm bileşenlerde adres ve oturum dönüşü uyarlamaları yapıldı. Eski Türkçe QR kodları ve yeni İngilizce rota QR adresleri kabul ediliyor. Tek revalidate yardımcısı iki dilin genel ve yeniden yazılan iç adreslerini yeniliyor.
- Build başarılı. Önce 120, sonra 236 çıktı üretildi. Prerender manifestinde önce 99, sonra 192 rota var. Önceki statik rotaların tamamının karşılığı korundu. Son build açık test oturumunu bozmamak için aynı next build komutuyla ayrı geçici çıktı dizininde alındı.
- 11 otomatik test ve iki dilde 30 sayfalık HTTP kontrolü geçti. Playwright ile İngilizce tarayıcı dili, dokunmatik 390 px mobil cihaz, dil bandı, kalıcı tercih, dinamik rota geçişi, sorgu ve grup kodlarının korunması doğrulandı. Gerçek Supabase misafir girişi, yenilemede oturumun korunması, dil değişimi ve iki dilde çıkış dönüşü geçti. Mevcut Playwright ve Chrome kullanıldı, test paketi eklenmedi.
- rg taramasında app ve components altında doğrudan next/link veya sabit iç adrese giden a etiketi kalmadı. Kanonik Türkçe yol sabitleri i18n/navigation tarafından dile çevriliyor. Doğrudan revalidatePath yalnızca tek yardımcıda bulunuyor. Ayrıntılar docs/ekip/G-002-dogrulama.md dosyasında.
- Önce ve sonra toplam 13 WebP ekran görüntüsü kaydedildi. Genişlikler tam 390 ve 1280 px. En büyük görsel 120.036 bayt, toplam 752.838 bayt. Bağlantılar doğrulama belgesinde.
- Açık kalan kontrol: proje sahibi test hesabı olmadığını bildirdi. İngilizce rota sayfasında kayıtlı kullanıcıyla yorumun hemen görünmesi gerçek oturumda test edilemedi. Hesap oluşturulmadı. Yorum eyleminin iki dili yenilemesi otomatik testte doğrulandı. Gerçek OAuth/e-posta callback'i yerine işlev testi yapıldı. Bu sınırlamalar denetime sunuluyor.
- Denetim düzeltmeleri: proje sahibinin ilettiği G-002 denetim kaydı DENETIM.md dosyasına aynen eklendi. Yükleme sınırı (pages) grubuna taşındı. Bilinmeyen adresler ve rota/durak detayları bu sınırın dışında. /yok-boyle, /en/nope, /rotalar/olmayan ve /en/stops/olmayan için curl -I çıktısı HTTP/1.1 404 Not Found. Altı eksik adresin HEAD ve GET kontrolleri ile iki 307 yönlendirme kontrolü geçti.
- Dil seçicinin Türkçe href değeri doğrudan öneksiz adres. Playwright ile /tr isteği yapılmadığı, sorguların korunduğu ve NEXT_LOCALE=tr yazıldığı doğrulandı. Oturum testinde giriş formunun akışla yüklenmesi beklendi.
- Lock dosyası npm 10.9.9 ile düzeltildi, npx npm@10 ci başarılı. package.json değişmedi. npm run build başarılı, 236 çıktı ve 192 prerender rota korundu. 11 otomatik test, 30 sayfa HTTP kontrolü, Playwright dil/bant testi ve iki dilde gerçek misafir oturum testi yeniden geçti. Ayrıntılı curl çıktıları doğrulama belgesinde. Ertelenen mobil dil seçici konusu değiştirilmedi.

---

## G-003: Tasarım araştırması ve tasarım ilkeleri belgesi

- **Durum:** Taslak
- **İş akışı:** A
- **Not:** Bu görevi yönetici yürütür. Örnek destinasyon ve müze uygulamaları ile harita arayüzleri incelenip `docs/ekip/tasarim-ilkeleri.md` hazırlanacak. Proje sahibinin onayından sonra bileşen görevleri yazılacak.

## G-004: Supabase kurulumu ve oturum doğrulaması

- **Durum:** Taslak
- **İş akışı:** F
- **Not:** G-001 sırasında görüldü. Canlı veritabanında `is_admin` işlevi çağrısı hata veriyor, bu yüzden yönetim sayfası "Kurulum gerekli" uyarısı gösteriyor. Büyük olasılıkla `supabase/migrations/002_yonetim.sql` canlı veritabanında çalıştırılmamış. Oturum tarafında `lib/session.ts` zaten `getUser` kullanıyor. Yalnızca `middleware.ts` içindeki `/giris` yönlendirmesi `getSession` ile gelen kullanıcıya dayanıyor. Yönetici önce veritabanı durumunu kontrol edecek, sonra görev ayrıntılandırılacak.

---

## G-005: Kalan arayüz metinlerinin taşınması ve İngilizce çevirisi

- **Durum:** Tamamlandı (PR #3, 15 Ekim 2026)
- **İş akışı:** D
- **Dal:** `codex/G-005-arayuz-cevirisi`
- **Amaç:** Sitenin arayüzünü İngilizce sayfalarda tamamen İngilizce yapmak. Rota ve durak içeriği (G-006) bu görevin dışındadır.

**Girdiler**

- `docs/ekip/envanter.md` sabit metin tablosu (603 satır) ve "Başka dosyalardan gelen arayüz metinleri" bölümü.
- G-002'de kurulan `messages/tr.json`, `messages/en.json` yapısı ve `i18n/` yardımcıları.

**Yapılacaklar**

1. Envanterdeki, G-002'de taşınmamış bütün sabit metinleri mesaj dosyalarına taşı. Buna sayfa başlıkları ve açıklamaları, düğmeler, form etiketleri ve yer tutucular, hata ve başarı mesajları, boş durumlar, erişilebilirlik etiketleri (`aria-label`, `alt`) ve sayfa meta verileri dahildir.
2. Sunucu eylemlerinin hata metinleri (`app/actions.ts`, `app/yonetim/actions.ts`) de çevrilir. Eylem, kullanıcının diline göre mesaj döndürmelidir.
3. `lib/map/nav.ts` içindeki yazılı ve sesli yönlendirme metinleri (dönüş, kavşak, varış) iki dilde verilir. Sesli yönergeler İngilizce sayfada İngilizce sesle okunmalıdır (`speechSynthesis` için `lang` ayarı).
4. `lib/tabs.ts`, `lib/routes.ts` sonundaki kategori, kapsam, ulaşım ve zorluk etiketleri ile `lib/badges.ts` içindeki rozet adları ve ipuçları arayüz metni sayılır ve bu görevde çevrilir. Rota ve durak anlatımları çevrilmez.
5. Tarih, sayı, mesafe ve süre gösterimlerinin tamamı dile göre biçimlendirilir (envanterdeki biçimlendirme tablosu). G-002'de dile duyarlı yapılan `formatDistance` ve `formatDuration` artık bütün çağrı yerlerinde etkin dille çağrılır.
6. `/gizlilik` ve `/sartlar` sayfalarının İngilizcesi hazırlanır. İngilizce sayfanın başına şu not eklenir: "This is a translation. The Turkish version is the legally binding text." Hukuki anlamı değiştirecek serbest çeviri yapılmaz.
7. G-002 denetim notu: Dil seçicideki karşı dile giden bağlantılara `hreflang` ve `lang` öznitelikleri geri eklenir.
8. Hiçbir metin bileşenlerde sabit kalmamalı. Teslimde `app/` ve `components/` içinde Türkçe karakter ya da Türkçe sözcük içeren dizgileri tarayan bir kontrol çalıştır, kalan her sonucu gerekçesiyle not et (örneğin yer adı ya da kod içi açıklama).

**Çeviri kuralları**

- Doğal, kısa ve sade İngilizce yaz. Türkçeyi sözcük sözcük çevirme. Abartılı turizm dili kullanma ("breathtaking", "hidden gem", "unforgettable journey" gibi).
- Yer adları özgün Türkçe yazımıyla kalır (Afyonkarahisar, Ulu Cami, Ayazini). Gerekirse ilk geçtiği yerde açıklama eklenir ("Ulu Cami (Great Mosque)").
- İngiliz İngilizcesi değil Amerikan İngilizcesi kullan, ama mesafe birimi kilometre ve metre kalır.
- Sözlük (tutarlı kullanılacak karşılıklar):

| Türkçe | İngilizce |
|---|---|
| Keşfet | Explore |
| Rota / Rotalar | Route / Routes |
| Durak | Stop |
| Rotanı belirle | Plan your route |
| Sosyal | Community |
| Bireysel başla | Start on your own |
| Grupla | Group tour |
| Rehber (kişi) | Guide |
| Sesli rehber | Audio guide |
| Rozet | Badge |
| Misafir | Guest |
| Kuş uçuşu | As the crow flies |
| Yol tarifi | Directions |
| Durak bilgisi | Stop details |

- Sözlükte olmayan, birden fazla yerde geçen bir terim için karşılık seçersen uygulayıcı notunda listele.

**Kapsam dışı**

- `lib/routes.ts` rota anlatımları, `lib/places.ts` ve `lib/placeExtra.ts` durak içerikleri (G-006).
- Veri tabanından gelen kullanıcı içerikleri ve duyurular.
- Görsel tasarım değişikliği.

**Kabul ölçütleri**

- G-001 envanterindeki 15 sayfanın İngilizce sürümünde rota ve durak anlatımları dışında Türkçe arayüz metni kalmıyor. Denetimde rastgele seçilecek beş sayfada Türkçe arayüz metni çıkmamalı.
- Türkçe sayfalarda metinler önceki hâliyle aynı. Envanterdeki metinlerden hiçbiri kaybolmamış ya da değişmemiş (yazım hataları dahil, düzeltme bu görevin konusu değildir).
- İngilizce harita sayfasında yönlendirme yönergeleri ve mesafe biçimleri İngilizce.
- `tr.json` ve `en.json` aynı anahtarlara sahip. Eksik anahtarı yakalayan bir test ekle.
- HTTP durum kodları G-002'deki gibi (geçerli sayfalar 200, bilinmeyenler 404, yanlış dil yolları 307).
- `npm run build` ve mevcut testler geçiyor.
- Ekran görüntüleri: İngilizce `/en`, `/en/routes/frig-yolu-afyonkarahisar`, `/en/stops/ayazini`, `/en/map`, `/en/profile`, `/en/sign-in`, 390 px. WebP, en fazla 400 KB.

**Uygulayıcı notu**

- Başlangıçta git fetch yapıldı, yöneticinin hazırladığı codex/G-005-arayuz-cevirisi dalı ve 2c4e4a2 commit'i doğrulandı. Tüm öğrenme notları ve görev sözlüğü okundu.
- Proje sahibi planı genişleterek arayüzün yanında rota/durak içerikleri ve İngilizce seslendirmeyi, ilk ziyaret dil seçimini ve profilin en altında Dil ayarını açıkça onayladı. Bu onay önceki G-006 içerik ayrımına ve görsel kapsam sınırına göre öncelikli uygulandı. G-006 görev durumu yöneticiye bırakıldı.
- Türkçe özgün metinler korundu. 14 rota ve 86 durak için İngilizce karşılıklar messages/content/en.json dosyasına eklendi. 743 benzersiz içerik değeri işlendi. Yer adları, kimlikler, koordinatlar ve kaynak URL'leri korundu. lib/places.ts ve lib/placeExtra.ts değiştirilmedi. lib/routes.ts içinde yalnızca arayüz etiketlerinin mesajlara bağlanması değişti.
- messages/tr.json ve en.json, lib/content.ts ve i18n/useContent.ts üzerinden sayfa, kart, arama, filtre, harita, profil, form, rozet ve hata metinleri etkin dilde sunuluyor. Fotoğraf alt metinleri de çevrildi. Hukuki çevirilere istenen bağlayıcılık notu eklendi. Amerikan İngilizcesi kullanıldı. Ek ortak terimler docs/ekip/G-005-dogrulama.md dosyasında.
- app/actions.ts ve app/yonetim/actions.ts mevcut izin ve Result davranışını koruyarak isteğin dilinde hata döndürüyor. Gerçek misafir oturumunda geçersiz ad gönderilerek iki dilde sunucu yanıtı doğrulandı, bu denemede veri yazılmadı.
- Yazılı ve sesli navigasyon çevrildi. Sesli rehber İngilizce içerikle en-US, Türkçe içerikle tr-TR kullanıyor. Uygun ses seçiliyor, dil değişiminde eski kuyruk iptal ediliyor. Tarih, sayı, mesafe, süre ve çoğullar etkin dille biçimlendiriliyor.
- TR/EN düğmeleri üst menüden ve profilin üstünden kaldırıldı, öneri bandı kaldırıldı. Profilin altında Dil / Language ayarı var. İlk ziyarette seçim yapılır, ardından tanıtım gösterilir. NEXT_LOCALE hatırlanır. Dil bağlantılarında lang/hreflang bulunur, Türkçe bağlantı öneksizdir. Açık dil URL'lerinin davranışı ve localeDetection: false korundu.
- npm run build geçti. 236 çıktı ve 192 prerender rota korundu. 16 otomatik test, 30 sayfa HTTP kontrolü, 200/307/404, iki dilde gerçek misafir oturumu ve sunucu eylemi hata testi geçti. Playwright ile ilk seçim, tercih, profil ayarı, İngilizce ekranlar, İngilizce/Türkçe anlatım ve İngilizce harita yönergesinin ses API'sine gönderimi doğrulandı. Ses API'si, GPS ve OSRM testte taklit edildi, fiziksel cihazda işitsel dinleme yapılmadı.
- node tests/check-translations.cjs taramasında açıklamasız Türkçe arayüz dizgisi yok. Kalan 22 sonuç, dosya/satır ve gerekçeleriyle docs/ekip/G-005-dizgi-taramasi.md dosyasına yazıldı. Veri tabanından gelen kullanıcı adları, içerikleri ve duyurular çevrilmez. Kök PWA manifesti varsayılan Türkçe meta verisini kullanır.
- Önce/sonra toplam 27 WebP ekran, tam 390 ve 1280 px genişlikte. Telefon öykünmesi 390 × 844 ve dokunmatik. En büyük görsel 161.926 bayt, toplam 1.413.104 bayt. Bağlantılar doğrulama belgesinde.
- Yeni paket eklenmedi, package.json ve lock değişmedi. .env.local okunmadı ve commit edilmedi. G-004, oturum güvenliği davranışı ve veri tabanı şeması değiştirilmedi.
- Açık kalan doğrulama: kayıtlı kullanıcı ve yönetici hesabı olmadığından gerçek yorum paylaşımı ve yetkili yönetici veri işlemleri denenmedi. Mesajları ve hata dalları otomatik testle kontrol edildi. Önceki denetimdeki gerçek yorum testi birleştirme sonrası canlı kontrolüne bırakılmış durumda.

---

## G-006: Rota ve durak içeriğinin İngilizce çevirisi

- **Durum:** Taslak (ilk çeviri G-005'te yapıldı, yönetici denetimi ve proje sahibinin son okuması kaldı)
- **İş akışı:** D
- **Not:** Uygulayıcı ilk çeviriyi yapar, yönetici yer adlarını ve olgusal doğruluğu denetler, proje sahibi yayından önce son okumayı yapar. Yer adları özgün Türkçe yazımıyla korunur.

---

## G-007: Ana sayfa ve rota sayfasına hareket ve yumuşak kaydırma

- **Durum:** Uygulamada
- **İş akışı:** A (tasarım)
- **Dal:** `codex/G-007-hareket`
- **Amaç:** Ana sayfa ile rota ayrıntı sayfasını, yerleşimlerine dokunmadan, daha canlı ve özenli hissettirmek. Bu görevde yalnızca hareket eklenir. Görsel tasarım aynen kalır.

**Proje sahibinin kararları (değiştirilmez)**

- Yerleşim, bölüm sırası, renk, yazı karakteri, yazı boyu, boşluk, köşe ve gölge değerleri değişmez. Hiçbir öğe yer değiştirmez, eklenmez ya da kaldırılmaz.
- Paketler: `motion` (MIT) ve `lenis` (MIT). Eklenmeleri bu görev için onaylıdır. Güncel kararlı sürümler `package.json` içinde sabitlenir. Başka paket eklenmez. Commons Clause ya da ticari kullanımı kısıtlayan lisanslı kod (React Bits gibi) kullanılmaz.
- Kapsam yalnızca `/` ve `/rotalar/[slug]` sayfaları ile İngilizce karşılıklarıdır. Diğer sayfalar bu görevde değişmez.

**Yapılacaklar**

1. **Açılışta sıralı beliriş.** Sayfanın ilk ekranındaki öğeler (ana sayfada üst başlık alanı, arama, hava durumu, ilk bölüm başlığı, rota sayfasında kategori etiketi, başlık, özet satırı, düğmeler) yukarıdan aşağı sırayla belirir. Öğe başına 60 ms gecikme, 450 ms süre, en fazla 12 px dikey kayma ve saydamlık. Toplam açılış 800 ms'yi geçmez.
2. **Görünür alana girişte beliriş.** Rota kartları, rota listesi, durak listesi satırları ve bilgi kutuları ekrana ilk girdiklerinde bir kez belirir. Geri kaydırınca tekrar oynamaz. Yatay rota şeridinde yalnızca ilk görünen kartlar oynar.
3. **Fotoğrafta hafif paralaks.** Ana sayfadaki kale resmi ve rota sayfasındaki kapak fotoğrafı, sayfa kaydırılırken içeriğe göre daha yavaş hareket eder. Kayma en fazla görsel yüksekliğinin %15'i kadardır, görsel kenarlarında boşluk açılmaz. Yalnızca `transform` kullanılır.
4. **Basılma hissi.** Birincil ve ikincil düğmeler ile rota kartları basıldığında 0,97 ölçeğine iner ve bırakılınca yay hareketiyle döner. Masaüstünde fare üstüne gelince yalnızca imleç ve mevcut renk değişimi kalır, yeni bir efekt eklenmez.
5. **Yumuşak kaydırma (Lenis).** Yalnızca ince imleçli cihazlarda (`(pointer: fine)`) ve hareket azaltma tercihi kapalıyken açılır. Dokunmatik cihazlarda tarayıcının doğal kaydırması kullanılır. Harita alanları, yatay kaydırılan şeritler, açılır pencereler ve dil seçimi penceresi Lenis dışında tutulur (`data-lenis-prevent`). Sayfa değişiminde kaydırma en üste döner, bağlantı çapaları çalışmaya devam eder.
6. **Mevcut CSS animasyonlarıyla uyum.** `app/globals.css` içindeki `.page-in`, `.stagger` ve `rise` animasyonları bu iki sayfada yeni hareketlerle çift oynamamalı. Bu iki sayfada yeni sistem kullanılır, diğer sayfalardaki mevcut animasyonlar olduğu gibi kalır.
7. **Kod düzeni.** Sayfalar sunucu bileşeni olarak kalır. Hareket, `components/motion/` altında küçük istemci bileşenleriyle (örneğin `Reveal`, `Stagger`, `Parallax`, `Pressable`, `SmoothScroll`) sağlanır. Boyutu küçük tutmak için `LazyMotion` ve `domAnimation` kullanılır. Süre, gecikme ve eğri değerleri tek bir dosyada (`lib/motion.ts`) tanımlanır, bileşenlere sayı yazılmaz.

8. **Dil penceresi düzeltmesi (G-005 denetiminden).** İlk ziyaret dil penceresi (`components/LanguageChoice.tsx`) yalnızca öneksiz Türkçe kök sayfada (`/`) ve dil çerezi yokken açılır. `/en` ile başlayan bir adreste pencere açılmaz, `NEXT_LOCALE=en` sessizce yazılır. Rota (`/rotalar/...`, `/en/routes/...`), durak ve `/qr` adreslerine doğrudan gelen ziyaretçide ne dil penceresi ne de tanıtım (`components/Onboarding.tsx`) açılır, adresin dili çereze yazılır. Bu madde iki sayfa sınırının tek istisnasıdır, başka davranış değişmez.

**Erişilebilirlik ve performans**

- `prefers-reduced-motion: reduce` açıkken bütün hareketler kapanır, içerik doğrudan son hâliyle görünür. Paralaks ve Lenis devre dışı kalır.
- En büyük içerik öğesi olan görsel (ana sayfada kale resmi, rota sayfasında kapak) saydamlık animasyonuyla gizli başlamaz. Paralaks dışında bu görsele animasyon uygulanmaz.
- JavaScript yüklenmeden ya da çalışmadan da içerik görünür olmalıdır. Gizli başlayan öğe JavaScript yoksa görünmez kalmamalı.
- Yerleşim kayması (CLS) oluşmaz. Animasyonlar yalnızca `opacity` ve `transform` kullanır.
- Ana sayfanın ilk yüklemedeki JavaScript miktarı en fazla 40 kB (sıkıştırılmış) artabilir. `npm run build` çıktısındaki First Load JS değerleri önce ve sonra olarak not edilir.

**Kapsam dışı**

- Sayfalar arası geçiş animasyonu, başlığın harf harf açılması, iskelet ekranlar.
- Harita, durak, profil ve diğer sayfalar.
- Görsel tasarımda herhangi bir değişiklik.

**Kabul ölçütleri**

- Animasyonlar bittikten sonra alınan ekran görüntüleri, `main` dalındaki aynı sayfaların görüntüleriyle aynıdır. `/`, `/en`, `/rotalar/frig-yolu-afyonkarahisar`, `/en/routes/frig-yolu-afyonkarahisar` için 390 ve 1280 px genişlikte, piksel karşılaştırması yapılarak doğrulanır. Fark varsa nedeni yazılır.
- Hareket azaltma tercihi açık bir tarayıcı oturumunda hiçbir öğe hareket etmez ve içerik ilk karede görünür.
- Dokunmatik telefon öykünmesinde (390 × 844) Lenis etkin değildir, kaydırma doğaldır. Masaüstünde (1280 px) Lenis etkindir. Harita kutusu ve yatay şerit Lenis'ten etkilenmez.
- Lighthouse mobil ölçümü `/` ve `/rotalar/frig-yolu-afyonkarahisar` için önce ve sonra alınır. Performans puanı 3 puandan fazla düşmez, CLS 0,02'yi geçmez.
- HTTP durum kodları ve mevcut testler G-005'teki gibi geçer. `npm run build` hatasızdır.
- Kayıtlar: iki sayfanın 390 px ve 1280 px ekran kaydı (WebM ya da GIF, her biri en fazla 4 MB) ve hareket azaltma açıkken alınmış birer ekran görüntüsü (WebP, en fazla 400 KB). Dosyalar `docs/ekip/ekranlar/G-007/` altına.

**Uygulayıcı notu**

- Plan onayı bekleniyor. f97bb29 başındaki görev dalı origin'e gönderildi. G-005 denetimi ve öğrenme notu 4 okundu. Uygulama kodu değiştirilmedi.
- components/motion altında MotionProvider (LazyMotion/domAnimation), Reveal, Stagger, Parallax, Pressable ve SmoothScroll oluşturulacak. Değerler lib/motion.ts içinde tutulacak. Sunucu sayfaları, mevcut HTML yerleşimi ve görsel sınıflar korunacak. CSS animasyon çakışmaları yalnızca iki görev sayfasında giderilecek.
- Değişecek mevcut dosyalar: app/[locale]/(pages)/page.tsx, app/[locale]/rotalar/[slug]/page.tsx, components/route/StartPanel.tsx, components/route/RouteControls.tsx, components/LanguageChoice.tsx, components/Onboarding.tsx, app/globals.css, package.json ve package-lock.json. İlgili testler ve doğrulama belgeleri eklenecek. Yalnızca motion ve lenis kurulacak ve kararlı sürümleri sabitlenecek.
- Lenis yalnızca görev sayfalarında pointer:fine ve hareket azaltma kapalıyken çalışacak. Harita, yatay şeritler ve pencereler data-lenis-prevent ile dışarıda kalacak. JavaScript yokken içerik görünür, hareket azaltma açıkken doğrudan son görünüm sağlanacak.
- Madde 8: Pencere yalnızca gerçek pathname / ve dil çerezi yokken açılacak. /en adreslerinde sessizce en yazılacak. Doğrudan rota, durak ve QR girişlerinde adresin dili yazılıp pencere ve tanıtım engellenecek. Onboarding kendi URL denetimini yapacak, çerez yazım sırasına güvenilmeyecek. Türkçe kökte seçim sonrası tanıtım korunacak.
- Testler: main ile dört adresin 390/1280 px piksel karşılaştırması, JavaScript kapalı ve azaltılmış hareket, dokunmatik doğal kaydırma ve masaüstü Lenis, harita/şerit/pencere istisnaları, çapalar, build, First Load JS ve sıkıştırılmış yük farkı, mobil Lighthouse ve CLS, mevcut testler ve HTTP durumları. Dinamik veriler karşılaştırmalarda aynı tutulacak. WebM ve WebP çıktılar docs/ekip/ekranlar/G-007 altında tutulacak.
- Yöneticiye soru: Paralaksın kaydırma durduğunda farklı konumda kalması, her kaydırma konumunda main ile piksel eşitliğiyle çelişir. Kaydırma sırasında hareket edip durduğunda özgün konuma dönmesini öneriyorum. Bu yorum uygun mu? Onay gelmeden kod ve paket değişikliği yapılmayacak.
- Claude yönetici için erişilebilir bir sohbet bulunamadı. Plan bu notta ve sohbet yanıtında yöneticiye iletilmek üzere sunuldu.

- Plan onayı sonrası kararlar: Paralaks scrollY=0 konumunda sıfır olacak ve kaydırma konumuna bağlı kalacak, durunca geri dönmeyecek. Tam sayfa piksel karşılaştırması en üstte yapılacak, aşağıdaki ayrı karşılaştırmalarda paralaks görseli maskelenecek. Sunucuda initial={false} ile görünür çıktı seçildi, beliriş istemcide başlatılacak. JavaScript kapalı ekran eklenecek. Yol değişiminde lenis.scrollTo(0, {immediate:true}) uygulanacak, popstate geri dönüşünde önceki konum ayrıca korunup test edilecek. Doğrudan rota/durak/QR girişinde tanıtım kalıcı olarak tamamlanmış işaretlenecek, sonradan ana sayfaya geçince de açılmayacak. template.tsx kapsam dışı sayfalar için korunacak, /harita ve /profil önce/sonra karşılaştırılacak.

- Uygulama bulgusu: JavaScript kapalıyken main ana sayfası (pages)/loading.tsx sınırında iskelette kalıyor. Görevdeki görünür içerik şartı için yalnızca ana sayfa app/[locale]/page.tsx konumuna alınacak. URL, template.tsx ve diğer sayfaların yükleme sınırı korunacak. RouteMeta mevcut kategori span öğesine isteğe bağlı hareket sırası almak için değişiyor, ek yerleşim kutusu oluşmuyor.

- Yöneticiye açık soru: Son Lighthouse serisinde ana sayfa ortanca performansı 74 -> 67, rota 49 -> 49. Ana sayfada CLS üç ölçümde 0,020509 / 0 / 0, main tabanında 0 / 0,023253 / 0,023253. Ana sayfanın 3 puan sınırı ve tek ölçümde 0,02 CLS sınırı sağlanmıyor. Kayma mevcut WeatherCard iskeletinin içeriğe dönüşmesinde rota şeridinde oluşuyor, yerleşim ve yükseklik değerleri bu görevde değiştirilemez. Bu bulgular açık bırakılarak denetime gönderilsin mi, yoksa önce ek performans planı mı hazırlansın? Harita işaretçisinin tek karedeki dinamik raster farkı da ayrıca belgelenecek.

**Yönetici müdahalesi (15 Ekim 2026)**

Uygulayıcının kullanım limiti dolduğu için proje sahibi işin yönetici tarafından bitirilmesini istedi. Uygulayıcının commit edilmemiş çalışması önce olduğu gibi ayrı bir commit olarak kaydedildi, düzeltmeler ikinci commit'te yapıldı.

- Titreme giderildi. Açılıştaki sıralı beliriş (`data-enter`) artık `app/globals.css` içindeki `motion-enter` CSS animasyonuyla ilk karede başlıyor. Ölçüm: dört sayfa ve iki genişlikte, ilk ekrandaki hareketli öğelerin opaklığı hiçbir karede düşmüyor.
- Kaydırmayla beliren öğeler (`data-reveal` ve `data-motion-list` çocukları) yalnızca `<head>` içindeki küçük betik `html[data-motion="on"]` yazdığında gizli başlıyor. Bu betik hareket azaltma açıkken çalışmıyor. Sayfa 4 saniye içinde hidrasyon olmazsa öznitelik kaldırılıyor ve içerik görünür kalıyor. Gösterilen öğe `data-shown` ile işaretleniyor. Listeye sonradan eklenen öğeler doğrudan görünür.
- `MotionProvider` içindeki `LazyMotion` ve `m.main` kaldırıldı. Hareketler zaten `motion/react-mini` ile yapıldığı için bu çalışma zamanına gerek yoktu. İlk yükleme JavaScript'i main'e göre ana sayfada 210 kB'tan 218 kB'a, rota sayfasında 142 kB'tan 150 kB'a çıktı (sıkıştırılmamış). `components/motion/features.ts` silindi.
- Test betiklerindeki sabit Chrome yolu `CHROME_PATH` ortam değişkeniyle değiştirilebilir oldu. `motion-capture.cjs` tam sayfa görüntüden önce sayfayı iki aşamada da aynı biçimde kaydırıyor, böylece kaydırmayla beliren öğeler karşılaştırmaya dahil oluyor.
- Piksel karşılaştırması (sabit hava durumu ve boş harita stiliyle): 12 görüntünün 10'unda fark 0 piksel. 390 px rota sayfalarındaki 4.018 ve 2.977 piksellik fark yalnızca harita işaretçilerinin rasterleştirilmesinde, uygulayıcının da belirttiği dinamik fark.
- Lighthouse mobil, aynı ortamda beşer ölçüm, ortanca: ana sayfa main 59, G-007 65. Rota main 40, G-007 40. Ana sayfadaki CLS her iki sürümde de hava durumu kartının iskeletten içeriğe geçmesinden kaynaklanıyor (main 0,021 ile 0,077 arası, G-007 0 ile 0,082 arası). Bu kayma görev kapsamı dışında, ayrı görev olarak açılacak.
- `tests/browser-motion.cjs` geçti. `npm run build`, `tests/i18n.test.cjs` ve `tests/check-translations.cjs` geçti. HTTP durum kodları değişmedi.
- Ekran kayıtları ve görüntüler düzeltilmiş sürümle yeniden alındı. `tmp-g007/` git dışında bırakıldı.
