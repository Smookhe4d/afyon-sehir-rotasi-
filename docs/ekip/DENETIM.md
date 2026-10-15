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

