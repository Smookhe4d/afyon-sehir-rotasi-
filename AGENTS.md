# AGENTS.md: Afyon Şehir Rotası çalışma kuralları

Bu dosya, depoda çalışan yapay zekâ ajanları (ChatGPT/Codex) için yazılmıştır. Her oturumun başında okunmalıdır.

## Roller

- **Proje sahibi:** Harun Özbey. Son kararı verir. Canlı siteye geçiş yalnızca onun onayıyla yapılır.
- **Yönetici ve denetçi:** Claude. Görevleri yazar, her değişikliği kod ve ekran görüntüsüyle denetler, gerektiğinde müdahale eder ve nedenini açıklar.
- **Uygulayıcı:** ChatGPT (Codex). Görevleri uygular, denetim notlarına göre düzeltir.

Uygulayıcı, kendisine verilmemiş bir işe başlamaz. Bir görevde belirsizlik ya da daha iyi bir yol görürse kodu değiştirmeden önce bunu görevin "Uygulayıcı notu" alanına yazar.

## Proje

Afyonkarahisar Turizm Master ve Eylem Planı'ndaki 14 tur rotasını ziyaretçiye sunan web uygulaması. Canlı adres: https://afyon-sehir-rotasi.vercel.app

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- Supabase (oturum, sosyal alan, geri bildirim). Şema: `supabase/schema.sql`
- Harita: MapLibre GL + OpenFreeMap. Stil `lib/map/style.ts`. Güzergâhlar `lib/routeGeo.ts`. Yönlendirme `lib/map/nav.ts` (OSRM, routing.openstreetmap.de)
- İçerik: rotalar `lib/routes.ts`, duraklar `lib/places.ts` ve `lib/placeExtra.ts`, rozetler `lib/badges.ts`
- Tasarım belirteçleri: `app/globals.css` içindeki `@theme` bloğu
- Mobil uygulama aşamasına geçilmedi. Yalnızca web sürümü geliştirilir.

## Komutlar

```
npm install
npm run dev      # http://localhost:3000
npm run build    # her teslimden önce hatasız geçmeli
```

`.env.local` depoda yoktur. Gerekli değişkenler: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Bu dosya asla commit edilmez.

## Çalışma akışı

1. `docs/ekip/GOREVLER.md` dosyasında durumu **Hazır** olan ilk görevi al, durumunu **Uygulamada** yap.
2. Güncel `main` dalından görev dalı aç: `codex/G-<numara>-<kisa-ad>` (örnek `codex/G-001-metin-envanteri`).
3. Yalnızca görevin kapsamındaki dosyaları değiştir. Kapsam dışı bir sorun görürsen düzeltme, görev notuna yaz.
4. `npm run build` çalıştır. Arayüz değiştiyse 390 px (telefon) ve 1280 px (masaüstü) genişlikte önce ve sonra ekran görüntüsü al, `docs/ekip/ekran/G-<numara>/` altına koy.
5. Görevin "Uygulayıcı notu" alanını doldur: ne yapıldı, hangi dosyalar değişti, nasıl test edildi, açık kalan sorular.
6. Dalı gönder ve `main`e pull request aç. Durumu **İncelemede** yap.
7. Denetim sonucu `docs/ekip/DENETIM.md` dosyasına yazılır. **Değişiklik istendi** ise aynı dalda düzelt. **Onaylandı** ise birleştirme proje sahibinin onayını bekler.

`main` dalına doğrudan commit ya da push yapılmaz. `main`e giren her şey Vercel'de hemen yayına girer.

## Kod kuralları

- Yeni bir paket eklemeden önce görev notunda gerekçesini yaz ve onay bekle.
- Renk, yazı tipi, boşluk ve gölge değerleri doğrudan bileşene yazılmaz, `app/globals.css` belirteçlerinden alınır.
- Mobil öncelikli tasarla. Dokunma hedefleri en az 44 px olmalı.
- Erişilebilirlik: anlamlı HTML, görsellerde alternatif metin, klavyeyle kullanım, yeterli renk karşıtlığı (WCAG AA).
- Kullanıcıya görünen metinler bileşenlere gömülmez. Dil desteği kurulduktan sonra çeviri dosyalarına yazılır.
- Mevcut çalışan özelliği (sesli rehber, grup turu, QR, rozet, sosyal alan, oturum) bozacak değişiklik yapılmaz.

## İçerik kuralları

- Rotalar ve duraklar Master ve Eylem Planı'na dayanır. Tarihî bilgi, tarih, ölçü ya da kaynak uydurulmaz. Emin olunmayan bilgi eklenmez, görev notunda sorulur.
- Türkçe metinlerde cümle içinde noktalı virgül (;) kullanılmaz. Uzun tire (—) kullanılmaz. Resmî ama sade bir dil kullanılır.
- Yapay zekâ metni izlenimi veren abartılı ve reklam dili kullanılmaz ("eşsiz", "büyüleyici yolculuk", "keşfetmeye hazır mısınız" gibi).
- İngilizce metinler Türkçenin birebir çevirisi değil, doğal İngilizce olmalıdır. Yer adları özgün Türkçe yazımıyla korunur.

## Commit mesajları

Türkçe ve kısa: `G-001: metin envanteri çıkarıldı`. Bir commit tek bir mantıksal değişiklik içerir.
