import type { Place } from "./types";

/**
 * Tüm duraklar tek yerde tutulur; rotalar yalnızca id ile referans verir.
 * Not metinleri "Afyonkarahisar Özelinde Oluşturulan (Önerilen) Tur Rotaları" belgesinden derlenmiştir.
 * coords alanı boş olanlar henüz doğrulanmamıştır; doğrulanmadan haritada gösterilmez.
 */
const list: Place[] = [
  // ---- Afyonkarahisar şehir merkezi ----
  { id: "alimoglu-muzik", name: "İbrahim Alimoğlu Müzik Koleksiyonu", kind: "muze", area: "Merkez · AKÜ Devlet Konservatuvarı", note: "Dünyanın farklı kültürlerine ait, geçmişten günümüze kullanılan müzik aletleri sergilenir." },
  { id: "afyon-muzesi", name: "Afyonkarahisar Müzesi", kind: "muze", area: "Merkez", note: "2023'te tamamlanan, kapalı teşhir alanı 5 kattan oluşan müze; Frig, Roma, Bizans ve Osmanlı dönemi eserleri." },
  { id: "ulu-cami", name: "Afyon Ulu Cami", kind: "cami", area: "Merkez", note: "1272'de inşa edilen, 40 ahşap sütunlu Anadolu Selçuklu camisi; UNESCO Dünya Mirası Kesin Listesi'nde." },
  { id: "millet-hamami", name: "Millet Hamamı", kind: "hamam", area: "Merkez", note: "Ulu Cami'nin yakınında yer alan tarihî hamam." },
  { id: "mevlevihane", name: "Sultan Divani Mevlevihanesi", kind: "turbe", area: "Merkez", note: "13. yüzyıl sonlarında kurulmuş; Mevleviliğin batıya açılan ilk merkezlerinden. Semahane ve türbe bölümü ziyaret edilir." },
  { id: "kadinanalar-turbesi", name: "Kadınanalar Türbesi", kind: "turbe", area: "Merkez" },
  { id: "afyon-konaklari", name: "Afyonkarahisar Konakları", kind: "diger", area: "Merkez", note: "Osmanlı döneminden kalan, Afyon Belediyesi tarafından iyileştirilen sivil mimari örnekleri." },
  { id: "tashan-merkez", name: "Taşhan (Taş Han / Hoca Üveys Hanı)", kind: "han", area: "Merkez", note: "17. yüzyıla ait iki katlı, geniş avlulu Osmanlı şehir hanı." },
  { id: "uzun-carsi", name: "Uzun Çarşı", kind: "carsi", area: "Merkez", note: "Kaymak, lokum, sucuk ve haşhaş ürünleri satan işletmeler ile yerel yemek sunan lokantalar bulunur." },
  { id: "imaret-cami", name: "Gedik Ahmet Paşa Camii (İmaret) ve Taş Medrese", kind: "cami", area: "Merkez", note: "1472'de inşa edilen cami, medrese ve hamamdan oluşan 15. yüzyıl Osmanlı külliyesi." },
  { id: "anitpark", name: "Anıtpark (Utku Parkı)", kind: "anit", area: "Merkez", note: "Kurtuluş Savaşı'nı simgeleyen heykel ve kabartma grubu." },
  { id: "zafer-muzesi", name: "Zafer Müzesi", kind: "muze", area: "Merkez", note: "Anıtpark'ın karşısında; kurtuluştan sonra karargâh olarak da kullanılmıştır." },
  { id: "vesvese-dede", name: "Vesvese Dede Camii", kind: "cami", area: "Merkez", note: "Halk inancında dilek ve şifa yeri olarak bilinir." },
  { id: "kubbeli-cami", name: "Kubbeli Camii", kind: "cami", area: "Merkez", note: "Selçuklu taş işçiliğinin sade ama etkileyici bir örneği." },
  { id: "tacahmet-cami", name: "Tacahmet Camii", kind: "cami", area: "Merkez", note: "Klasik Osmanlı mimarisini yansıtır." },
  { id: "akmescit-cami", name: "Akmescit Camii", kind: "cami", area: "Merkez" },
  { id: "otpazari-cami", name: "Ot Pazarı Camii", kind: "cami", area: "Merkez", note: "Çevresindeki çarşı bölgesi esnaf kültürünü yaşatır." },
  { id: "yoncaalti-cami", name: "Yoncaaltı Camii", kind: "cami", area: "Merkez" },
  { id: "gastronomi-konagi", name: "Gastronomi Konağı", kind: "yeme-icme", area: "Merkez", note: "Yerel yemeklerin sunulduğu konak." },
  { id: "kultur-sanat-evi", name: "Belediye Kültür ve Sanat Evi", kind: "muze", area: "Merkez", note: "Yemek örnekleri ile Afyonkarahisar mutfağına ait araç gereçler sergilenir." },

  // ---- Frig Vadisi / Frigya Bölgesi ----
  { id: "seydiler", name: "Seydiler", kind: "kasaba", area: "Seydiler beldesi", note: "Frig Yolu Afyonkarahisar Kültür Rotası'nın başlangıcı; peribacaları ve kaya yerleşmeleri." },
  { id: "alanyurt-selimiye", name: "Alanyurt ve Selimiye", kind: "doga", area: "Seydiler çevresi", note: "Peribacaları, kaya mezarları ve kaya yerleşmeleri." },
  { id: "ayazini", name: "Ayazini (Metropolis) Ören Yeri", kind: "oren-yeri", area: "İhsaniye", note: "Frig'den Roma ve Doğu Roma dönemlerine uzanan kaya kiliseleri, mezar odaları ve çok katlı konut kalıntıları." },
  { id: "avdalaz-kalesi", name: "Avdalaz Kalesi ve Ayazini Peribacaları", kind: "kale", area: "İhsaniye" },
  { id: "goynus-vadisi", name: "Göynüş Vadisi", kind: "oren-yeri", area: "İhsaniye", note: "Kutsal kabul edilen vadide Aslantaş ve Yılantaş anıt mezarları ile Maltaş (Kybele Açık Hava Tapınağı) bulunur." },
  { id: "demirli", name: "Demirli (Frig Evi ve Demirli Kalesi)", kind: "kale", area: "Demirli", note: "Frig Evi'nde konaklama yapılabilir." },
  { id: "bayramaliler", name: "Bayramaliler Kalesi (Leonto Kefal) ve Kral Yolu", kind: "kale", area: "Bayramaliler" },
  { id: "emre-golu", name: "Emre Gölü, Emre Tekkesi ve Kırk Merdiven Kayalıkları", kind: "doga", area: "Emre Gölü çevresi", note: "Ayazini Ören Yeri ile birlikte hatıra ve yerel ürün satış alanları bulunur." },
  { id: "memec", name: "Memeç Kayalıkları", kind: "doga", area: "Frigya Bölgesi" },
  { id: "aslankaya", name: "Aslankaya Açık Hava Tapınağı", kind: "oren-yeri", area: "Frigya Bölgesi", note: "Frig Yolu'nun Afyonkarahisar'daki ilk durağı (Eskişehir yönünden)." },
  { id: "uclerkayasi", name: "Üçlerkayası ve Kapıkaya I–II Tapınakları", kind: "oren-yeri", area: "Üçlerkayası", note: "Frig Yolu Afyonkarahisar Kültür Rotası'nın bitiş noktası." },

  // ---- Zafer Yolu / Başkomutanlık Tarihi Milli Parkı ----
  { id: "suhut-sehitligi", name: "Şuhut Kurtuluş Savaşı Şehitliği", kind: "anit", area: "Şuhut" },
  { id: "suhut-ataturk-evi", name: "Şuhut Atatürk Evi", kind: "muze", area: "Şuhut", note: "Atatürk'ün Kocatepe'ye geçmeden önce konakladığı ev. Buradan başlayan yaklaşık 20 km'lik güzergâh Zafer Yolu olarak anılır." },
  { id: "kocatepe-aniti", name: "Kocatepe Anıtı", kind: "anit", area: "Kocatepe" },
  { id: "buyukkalecik", name: "Büyükkalecik ve Yüzbaşı Agâh Efendi Şehitliği", kind: "anit", area: "Büyükkalecik" },
  { id: "kurtkayasi", name: "Kurtkayası (Yunan Siperleri)", kind: "anit", area: "Büyükkalecik çevresi", note: "Yürüyerek ulaşılır." },
  { id: "koru-tepe", name: "Koru Tepe", kind: "anit", area: "Başkomutanlık Tarihi Milli Parkı", note: "Mola noktası." },
  { id: "karatepe", name: "Küçükkalecik ve Karatepe", kind: "anit", area: "Küçükkalecik", note: "Yunan siperlerinin bulunduğu mola noktası." },
  { id: "tinaztepe", name: "Kayadibi ve Tınaztepe", kind: "kasaba", area: "Başkomutanlık Tarihi Milli Parkı" },
  { id: "sumbul-tepe", name: "Sümbül Tepe", kind: "anit", area: "Başkomutanlık Tarihi Milli Parkı", note: "Kuzeyindeki mola noktasında durulur." },
  { id: "kuzukulakli", name: "Kuzukulaklı Yaylası", kind: "doga", area: "Başkomutanlık Tarihi Milli Parkı", note: "Yürüyerek Türk ve Yunan siperleri gezilir." },
  { id: "ciltepe", name: "Çiğiltepe ve Albay Reşat Bey Anıtı", kind: "anit", area: "Başkomutanlık Tarihi Milli Parkı", note: "Kocatepe Bölümü turunun son durağı." },

  // ---- Anadolu Selçuklu ve han / kervansaray ----
  { id: "sahipata-han", name: "Sahipata (Ishaklı Han) Kervansarayı", kind: "han", area: "Sultandağı", note: "Köşk mescidinin bu plan tipinin son örneği olduğu bilinir." },
  { id: "tashan-cay", name: "Taşhan (Çay Kervansarayı)", kind: "han", area: "Çay", note: "Kare planlı, avlulu ve kapalı tiplerden Selçuklu dönemi taş külliyesi." },
  { id: "boyali-kulliye", name: "Boyalı Köyü Külliyesi", kind: "diger", area: "Sinanpaşa · Boyalı Köyü", note: "Yaptıranı kesin bilinmeyen, Anadolu Selçuklu mimari özelliklerini taşıyan külliye." },

  // ---- Gastronomi ----
  { id: "keskek-evi", name: "Keşkek Evi", kind: "yeme-icme", area: "Şuhut" },

  // ---- Akdağ Milli Parkı ----
  { id: "kocayayla", name: "Kocayayla", kind: "doga", area: "Sandıklı · Akdağ Milli Parkı", note: "Gölet çevresi, yılkı atları ve kızıl geyik gözlemi; foto safari ve kamp imkânı." },
  { id: "kurtini", name: "Kurtini Mağarası", kind: "doga", area: "Sandıklı · Akdağ Milli Parkı", note: "Kocayayla'dan yaklaşık 6 km yürüyüşle ulaşılır." },
  { id: "tokali-kanyon", name: "Kanyon Vadi ve Tokalı Kanyon", kind: "doga", area: "Sandıklı · Akdağ Milli Parkı", note: "Teçhizatlı geçiş gerektiren zor parkur; yalnızca özel ilgi grupları için." },

  // ---- Termal turizm rotası (çok illi) ----
  { id: "banaz-hamambogazi", name: "Banaz Hamamboğazı Termal Turizm Merkezi", kind: "termal", area: "Uşak · Banaz" },
  { id: "omer-gecek", name: "Ömer–Gecek Termal Turizm Merkezleri", kind: "termal", area: "Afyonkarahisar", note: "Geleneksel Türk hamamı, çamur banyosu ve aromaterapi uygulamaları." },
  { id: "gediz-ilicasi", name: "Gediz Ilıcası ve Ilıca Harlek Termal Turizm Merkezleri", kind: "termal", area: "Kütahya" },
  { id: "sakarilica", name: "Sakarılıca ve Hasırca Kaplıcaları", kind: "termal", area: "Eskişehir" },
  { id: "hamam-muzesi-es", name: "Odunpazarı Evleri ve Hamam Müzesi", kind: "muze", area: "Eskişehir" },
  { id: "beypazari", name: "Beypazarı (Tarihi Çarşı, Kent Müzesi, Yaşayan Müze)", kind: "carsi", area: "Ankara · Beypazarı" },
  { id: "kizilcahamam", name: "Kızılcahamam Termal Turizm Merkezi", kind: "termal", area: "Ankara · Kızılcahamam" },

  // ---- Çevre illerle bağlantılı rotalar ----
  { id: "gordion", name: "Gordion Antik Kenti", kind: "oren-yeri", area: "Ankara · Polatlı", note: "M.Ö. 9. yüzyıldan itibaren Frig uygarlığının siyasi ve kültürel merkezi." },
  { id: "yazilikaya", name: "Yazılıkaya (Midas Anıtı)", kind: "oren-yeri", area: "Eskişehir", note: "Frig Yolu'nun üç kolunun birleştiği Midas kenti." },
  { id: "han-seyitgazi-ihsaniye", name: "Han, Seyitgazi ve İhsaniye güzergâhı", kind: "kasaba", area: "Eskişehir – Afyonkarahisar" },
  { id: "yenice-ciftligi", name: "Yenice Çiftliği", kind: "kasaba", area: "Kütahya", note: "Frig Yolu'nun üç başlangıç noktasından biri." },
  { id: "odunpazari", name: "Odunpazarı Tarihi Evleri", kind: "diger", area: "Eskişehir", note: "UNESCO Geçici Miras Listesi'nde yer alan, Türk sivil mimarisinin özgün örnekleri." },
  { id: "balmumu-muzesi", name: "Yılmaz Büyükerşen Balmumu Heykeller Müzesi", kind: "muze", area: "Eskişehir", note: "Türkiye'nin ilk balmumu müzesi." },
  { id: "sazova", name: "Sazova Bilim, Sanat ve Kültür Parkı", kind: "park", area: "Eskişehir", note: "Masal Şatosu, Korsan Gemisi ve Bilim Deney Merkezi gibi tematik alanlar." },
  { id: "akhan", name: "Akhan Kervansarayı", kind: "han", area: "Denizli", note: "II. Gıyaseddin Keyhüsrev döneminde 13. yüzyılda inşa edilmiştir." },
  { id: "cardak-han", name: "Çardak Hanı (Hanabad Kervansarayı)", kind: "han", area: "Denizli · Çardak", note: "13. yüzyıl başında I. Alaeddin Keykubad tarafından yaptırıldığı bilinir." },
  { id: "zazadin-han", name: "Zazadin Hanı", kind: "han", area: "Konya", note: "1236'da Selçuklu veziri Sadeddin Köpek tarafından yaptırılmıştır." },
  { id: "kizileren-han", name: "Kızılören Hanı", kind: "han", area: "Konya", note: "13. yüzyılın ikinci yarısında inşa edildiği düşünülür." },
  { id: "istanbul", name: "İstanbul (hareket noktası)", kind: "diger", area: "İstanbul", note: "Rota sabah erken saatlerde İstanbul'dan başlar; Eskişehir'e yaklaşık beş saatlik yolculuk." },
  { id: "gazligol", name: "Gazlıgöl Termal Bölgesi", kind: "termal", area: "Afyonkarahisar · Gazlıgöl", note: "Konaklama ve şifalı su deneyimi." },
  { id: "pamukkale", name: "Pamukkale Travertenleri ve Hierapolis", kind: "doga", area: "Denizli · Pamukkale", note: "UNESCO Dünya Mirası; antik tiyatro, nekropol alanı ve müze." },
];

export const places: Record<string, Place> = Object.fromEntries(list.map((p) => [p.id, p]));
export const placeList = list;
export const getPlace = (id: string): Place => {
  const p = places[id];
  if (!p) throw new Error(`Bilinmeyen durak: ${id}`);
  return p;
};
