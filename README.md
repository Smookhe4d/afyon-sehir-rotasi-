# Afyon Şehir Rotası

Next.js 15 + Tailwind 4 + Supabase. Rota ve durak içeriği `lib/routes.ts` ve `lib/places.ts` içindedir
(kaynak: "Afyonkarahisar Özelinde Oluşturulan (Önerilen) Tur Rotaları" belgesi).

## Kurulum
1. supabase.com'da yeni bir proje oluşturun.
2. SQL Editor'de `supabase/schema.sql` dosyasını çalıştırın.
3. Authentication → Sign In / Providers:
   - Email: açık
   - Anonymous sign-ins: **açık** (Misafir girişi için)
   - Google: Client ID/Secret ekleyin (isteğe bağlı)
4. Authentication → URL Configuration: Site URL ve Redirect URLs'e uygulama adresini (`https://…/auth/callback` dahil) ekleyin.
5. `.env.local` (Vercel'de Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...   # publishable (veya eski anon) anahtar
   ```
6. `npm install && npm run dev`

## Yapılacaklar
- Konumu "yaklaşık" (`precision: "area"`) olan duraklar ve koordinatı olmayan 3 durak (Koru Tepe, Sümbül Tepe, Kuzukulaklı) saha/kaynak doğrulaması bekliyor
- Fotoğraflar (`Place.photo`, `public/photos/`)

## Harita
MapLibre GL + OpenFreeMap (OSM) vektör haritası, çalışma anında sıcak tona boyanır (`lib/map/style.ts`). Güzergâh çizgileri OSRM ile önceden hesaplanıp `lib/routeGeo.ts` içindedir. MapLibre worker modülü jsDelivr CDN'den (sürüm sabitli) blob ile yüklenir; paket sürümü değişirse `MAPLIBRE_VERSION` güncellenmeli.
