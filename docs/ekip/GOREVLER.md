# Görevler

Durumlar: **Taslak** (henüz tanımlanıyor), **Hazır** (uygulanabilir), **Uygulamada**, **İncelemede**, **Değişiklik istendi**, **Onaylandı** (proje sahibinin birleştirme onayını bekliyor), **Tamamlandı**.

Görevleri yalnızca yönetici yazar. Uygulayıcı yalnızca "Durum" ve "Uygulayıcı notu" alanlarını değiştirir.

---

## G-001: Metin ve sayfa envanteri

- **Durum:** İncelemede
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

- 15 Ekim 2026: ekip/kurulum dalındaki 5501bb2 commit’inden codex/G-001-metin-envanteri dalı açıldı.
- Yapılanlar: docs/ekip/envanter.md oluşturuldu. 15 sayfa, 47 dosyada 603 sabit metin satırı, içerik kayıtları ve metin alanı sayıları, tarih, saat, sayı ve mesafe biçimlendirmeleri belgelendi.
- Değişen dosyalar: docs/ekip/envanter.md, docs/ekip/ekran/G-001/ altındaki 30 PNG ve bu görevin Durum ile Uygulayıcı notu alanları. Kod dosyaları, paket listesi ve kilit dosyası değiştirilmedi.
- Test: mevcut paketler npm ci ile kuruldu. npm run build gerekli ağ ve çıktı dizini izniyle hatasız tamamlandı, tür denetimi geçti ve 120 statik çıktı üretildi. İlk sandbox denemesi Google Fonts erişimi ve çıktı dizini izninde başarısız olmuştu.
- Ekranlar: başarılı build’in localhost:3000 sunucusunda tarayıcı otomasyonuyla, 390 × 844 ve 1280 × 900 CSS piksel viewport’larda tam sayfa çekildi. Tarayıcı çıktısı ölçeklenmeden PNG olarak kodlandı. Dosya adları viewport genişliğini gösterir, yakalama motorunun raster ölçüsü farklı olabilir. Dinamik örnekler /rotalar/frig-yolu-afyonkarahisar ve /duraklar/ayazini olarak kullanıldı.
- /profil için /giris sayfasındaki Misafir olarak devam et düğmesiyle giriş yapıldı. /yonetim misafir oturumunda Kurulum gerekli ekranını gösterdi. Kod bu mesajı is_admin çağrısı hata döndüğünde gösteriyor, tabloların eksikliği ayrıca doğrulanmadı.
- Soru: Yönetimin Yetkiniz yok ekranını da doğrulamak için gerekli Supabase kurulum kontrolü ayrı bir görev olarak açılacak mı? Bu görevde kurulum veya yetki değişikliği yapılmadı.
- QR ekranında Kamera açılıyor… mesajı kaldı ve kamera görüntüsü alınamadı. Elle kod alanı belgelendi, kamera erişimi etkinleştirilmedi. Tarayıcı otomasyonu kullanılabildi, başka yakalama yöntemine geçilmedi.
- .env.local git dışında kaldı, içeriği okunmadı ve notlara eklenmedi. Mevcut noktalı virgüllü metinler ve küçük dokunma hedefleri yalnızca kaydedildi.
- Teslim: dal GitHub’a gönderildi. [PR #1](https://github.com/Smookhe4d/afyon-sehir-rotasi-/pull/1) main hedefiyle açıldı. Görev teslimi b6c6fa1 commit’indedir, bu güncelleme denetim durumunu kaydeder. main karşılaştırması, görev dalının açıldığı ekip/kurulum dalındaki iki kurulum commit’ini de içerir. main dalına commit, push veya birleştirme yapılmadı.

---

## G-002: Dil desteği altyapısı (Türkçe ve İngilizce)

- **Durum:** Taslak
- **İş akışı:** D
- **Not:** G-001 envanteri tamamlandıktan sonra yönetici tarafından ayrıntılandırılacak. Kütüphane seçimi ve adres yapısı (`/en` öneki) proje sahibine sunulacak.

## G-003: Tasarım araştırması ve tasarım ilkeleri belgesi

- **Durum:** Taslak
- **İş akışı:** A
- **Not:** Bu görevi yönetici yürütür. Örnek destinasyon ve müze uygulamaları ile harita arayüzleri incelenip `docs/ekip/tasarim-ilkeleri.md` hazırlanacak. Proje sahibinin onayından sonra bileşen görevleri yazılacak.
