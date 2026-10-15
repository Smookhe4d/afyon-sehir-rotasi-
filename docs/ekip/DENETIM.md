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

