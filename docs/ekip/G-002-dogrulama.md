# G-002 doğrulama ve teslim kaydı

## Uygulama

15 sayfa app/[locale] altına taşındı. next-intl 4.14.9 sabitlendi, localeDetection: false kullanıldı. Türkçe adresler ve basılı QR bağlantıları korundu. İngilizce adresler görevdeki eşlemeyle eklendi.

i18n altında gezinme, mesaj yükleme, meta veri ve iki dilde önbellek yenileme yardımcıları bulunuyor. Middleware oturum çerezlerini ve dil başlıklarını koruyor. Mevcut getSession davranışı değişmedi. G-004'e dokunulmadı.

Ortak bileşenlerin kendi metinleri iki mesaj dosyasına taşındı. PageHeader'a sayfalardan gelen başlıklar ve diğer kapsam dışı metinler onay doğrultusunda G-005 ve G-006'ya bırakıldı.

## Kontroller

- Başlangıçta npm run build başarılı: 120 üretilen çıktı ve 99 önceden üretilmiş rota.
- Son üretim build'i başarılı: 236 çıktı ve 192 önceden üretilmiş rota. Aynı next build komutu açık test oturumunu bozmamak için geçici ayrı çıktı diziniyle çalıştırıldı. Geçici yapılandırma depoya alınmadı.
- Önceki statik rotaların tamamının karşılığı son prerender manifestinde var. Statik üretim kaybı yok.
- `node --test tests/i18n.test.cjs`: 11 test geçti. Adres dönüşümü, sorgu ve grup kodları, güvenli dönüş adresi, eski ve yeni QR, biçimlendirme, eksik İngilizce mesajın Türkçe yedeği, callback, çıkış, middleware çerez aktarımı ve yorumun iki dili yenilemesi kontrol edildi. Supabase ve cache bu testlerde taklit edildi.
- `node tests/check-local.cjs http://127.0.0.1:3001`: iki dilde 30 sayfa, lang, hreflang, Open Graph locale, sitemap, 404 ve otomatik yönlendirme yapılmaması kontrol edildi.
- `node tests/browser-i18n.cjs`: Playwright ve mevcut Chrome ile en-US dili, dokunmatik 390 px cihaz, öneri bandı, kapatma tercihinin hatırlanması, içerik konumunun sabit kalması, dinamik rota dil değişimi ve sorgu/grup kodunun korunması doğrulandı. Yeni test bağımlılığı eklenmedi.
- `node tests/browser-auth.cjs http://localhost:3001`: gerçek Supabase misafir girişi ve yenilemede oturumun korunması iki dilde geçti. İngilizce profilde TR ve EN geçişlerinde oturum korundu. Çıkış her dilin giriş sayfasına döndü. Oturum anahtarı kaydedilmedi.

## İç bağlantı taraması

`rg -n 'from "next/link"|from "next/navigation"|<a href="/|revalidatePath\(' app components i18n` ile kontrol edildi.

- app ve components altında doğrudan next/link importu ve sabit iç adrese giden a etiketi kalmadı. Gezinme i18n/navigation üzerinden geçiyor.
- Tek next/link kullanımı i18n/navigation.tsx içindeki RootLink dışa aktarımıdır. Locale sağlayıcısı olmayan kök Türkçe 404 yedeği içindir.
- next/navigation kullanımları notFound, useParams, useSearchParams ve analitik için gerçek URL'yi okuyan yardımcıdır. Router gezinmesi dile duyarlıdır.
- Doğrudan revalidatePath yalnızca i18n/revalidate.ts yardımcısında bulunuyor.
- /rotalar gibi kanonik Türkçe sabitler dile duyarlı Link ve router tarafından dönüştürülüyor. Dil bağımsız /auth uçları ve basılı QR uyumluluğu korunuyor.

## Açık kalan doğrulama

Proje sahibi test hesabı olmadığını bildirdi. İngilizce rota sayfasında kayıtlı hesapla yorum ekleyip anında göründüğünü gerçek Supabase oturumunda doğrulamak mümkün olmadı. Hesap oluşturulmadı. Yorum eyleminin iki dilde önbellek yenilemesi otomatik testte doğrulandı. Gerçek kullanıcı testi tamamlandı olarak gösterilmiyor. OAuth veya e-posta callback'i de hesap gerektirdiğinden işlev testiyle kontrol edildi.

## Ekranlar

13 WebP görselin tamamı tam 390 veya 1280 px genişliğinde ve tek tek 400 KB altında. Toplam 752.838 bayt, en büyük görsel 120.036 bayt.

| Sayfa | Önce 390 | Önce 1280 | Sonra 390 | Sonra 1280 |
|---|---|---|---|---|
| Türkçe ana sayfa | [Görsel](ekran/G-002/once-ana-tr-390.webp) | [Görsel](ekran/G-002/once-ana-tr-1280.webp) | [Görsel](ekran/G-002/sonra-ana-tr-390.webp) | [Görsel](ekran/G-002/sonra-ana-tr-1280.webp) |
| Türkçe rota | [Görsel](ekran/G-002/once-rota-tr-390.webp) | [Görsel](ekran/G-002/once-rota-tr-1280.webp) | [Görsel](ekran/G-002/sonra-rota-tr-390.webp) | [Görsel](ekran/G-002/sonra-rota-tr-1280.webp) |
| İngilizce ana sayfa | Yok | Yok | [Görsel](ekran/G-002/sonra-ana-en-390.webp) | [Görsel](ekran/G-002/sonra-ana-en-1280.webp) |
| İngilizce rota | Yok | Yok | [Görsel](ekran/G-002/sonra-rota-en-390.webp) | [Görsel](ekran/G-002/sonra-rota-en-1280.webp) |

[Dil önerisi bulunan Türkçe ana sayfa, 390 px](ekran/G-002/sonra-ana-tr-bant-390.webp)
