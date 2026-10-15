# Görevler

Durumlar: **Taslak** (henüz tanımlanıyor), **Hazır** (uygulanabilir), **Uygulamada**, **İncelemede**, **Değişiklik istendi**, **Onaylandı** (proje sahibinin birleştirme onayını bekliyor), **Tamamlandı**.

Görevleri yalnızca yönetici yazar. Uygulayıcı yalnızca "Durum" ve "Uygulayıcı notu" alanlarını değiştirir.

---

## G-001: Metin ve sayfa envanteri

- **Durum:** Hazır
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

_(Uygulayıcı dolduracak)_

---

## G-002: Dil desteği altyapısı (Türkçe ve İngilizce)

- **Durum:** Taslak
- **İş akışı:** D
- **Not:** G-001 envanteri tamamlandıktan sonra yönetici tarafından ayrıntılandırılacak. Kütüphane seçimi ve adres yapısı (`/en` öneki) proje sahibine sunulacak.

## G-003: Tasarım araştırması ve tasarım ilkeleri belgesi

- **Durum:** Taslak
- **İş akışı:** A
- **Not:** Bu görevi yönetici yürütür. Örnek destinasyon ve müze uygulamaları ile harita arayüzleri incelenip `docs/ekip/tasarim-ilkeleri.md` hazırlanacak. Proje sahibinin onayından sonra bileşen görevleri yazılacak.
