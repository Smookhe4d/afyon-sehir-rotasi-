# Denetim kayıtları

Bu dosyayı yönetici (Claude) yazar. Her pull request için bir kayıt açılır. En yeni kayıt en üstte yer alır.

## Denetim ölçütleri

1. **Kapsam:** Yalnızca görevde istenen değişiklik yapılmış mı, kapsam dışına çıkılmış mı?
2. **Doğruluk:** `npm run build` geçiyor mu, mevcut özellikler (harita, sesli rehber, grup turu, QR, rozet, sosyal alan, oturum) çalışıyor mu?
3. **Tasarım:** Belirteçler kullanılmış mı, 390 px ve 1280 px görünümler düzgün mü, dokunma hedefleri yeterli mi?
4. **Erişilebilirlik:** Anlamlı HTML, alternatif metin, klavye kullanımı, renk karşıtlığı.
5. **Metin:** Yazım kuralları (noktalı virgül ve uzun tire yok, abartılı dil yok), içerik doğruluğu, uydurma bilgi yok.
6. **Kod niteliği:** Okunabilirlik, tekrar, gereksiz paket, tür güvenliği.

## Kayıt biçimi

```
### G-<numara>: <başlık> (PR #<numara>), <tarih>
Sonuç: Onaylandı | Değişiklik istendi
Güçlü yönler:
- ...
İstenen değişiklikler:
- [ ] <dosya:satır> Ne değişmeli. Neden: <ilke ya da gerekçe>.
Öğrenme notu: <bir sonraki görevlerde de uygulanacak genel ders>
```

"Öğrenme notu" alanına yazılan dersler kalıcıdır. Uygulayıcı yeni bir göreve başlamadan önce bu notları okur.

---

### G-007: Ana sayfa ve rota sayfasına hareket (yönetici tamamladı), 15 Ekim 2026
Sonuç: Yönetici düzeltmeleriyle onaya sunuldu.

Uygulayıcının işinde güçlü yönler:
- Plan aşamasında piksel eşitliği ile paralaks arasındaki çelişkiyi fark edip kod yazmadan sordu.
- Dil penceresi düzeltmesi eksiksiz. Doğrudan rota, durak ve QR girişlerinde pencere ve tanıtım açılmıyor, adresin dili çereze yazılıyor.
- Lenis yalnızca ince imleçli cihazlarda ve dinamik içe aktarmayla yükleniyor. Geri tuşunda kaydırma konumu korunuyor.
- Lighthouse ve CLS sonuçlarını olduğu gibi raporlayıp karar için durdu. Doğru davranış.

Bulunan hata ve düzeltme:
- Sunucu çıktısı görünür gönderilip beliriş istemcide başlatıldığı için ilk ekrandaki öğeler önce görünüp yaklaşık 470. milisaniyede kayboluyor, sonra yeniden beliriyordu. Bu yolu yönetici önermişti, sorumluluk yönetimde. Ayrıntılar G-007 uygulayıcı notunun "Yönetici müdahalesi" bölümünde.

Öğrenme notları:
5. **Hidrasyonla başlayan animasyon:** Sunucunun gönderdiği ve ilk karede görünen bir öğeye JavaScript ile "görünmezden görünüre" animasyonu uygulanmaz, çünkü öğe önce görünür sonra kaybolur. İlk ekrandaki giriş animasyonu CSS ile ilk karede başlatılır. Gizli başlaması gereken öğeler yalnızca JavaScript'in çalıştığı kesinleştiğinde, boyamadan önce çalışan bir işaretle gizlenir.
6. **Taşınabilir test:** Test betiklerine kişisel bilgisayar yolu yazılmaz. Tarayıcı ve paket yolları ortam değişkeniyle verilir, varsayılan değer yalnızca son çaredir.
7. **Ölçüm önce:** Bir animasyonun doğruluğu ekran görüntüsüyle değil kare kare ölçümle doğrulanır. Örneğin opaklığın hiçbir karede düşmediğini gösteren bir ölçüm.

---

### G-005: Arayüz ve içerik çevirisi, İngilizce ses, ilk dil seçimi (PR #3), 15 Ekim 2026
Sonuç: Onaylandı. Proje sahibi birleştirdi.

Denetimde yapılanlar:
- `npm ci` ve `npm run build` geçti. `tests/i18n.test.cjs` ve `tests/check-translations.cjs` geçti.
- 28 adres denendi. Geçerli sayfalar 200, bilinmeyen sayfa, rota ve durak 404, yanlış dil yolları (`/en/rotalar`, `/tr/rotalar`) 307 döndü.
- `/en`, `/en/routes/frig-yolu-afyonkarahisar`, `/en/stops/ulu-cami`, `/en/map`, `/en/plan-your-route`, `/en/profile` 390 px telefon öykünmesinde incelendi. Arayüzde Türkçe kalan tek şey yer adları, bu da kurala uygun.
- `hreflang` bağlantıları (tr, en, x-default) ve `<html lang>` doğru.
- Ulu Cami içeriğindeki UNESCO bilgisi iki dilde de doğru: 2023'te Dünya Mirası Listesi'ne alındı.
- Türkçe sayfalar önceki hâliyle aynı.

