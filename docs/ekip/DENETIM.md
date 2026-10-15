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

_(Henüz kayıt yok.)_
