# G-005 kalan Türkçe dizgi taraması

`node tests/check-translations.cjs` ile app ve components altındaki metin ve şablon dizgileri, JSX metinleri, düzenli ifadeler ve kod açıklamaları kontrol edildi. Açıklamasız kullanıcı metni bulunmadı.

| Dosya ve satır | Kalan değer | Gerekçe |
|---|---|---|
| `components/Announcements.tsx:4` | // Çerez kullanmadan REST ile okunur; sayfa statik kalır, 5 dakikada bir tazelenir. Tablo yoksa sessizce boş döner. | Kod açıklaması, kullanıcı metni değil |
| `components/AudioGuide.tsx:15` | /premium\|enhanced\|gelişmiş/ | Kod içi eşleştirme, kullanıcı metni değil |
| `components/AudioGuide.tsx:9` | /** Cihazdaki en doğal Türkçe sesi seçer: "Natural/Neural/Online/Enhanced/Google" etiketli sesler öne geçer. */ | Kod açıklaması, kullanıcı metni değil |
| `components/AudioGuide.tsx:49` | // Cümleleri ayrı okutmak hem uzun metinlerde kesilmeyi önler hem de doğal duraklar verir. | Kod açıklaması, kullanıcı metni değil |
| `components/auth/AuthForm.tsx:35` | // Google düğmesi yalnızca Supabase'de sağlayıcı etkinse gösterilir | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:21` | /** Tüm duraklar: çizgi yok, yakın duraklar kümelenir */ | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:23` | // MapLibre 6 çalışma dosyası (worker) ayrı bir modüldür; aynı kökenli bir blob üzerinden CDN'den içe aktarılır. | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:59` | // Yönlendirme modu | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:99` | // Harita kurulumu | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:131` | // Durak işaretçileri | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:154` | // Genel bakış: il dışındaki uzak duraklar (İstanbul vb.) görünümü uzaklaştırmasın; Afyonkarahisar çevresine odaklan | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:169` | // Seçili işaretçi vurgusu + haritayı o durağa getirme | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:182` | // Canlı konum: önce önbellekteki/ağ tabanlı hızlı konum, ardından yüksek doğruluklu takip | Kod açıklaması, kullanıcı metni değil |
| `components/map/RouteMap.tsx:214` | // Grup üyelerinin işaretçileri | Kod açıklaması, kullanıcı metni değil |
| `components/PhotoSlot.tsx:4` | /** Küçük telif etiketi */ | Kod açıklaması, kullanıcı metni değil |
| `components/route/StartPanel.tsx:14` | /** Konum iznini ve ilk konumu, harita açılmadan önce ısıtır; yönlendirme daha hızlı başlar. */ | Kod açıklaması, kullanıcı metni değil |
| `components/RouteMeta.tsx:14` | /^(Yaklaşık\|Toplam, yaklaşık\|Approximate\|Total, approximate)/i | Kod içi eşleştirme, kullanıcı metni değil |
| `components/TopNav.tsx:8` | /** Yalnızca geniş ekranda görünen üst menü; telefonda alttaki sekme çubuğu kullanılır. */ | Kod açıklaması, kullanıcı metni değil |
| `components/Track.tsx:8` | /** Çerezsiz, anonim sayfa görüntüleme sayacı: yalnızca yol ve oturuma özel rastgele kimlik gönderilir. */ | Kod açıklaması, kullanıcı metni değil |
| `components/Track.tsx:16` | // Tablo henüz yoksa (SQL çalıştırılmadıysa) bu oturumda tekrar denenmez | Kod açıklaması, kullanıcı metni değil |
| `components/Track.tsx:19` | /* ölçüm başarısızsa sessizce geç */ | Kod açıklaması, kullanıcı metni değil |
| `components/WeatherCard.tsx:83` | // İzin daha önce verilmişse sormadan konumu kullan | Kod açıklaması, kullanıcı metni değil |

Yer adları, kaynak kuruluş adları, fotoğraf sahipleri ve lisansları özgün biçimiyle korunur. Kanonik Türkçe adresler ve veri tabanı kodları görüntülenen arayüz metni değildir. Kullanıcı adları, kullanıcı içerikleri ve veri tabanından gelen duyurular çevrilmez. Kök PWA manifesti varsayılan Türkçe meta verisini kullanır.