Güçlü yönler:
- Kapsam genişlemesi proje sahibinin açık onayıyla yapıldı ve uygulayıcı notunda kaydedildi. Bu doğru yöntem.
- Kalan Türkçe dizgiler gerekçeleriyle ayrı bir belgeye yazıldı.
- Sesli rehberin dil değişiminde eski kuyruğu iptal etmesi gibi kenar durumları düşünülmüş.

Sonraki göreve aktarılan düzeltme:
- [ ] İlk ziyaret dil penceresi, adres dili zaten belli ederken de (`/en/...`) açılıyor. QR ile rotaya gelen yeni ziyaretçi rotayı görmeden önce dil penceresi ve üç adımlı tanıtımı geçmek zorunda kalıyor. Proje sahibinin onayıyla G-007'nin 8. maddesine eklendi.

Açık kalan doğrulama:
- Kayıtlı kullanıcıyla yorum paylaşımı ve yönetici veri işlemleri denenmedi. Canlı sitede kontrol edilecek.
- Durak adlarındaki "Ören Yeri", "Kalesi" gibi ortak adlar İngilizcede açıklamasız kaldı. İçerik son okumasında (G-006) ele alınacak.

Öğrenme notu:
4. **Kapsam genişlerse:** Proje sahibi doğrudan ek iş onayladığında bunu bu görevde yaptığın gibi uygulayıcı notuna yaz ve yöneticiye bildir. Görev tanımındaki "kapsam dışı" maddeleri o zaman güncellenir.

---

### G-002: Dil desteği altyapısı (PR #2), ikinci inceleme, 15 Ekim 2026
Sonuç: Onaylandı

- Bilinmeyen adresler ile olmayan rota ve duraklar iki dilde de HTTP 404 dönüyor (/yok-boyle, /en/nope, /rotalar/olmayan, /duraklar/olmayan, /en/routes/olmayan, /en/stops/olmayan). Geçerli sayfalar 200, yanlış dil yolları 307 dönüyor.
- Türkçe dil bağlantısı doğrudan öneksiz adrese gidiyor.
- `npx npm@10 ci` ve `npm run build` temiz ortamda geçiyor.
- Yeniden test edildi: misafir oturumu iki dilde korunuyor, dil seçici gidiş ve dönüşte aynı rotada kalıyor, QR okuyucu eski ve yeni adresleri açıyor, bant davranışı değişmedi.
- Küçük not (G-005'te düzeltilecek): Dil bağlantısındaki `hreflang="en"` özniteliği bu düzeltmede kaldırılmış. Karşı dile giden bağlantılarda `hreflang` ve `lang` öznitelikleri bulunmalı (ekran okuyucular bağlantı metnini doğru dilde okur).
- Birleştirme proje sahibinin onayını bekliyor. Yöntem: "Squash and merge".

Öğrenme notu: Bir düzeltme yaparken aynı bileşendeki çalışan özellikleri koru. Değişiklikten önce ve sonra bileşenin çıktısını karşılaştır.

---

### G-002: Dil desteği altyapısı (PR #2), 15 Ekim 2026
Sonuç: Değişiklik istendi
Güçlü yönler:
- 30 adresin tamamı doğru dille açılıyor, yanlış yollar doğru adrese yönleniyor.
- Supabase oturumu dil geçişlerinde korunuyor. Middleware birleştirmesi doğru kurulmuş.
- Dil seçici rota sayfasında karşı dildeki aynı sayfaya gidip dönüyor, NEXT_LOCALE hatırlanıyor.
- QR okuyucu eski /rotalar ve yeni /en/routes adreslerini kabul ediyor.
- Bant yalnızca İngilizce tarayıcıda çıkıyor, kapatma hatırlanıyor, CLS artmıyor.
- Statik üretim korunmuş. hreflang, canonical ve 218 adresli sitemap doğru. Vercel önizlemesi başarılı.
İstenen değişiklikler:
- [ ] Bilinmeyen adresler (/yok-boyle, /en/nope) 404 sayfasını gösteriyor ama HTTP 200 dönüyor. Canlı sitede 404 dönüyor, bu bir gerileme. Neden: [locale]/loading.tsx Suspense sınırı yanıtı akışa çeviriyor ve notFound() durum kodunu değiştiremiyor. Bilinmeyen adresler ve olmayan rota/durak (/rotalar/olmayan, /en/stops/olmayan) HTTP 404 dönmeli. Çözümü sen seç (ör. yükleme sınırını bir route group içine almak ve [...rest]'i dışında bırakmak, dinamik sayfalarda dynamicParams=false). curl -I ile dört adresi teslim notunda göster.
- [ ] Dil seçicideki Türkçe bağlantı /tr/... adresine gidip 307 ile yönleniyor. Doğrudan öneksiz Türkçe adrese bağlanmalı.
- [ ] npm 10.9 ile "npm ci" lock dosyası uyumsuz hatası veriyor (@swc/helpers@0.5.23 eksik). Lock dosyasını npm 10 ile de "npm ci" geçecek biçimde güncelle, "npx npm@10 ci" ile doğrula.
Ertelenen: Telefonda dil seçici yalnızca /profil sayfasında. Görev tanımındaki eksiklik, G-003 tasarım çalışmasında ele alınacak.
Doğrulanamayan: Kayıtlı kullanıcıyla yorumun İngilizce sayfada hemen görünmesi. Kod incelemesinde revalidateLocalizedPath dört yolu da yeniliyor. Birleştirme sonrası canlıda denenecek.
Öğrenme notu: Sayfa dosya yapısını değiştiren görevlerde yalnızca ekranı değil HTTP durum kodlarını da test et (200, 307, 404). Görünüşü doğru olan bir sayfa yanlış durum kodu dönebilir.

---

### G-001: Metin ve sayfa envanteri (PR #1), ikinci inceleme, 15 Ekim 2026
Sonuç: Onaylandı

- İstenen değişiklik yapıldı. 30 görsel WebP, en büyüğü 205 KB, toplam 2 MB. Bağlantıların tamamı çalışıyor, PNG kalmadı.
- Değişiklik yalnızca görsellere, `envanter.md` bağlantılarına ve görev durumuna dokunuyor.
- Birleştirme proje sahibinin onayını bekliyor. Yöntem: "Squash and merge".

---

### G-001: Metin ve sayfa envanteri (PR #1), 15 Ekim 2026
Sonuç: Değişiklik istendi (tek madde, küçük)

Güçlü yönler:
- Kapsamın dışına çıkılmadı. Kod, paket ve kilit dosyalarında değişiklik yok. `.env.local` git dışında kaldı.
- Envanter eksiksiz. Rastgele seçilen beş bileşende ve harita bileşeninde tabloda olmayan kullanıcı metni çıkmadı.
- Biçimlendirme tablosu ve "başka dosyalardan gelen metinler" bölümü, dil desteği görevinin doğrudan girdisi olacak nitelikte.
- Kapsam dışı sorunlar düzeltilmeden not edildi. Yönetim sayfasındaki "Kurulum gerekli" ekranı ve `getSession` uyarısı gerçek sorunlar. Bunlar için G-004 açıldı.
- Belirsiz noktalar varsayımla çözülmeden soru olarak yazıldı.

İstenen değişiklikler:
- [ ] `docs/ekip/ekran/G-001/` Görsellerin toplam boyutu 18 MB. Her görseli WebP (kalite 80) ya da JPEG (kalite 80) biçimine çevir, her biri 400 KB'ı geçmesin. Gerekirse 1280 px görüntülerde sayfanın yalnızca ilk 3 ekran yüksekliğini tut. `envanter.md` içindeki bağlantıları yeni dosya adlarına göre güncelle, PNG dosyalarını kaldır. Neden: Git, eklenen her görseli geçmişte kalıcı olarak saklar. Her görevde ekran görüntüsü alınacağı için depo kısa sürede şişer ve klonlama yavaşlar.

Öğrenme notları (sonraki tüm görevlerde geçerli):
1. **Ekran görüntüsü boyutu:** Görseller WebP ya da JPEG olarak kaydedilir, her biri en fazla 400 KB olur.
2. **Görüntü genişliği:** 390 px istenen görüntüler 375 px, 1280 px istenenler 1264 px çıktı (kaydırma çubuğu payı). Telefon görüntüsünü mobil cihaz öykünmesiyle (390 x 844, dokunmatik, kaydırma çubuğu yok) al. Görselin genişliği istenen değerle tam eşleşmeli. Bu görevde yeniden çekim gerekmiyor.
3. **Kapsam dışı gözlemler:** Bu görevde yaptığın gibi düzeltmeden, dosya ve satır vererek yaz. Bu yaklaşım sürdürülecek.

Yönetici yanıtları:
- Yönetim kurulumu ve oturum doğrulaması (`getUser`) G-004 olarak açıldı. Supabase tarafını yönetici kontrol edecek, sen bu görevde bir şey yapma.
- QR ekranında kamera görüntüsünün alınamaması beklenen bir durum. Ek işlem gerekmiyor.
- Birleştirme sırasında "Squash and merge" kullanılacak. Böylece eski PNG dosyaları `main` geçmişine girmeyecek.

---

