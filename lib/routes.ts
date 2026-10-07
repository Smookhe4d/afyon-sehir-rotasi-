import type { Route } from "./types";
import { getPlace } from "./places";

const SRC = "Afyonkarahisar Özelinde Oluşturulan (Önerilen) Tur Rotaları";

export const routes: Route[] = [
  // ============ Afyonkarahisar özelinde ============
  {
    slug: "merkez-kultur-rotasi", title: "Afyonkarahisar Merkez Kültür Rotası", scope: "il-ici", category: "kultur",
    summary: "UNESCO listesindeki Ulu Cami'den Zafer Müzesi'ne, şehir merkezinin Selçuklu ve Osmanlı mirası ile müzeleri.",
    description: [
      "Şehir merkezindeki Anadolu Selçuklu ve Osmanlı dönemi eserlerini, merkeze yakın müzelerle birleştiren rota; UNESCO Dünya Mirası Kesin Listesi'ndeki Afyon Ulu Cami ile Zafer Müzesi arasındaki tarihî, kültürel ve sosyal çekicilikleri kapsar.",
      "Başlangıç noktası olarak AKÜ Devlet Konservatuvarı'ndaki İbrahim Alimoğlu Müzik Koleksiyonu belirlenmiştir; ancak gruplar geliş güzergâhına göre farklı noktalardan başlayabilir. Öğle yemeği Uzun Çarşı'daki yerel lokantalarda verilir; Aşçı Bacaksız, Salim Usta Lokantası, Musakka ve İkbal Lokantası gibi işletmeler yerel lezzetler sunar.",
    ],
    distanceKm: 20, distanceNote: "Yaklaşık", modes: ["arac", "yuruyus"],
    stops: [
      { placeId: "alimoglu-muzik", role: "baslangic" }, { placeId: "afyon-muzesi" }, { placeId: "ulu-cami" }, { placeId: "millet-hamami" },
      { placeId: "mevlevihane" }, { placeId: "kadinanalar-turbesi" }, { placeId: "afyon-konaklari" }, { placeId: "tashan-merkez" },
      { placeId: "uzun-carsi", role: "mola", note: "Öğle yemeği ve kısa alışveriş molası" }, { placeId: "imaret-cami" },
      { placeId: "anitpark" }, { placeId: "zafer-muzesi", role: "bitis" },
    ],
    tips: ["Kaymak, lokum, sucuk ve haşhaş ürünleri Uzun Çarşı'da bulunur."],
    source: SRC,
  },
  {
    slug: "frig-yolu-afyonkarahisar", title: "Frig Yolu Afyonkarahisar Kültür Rotası", scope: "il-ici", category: "frig",
    summary: "Seydiler'den Üçlerkayası'na; peribacaları, kaya mezarları, kaya kiliseleri ve Frig tapınakları.",
    description: [
      "Dağlık Frigya Bölgesi'nin Afyonkarahisar sınırları içinde kalan kısmını kapsayan rota; Frigler, Roma ve Doğu Roma dönemlerine ait kalıntıları, kaya mezarlarını, mağara ve kiliseleri bir araya getirir.",
      "Rota Ankara–Afyonkarahisar karayolu üzerindeki Seydiler beldesinden başlar ve Üçlerkayası yerleşiminde sona erer. Bireysel veya grup hâlinde yürüyüş ve bisiklet rotası olarak da gerçekleştirilebilir.",
    ],
    distanceKm: 120, distanceNote: "Yaklaşık", modes: ["arac", "yuruyus", "bisiklet"],
    stops: [
      { placeId: "seydiler", role: "baslangic" }, { placeId: "alanyurt-selimiye" }, { placeId: "ayazini" }, { placeId: "avdalaz-kalesi" },
      { placeId: "goynus-vadisi" }, { placeId: "demirli", note: "Frig Evi'nde konaklama yapılabilir", role: "konaklama" }, { placeId: "bayramaliler" },
      { placeId: "emre-golu" }, { placeId: "memec" }, { placeId: "aslankaya" }, { placeId: "uclerkayasi", role: "bitis" },
    ],
    tips: ["Ayazini Ören Yeri ve Emre Gölü'nde hatıra ve yerel yemek satış alanları bulunur."],
    source: SRC,
  },
  {
    slug: "zafer-yolu", title: "Zafer Yolu Afyonkarahisar Rotası", scope: "il-ici", category: "savas-alanlari",
    summary: "Şuhut'tan Çiğiltepe'ye; Büyük Taarruz'un geçtiği Başkomutanlık Tarihi Milli Parkı savaş alanları.",
    description: [
      "Afyonkarahisar Kocatepe'den başlayıp Kütahya Dumlupınar çevresinde sona eren Büyük Taarruz'un alanları Başkomutanlık Tarihi Milli Parkı olarak düzenlenmiştir. Rota, parkın Afyonkarahisar bölümünü savaş alanları turizmi kapsamında sunar.",
      "Başlangıç Şuhut ilçesidir. Atatürk Evi'nden başlayan yaklaşık 20 km'lik güzergâh Zafer Yolu olarak anılır. Her yıl 26 Ağustos'ta Şuhut Atatürk Evi ile Kocatepe arasında Bağımsızlık Yürüyüşü yapılır.",
    ],
    distanceKm: 20, distanceNote: "Atatürk Evi'nden başlayan Zafer Yolu bölümü, yaklaşık", modes: ["arac", "yuruyus"],
    stops: [
      { placeId: "suhut-sehitligi", role: "baslangic" }, { placeId: "suhut-ataturk-evi" }, { placeId: "kocatepe-aniti" }, { placeId: "buyukkalecik" },
      { placeId: "kurtkayasi" }, { placeId: "koru-tepe", role: "mola" }, { placeId: "karatepe", role: "mola" }, { placeId: "tinaztepe" },
      { placeId: "sumbul-tepe", role: "mola" }, { placeId: "kuzukulakli" }, { placeId: "ciltepe", role: "bitis" },
    ],
    tips: ["Rota geliş güzergâhına göre farklı noktalardan başlatılabilir; Kütahya ve Uşak bölümleriyle genişletilebilir."],
    source: SRC,
  },
  {
    slug: "anadolu-selcuklu-rotasi", title: "Afyon Anadolu Selçuklu Rotası", scope: "il-ici", category: "han-kervansaray",
    summary: "Sultandağı'ndan Boyalı Köyü'ne; kervansaraylar, Ulu Cami ve Selçuklu külliyesi.",
    description: [
      "Afyonkarahisar, Konya'dan Ege'ye geçişte bir kavşak olduğu için Anadolu Selçuklu dönemine ait önemli eserlere sahiptir. Rota çoğunlukla kervansaraylardan oluşur ve Konya yönünden başlar.",
      "Rotanın büyük bölümü ana yollar ve merkezî yerleşimler üzerinde olduğundan ulaşım ve temel ihtiyaçlar açısından sorun yoktur.",
    ],
    modes: ["arac"],
    stops: [
      { placeId: "sahipata-han", role: "baslangic" }, { placeId: "tashan-cay" }, { placeId: "ulu-cami" }, { placeId: "boyali-kulliye", role: "bitis" },
    ],
    source: SRC,
  },
  {
    slug: "gastronomi-rotasi", title: "Afyonkarahisar Gastronomi Rotası", scope: "il-ici", category: "gastronomi",
    summary: "Gastronomi Konağı'ndan Şuhut Keşkek Evi'ne; sucuk, lokum, kaymak ve yerel yemekler.",
    description: [
      "İlin gastronomik değerlerini tanıtmak ve bilinirliğini artırmak için önerilen rota. Başlangıç noktası yerel yemeklerin sunulduğu Gastronomi Konağı'dır.",
      "Ardından yemek örnekleri ve mutfak araç gereçlerinin sergilendiği Belediye Kültür ve Sanat Evi, sucuk, lokum ve kaymak satan Uzun Çarşı gezilir; rota Şuhut'taki Keşkek Evi ile sona erer.",
    ],
    modes: ["arac", "yuruyus"],
    stops: [
      { placeId: "gastronomi-konagi", role: "baslangic" }, { placeId: "kultur-sanat-evi" }, { placeId: "uzun-carsi", note: "Sucuk, lokum ve kaymak tadımı" },
      { placeId: "keskek-evi", role: "bitis" },
    ],
    source: SRC,
  },
  {
    slug: "akdag-milli-park-rotasi", title: "Akdağ Milli Park Rotası", scope: "il-ici", category: "doga",
    summary: "Sandıklı'da Kocayayla, Kurtini Mağarası ve Tokalı Kanyon; yılkı atları, foto safari ve yürüyüş.",
    description: [
      "Sandıklı ilçesindeki Akdağ, Türkiye'nin 49. Milli Parkı'dır. Başlangıç noktası Kocayayla'dır; gölet çevresinde fotoğraf molası verilir, yılkı atları ve kızıl geyik gibi yaban hayatı gözlemlenebilir.",
      "Kocayayla'dan yaklaşık 6 km yürüyerek Kurtini Mağarası'na, ardından dere yatağını izleyerek Kanyon Vadi ve Tokalı Kanyon girişine ulaşılır.",
    ],
    difficulty: "zor", difficultyNote: "Kanyon geçişi teçhizat gerektirir; yalnızca özel ilgi grupları için önerilir. Otobüsle ulaşılabilen Kocayayla ve Kurtini Mağarası kolay bölümlerdir.",
    modes: ["arac", "yuruyus"],
    stops: [
      { placeId: "kocayayla", role: "baslangic" }, { placeId: "kurtini" }, { placeId: "tokali-kanyon", role: "bitis", note: "Kocayayla'ya geri dönülebilir veya Denizli Çivril çıkışına kanyon geçilebilir" },
    ],
    tips: ["Parkta bungalov evlerde konaklama imkânı vardır.", "Yaz aylarında ateş yakmayın ve cam atık bırakmayın; orman yangını riski vardır."],
    source: SRC,
  },
  {
    slug: "termal-turizm-rotasi", title: "Frigya Termal Turizm Rotası", scope: "il-ici", category: "termal",
    summary: "Uşak'tan Ankara'ya beş ili birleştiren termal rota; Afyonkarahisar'da Ömer–Gecek'te iki gün konaklama.",
    description: [
      "Termal Turizm Master Planı 2007–2023'teki Frigya Termal Turizm Bölgesi için oluşturulan rota Uşak, Afyonkarahisar, Kütahya, Eskişehir ve Ankara'yı kapsar. Bölgede toplam 11 termal turizm merkezi bulunur.",
      "Afyonkarahisar'da ziyaretçilerin Ömer–Gecek termal merkezlerinde 2 gün konaklaması planlanır; geleneksel Türk hamamı, çamur banyosu ve aromaterapi yanında Ulu Cami, Zafer Müzesi ve Mevlevihane gibi kültürel duraklar keşfedilir.",
    ],
    provinces: ["Uşak", "Afyonkarahisar", "Kütahya", "Eskişehir", "Ankara"],
    stops: [
      { placeId: "banaz-hamambogazi", role: "baslangic", note: "Bir gün konaklama" }, { placeId: "omer-gecek", role: "konaklama", note: "2 gün konaklama" },
      { placeId: "gediz-ilicasi", role: "konaklama", note: "Bir gün konaklama" }, { placeId: "sakarilica" }, { placeId: "hamam-muzesi-es" },
      { placeId: "beypazari" }, { placeId: "kizilcahamam", role: "bitis", note: "Bir gece konaklama" },
    ],
    source: "Termal Turizm Master Planı 2007–2023 / " + SRC,
  },
  {
    slug: "inanc-turizmi-rotasi", title: "Afyonkarahisar İnanç Turizmi Rotası", scope: "il-ici", category: "inanc",
    summary: "Ulu Cami'den İmaret Camii ve Hamamı'na; Selçuklu ve Osmanlı cami, türbe ve Mevlevihane durakları.",
    description: [
      "Selçuklu ve Osmanlı dönemlerinden günümüze ulaşan cami ve türbeleriyle şehir merkezindeki dinî yapıları mimari çeşitliliği ve manevi dokusuyla tanıtan rota. UNESCO listesindeki Afyon Ulu Cami'den başlar, Gedik Ahmet Paşa (İmaret) Camii ve Hamamı'nda sona erer.",
      "Rota boyunca Ulu Cami çevresindeki geleneksel kahvehanelerde, Tacahmet Camii çevresindeki esnaf dükkânlarında, Millet Hamamı avlusunda ve Ot Pazarı çevresinde kısa dinlenme molaları verilebilir.",
    ],
    modes: ["yuruyus"],
    stops: [
      { placeId: "ulu-cami", role: "baslangic", note: "Çevredeki geleneksel kahvehanelerde kısa mola" }, { placeId: "vesvese-dede" }, { placeId: "kubbeli-cami" },
      { placeId: "tacahmet-cami", note: "Çevredeki esnaf dükkânlarında çay molası" }, { placeId: "millet-hamami", note: "Avluda kısa dinlenme" },
      { placeId: "mevlevihane" }, { placeId: "akmescit-cami" }, { placeId: "otpazari-cami", note: "Çevrede dondurma veya içecek molası" },
      { placeId: "yoncaalti-cami" }, { placeId: "imaret-cami", role: "bitis" },
    ],
    source: SRC,
  },

  // ============ Çevre illerle bağlantılı ============
  {
    slug: "frig-yolu-ankara-eskisehir-afyon", title: "Frig Yolu (Ankara–Eskişehir–Afyonkarahisar) Kültür Rotası", scope: "cevre-il", category: "frig",
    summary: "Gordion'dan Seydiler'e; Frig Krallığı'nın başkentinden Afyonkarahisar Frigya'sına 506 km.",
    description: [
      "Yaklaşık 506 km'lik, dört ili kapsayan Frig Yolu Kültür Rotası, Frig Krallığı'nın başkenti Gordion Antik Kenti'nden başlar. M.Ö. 9. yüzyıldan itibaren Frig uygarlığının merkezi olan kent Polatlı yakınlarındadır.",
      "Rota Yazılıkaya (Midas Anıtı) ile devam eder; Han, Seyitgazi ve İhsaniye üzerinden Afyonkarahisar'a girer. Ayazini'nde Frig'den Doğu Roma'ya uzanan çok katmanlı bir doku görülür.",
    ],
    distanceKm: 506, provinces: ["Ankara", "Eskişehir", "Afyonkarahisar"], modes: ["arac"],
    stops: [
      { placeId: "gordion", role: "baslangic" }, { placeId: "yazilikaya" }, { placeId: "han-seyitgazi-ihsaniye" }, { placeId: "aslankaya" }, { placeId: "memec" },
      { placeId: "emre-golu" }, { placeId: "demirli" }, { placeId: "bayramaliler" }, { placeId: "goynus-vadisi" }, { placeId: "avdalaz-kalesi" },
      { placeId: "ayazini" }, { placeId: "alanyurt-selimiye" }, { placeId: "seydiler", role: "bitis" },
    ],
    source: SRC,
  },
  {
    slug: "frig-yolu-yuruyus-rotasi", title: "Frig Yolu Yürüyüş Rotası", scope: "cevre-il", category: "frig",
    summary: "Türkiye'nin 3. en uzun yürüyüş yolu: 506 km, 67 parkur, uluslararası kırmızı-beyaz işaretli.",
    description: [
      "Friglerin kullandığı yollar esas alınarak oluşturulan, uluslararası standartlarla işaretlenmiş 506 km'lik yürüyüş güzergâhıdır. Yolun büyük kısmı bisikletle geçilebilir. 2013'te gönüllü bir ekip tarafından yaklaşık 5 yıllık çalışmayla hayata geçirilmiştir.",
      "Afyonkarahisar'da 140 km, Kütahya'da 147 km, Eskişehir'de 200 km ve Ankara'da yaklaşık 20 km rota bulunur. Yol 4 ilden, 8 ilçe, 6 mahalle, 44 köy ve 5 beldeden geçer; güzergâh kırmızı-beyaz işaretlerle boyalıdır.",
    ],
    distanceKm: 506, distanceNote: "Toplam; Afyonkarahisar kesimi 140 km",
    provinces: ["Ankara", "Afyonkarahisar", "Kütahya", "Eskişehir"], modes: ["yuruyus", "bisiklet"],
    stops: [
      { placeId: "gordion", role: "baslangic", note: "Üç başlangıç noktasından biri" }, { placeId: "seydiler", role: "baslangic", note: "Üç başlangıç noktasından biri" },
      { placeId: "yenice-ciftligi", role: "baslangic", note: "Üç başlangıç noktasından biri" }, { placeId: "yazilikaya", role: "bitis", note: "Üç kolun birleştiği nokta" },
    ],
    source: "Frigya Kültürel Mirasını Koruma ve Kalkınma Birliği / " + SRC,
  },
  {
    slug: "eskisehir-afyon-kultur-rotasi", title: "Eskişehir–Afyonkarahisar Kültür Rotası", scope: "cevre-il", category: "kultur",
    summary: "Günübirlik: Odunpazarı ve Sazova'dan Afyon Ulu Cami ve Zafer Müzesi'ne.",
    description: [
      "İki şehir arasındaki yaklaşık 170 km'lik mesafe günübirlik kültür turlarına uygundur. Rota sabah Eskişehir'de Odunpazarı Tarihi Evleri ile başlar; Balmumu Heykeller Müzesi ve Sazova Parkı'nın ardından öğleye doğru Afyonkarahisar'a hareket edilir.",
      "Yaklaşık iki saatlik yolculukta rehber anlatımıyla Frig Vadisi ve kültürel peyzaj tanıtılabilir. Afyonkarahisar'da Uzun Çarşı'da öğle yemeği verilir, ardından şehir merkezi kültür rotası izlenir.",
    ],
    distanceKm: 300, distanceNote: "Toplam, yaklaşık", provinces: ["Eskişehir", "Afyonkarahisar"], modes: ["arac"],
    stops: [
      { placeId: "odunpazari", role: "baslangic" }, { placeId: "balmumu-muzesi" }, { placeId: "sazova" },
      { placeId: "uzun-carsi", role: "mola", note: "Öğle yemeği (sucuk, kaymak, haşhaşlı ürünler, tandır) ve alışveriş molası" },
      { placeId: "alimoglu-muzik" }, { placeId: "afyon-muzesi" }, { placeId: "ulu-cami" }, { placeId: "millet-hamami" }, { placeId: "mevlevihane" },
      { placeId: "kadinanalar-turbesi" }, { placeId: "afyon-konaklari" }, { placeId: "tashan-merkez" }, { placeId: "imaret-cami" },
      { placeId: "anitpark" }, { placeId: "zafer-muzesi", role: "bitis" },
    ],
    source: SRC,
  },
  {
    slug: "hanlar-rotasi", title: "Denizli–Afyonkarahisar–Konya Hanlar Rotası", scope: "cevre-il", category: "han-kervansaray",
    summary: "Akhan'dan Kızılören Hanı'na; Selçuklu ve Osmanlı kervansaraylarıyla Batı Anadolu'dan İç Anadolu'ya.",
    description: [
      "Batı Anadolu'dan İç Anadolu'ya uzanan, Selçuklu ve Osmanlı mimarisinin en güzel han örneklerini bir araya getiren kültür yolculuğu. Rota Denizli'den başlar, Afyonkarahisar'da Çay Kervansarayı ve şehir merkezindeki Taş Han'dan geçerek Konya'da Zazadin ve Kızılören hanlarında sona erer.",
    ],
    provinces: ["Denizli", "Afyonkarahisar", "Konya"], modes: ["arac"],
    stops: [
      { placeId: "akhan", role: "baslangic" }, { placeId: "cardak-han" }, { placeId: "tashan-cay" }, { placeId: "tashan-merkez" },
      { placeId: "zazadin-han" }, { placeId: "kizileren-han", role: "bitis" },
    ],
    source: SRC,
  },
  {
    slug: "istanbul-pamukkale-kultur-rotasi", title: "İstanbul–Eskişehir–Afyonkarahisar–Pamukkale Kültür Rotası", scope: "cevre-il", category: "kultur",
    summary: "Üç günlük kültür yolculuğu: Eskişehir müzeleri, Afyon merkez, Gazlıgöl termali ve Pamukkale.",
    description: [
      "Marmara'dan Ege'nin içlerine uzanan çok katmanlı rota sabah erken İstanbul'dan başlar; yaklaşık beş saatlik yolculukla Eskişehir'e varılır. Öğle yemeğinde çibörek ve balaban kebap gibi yöresel lezzetler tadılır.",
      "Afyonkarahisar'da Alimoğlu Müzik Koleksiyonu, Afyonkarahisar Müzesi, Ulu Cami, Millet Hamamı ve Mevlevihane gezilir; Uzun Çarşı'da sucuk, kaymak, haşhaşlı katmer ve ekmek kadayıfı sunan restoranlarda öğle yemeği verilir. Gün sonunda Gazlıgöl Termal Bölgesi'nde konaklanır.",
      "Son gün yaklaşık üç saatlik yolculukla Pamukkale'ye ulaşılır; Hierapolis Antik Kenti ve Pamukkale Travertenleri gezilir.",
    ],
    provinces: ["İstanbul", "Eskişehir", "Afyonkarahisar", "Denizli"], modes: ["arac"],
    stops: [
      { placeId: "istanbul", role: "baslangic" }, { placeId: "odunpazari" }, { placeId: "balmumu-muzesi" }, { placeId: "sazova" },
      { placeId: "alimoglu-muzik" }, { placeId: "afyon-muzesi" }, { placeId: "ulu-cami" }, { placeId: "millet-hamami" }, { placeId: "mevlevihane" },
      { placeId: "uzun-carsi", role: "mola", note: "Öğle yemeği ve alışveriş molası" }, { placeId: "gazligol", role: "konaklama" }, { placeId: "pamukkale", role: "bitis" },
    ],
    source: SRC,
  },
  {
    slug: "ankara-izmir-yht-kultur-rotasi", title: "Ankara–İzmir YHT Kültür Rotası", scope: "cevre-il", category: "kultur",
    summary: "Yüksek hızlı tren hattına entegre, Ankara'dan İzmir'e beş günlük kültür yolculuğu: Anıtkabir, Afyon Ulu Cami, Karun Hazineleri ve Agora.",
    description: [
      "Ankara–İzmir yüksek hızlı tren hattına entegre olarak planlanan bu kültür turu, misafirlerin Anadolu'nun tarihsel ve kültürel zenginliğini kesintisiz bir akış içinde deneyimlemesini amaçlar. Tur Ankara'da Anıtkabir ziyaretiyle başlar; I. ve II. Meclis binalarında Türkiye'nin kuruluş süreci kronolojik olarak aktarılır, Anadolu Medeniyetleri Müzesi'nde Hitit, Frig, Urartu ve Lidya birikimi incelenir, Hacı Bayram Veli Camii ile Augustus Tapınağı'nda Roma'dan Osmanlı'ya kültürel süreklilik anlatılır.",
      "Misafirler yüksek hızlı trenle Afyonkarahisar'a geçerek burada konaklar. Ertesi gün Ulu Cami, Afyonkarahisar Kalesi ve Mevlevihane gezilir. İsteğe bağlı bir günlük Frigya gezisiyle Ayazini, Avdalaz Kalesi, Aslantaş, Yılantaş ve Maltaş, Kral Yolu, Aslankaya Tapınağı ve Memeç Kayalıkları ziyaret edilebilir.",
      "Dördüncü gün trenle Uşak'a geçilir; Uşak Arkeoloji Müzesi'nde Karun Hazineleri, Blaundos Antik Kenti, Clandıras Köprüsü ve Ulubey Kanyonu gezilir. Akşam İzmir'e varılır; son gün Kordon, Konak Meydanı ve Saat Kulesi, Kemeraltı Çarşısı ve Agora Ören Yeri gezilir. Ertesi sabah yüksek hızlı trenle Ankara'ya dönülür.",
    ],
    provinces: ["Ankara", "Afyonkarahisar", "Uşak", "İzmir"],
    stops: [
      { placeId: "anitkabir", role: "baslangic", note: "1. gün · Ankara" }, { placeId: "birinci-meclis" }, { placeId: "ikinci-meclis" }, { placeId: "anadolu-medeniyetleri" },
      { placeId: "haci-bayram" }, { placeId: "augustus-tapinagi", note: "Akşam YHT ile Afyonkarahisar'a geçiş" },
      { placeId: "ulu-cami", note: "2. gün · Afyonkarahisar" }, { placeId: "afyon-kalesi", note: "Dışarıdan tanıtım" }, { placeId: "mevlevihane", role: "konaklama", note: "Afyonkarahisar'da konaklama" },
      { placeId: "ayazini", note: "3. gün · İsteğe bağlı Frigya gezisi" }, { placeId: "avdalaz-kalesi", note: "İsteğe bağlı" }, { placeId: "aslantas-yilantas", note: "İsteğe bağlı" },
      { placeId: "bayramaliler", note: "İsteğe bağlı · Kral Yolu" }, { placeId: "aslankaya", note: "İsteğe bağlı" }, { placeId: "memec", note: "İsteğe bağlı" },
      { placeId: "usak-arkeoloji", note: "4. gün · YHT ile Uşak" }, { placeId: "blaundos" }, { placeId: "clandiras-koprusu" }, { placeId: "ulubey-kanyonu", note: "Akşam YHT ile İzmir'e geçiş" },
      { placeId: "izmir-kordon", note: "5. gün · İzmir" }, { placeId: "konak-saat-kulesi" }, { placeId: "kemeralti" }, { placeId: "izmir-agora", role: "bitis", note: "İzmir'de konaklama; ertesi sabah YHT ile Ankara'ya dönüş" },
    ],
    tips: ["Rota, Ankara–İzmir yüksek hızlı tren hattına göre planlanmıştır; hattın hizmete giriş durumunu ve sefer saatlerini TCDD Taşımacılık duyurularından kontrol edin."],
    source: SRC,
  },
];

export const categoryLabels: Record<Route["category"], string> = {
  kultur: "Kültür", inanc: "İnanç", gastronomi: "Gastronomi", doga: "Doğa", termal: "Termal",
  "savas-alanlari": "Savaş alanları", "han-kervansaray": "Han ve kervansaray", frig: "Frig",
};
export const scopeLabels: Record<Route["scope"], string> = { "il-ici": "Afyonkarahisar", "cevre-il": "Çevre illerle" };
export const modeLabels = { arac: "Araçlı", yuruyus: "Yürüyüş", bisiklet: "Bisiklet" } as const;
export const difficultyLabels = { kolay: "Kolay", orta: "Orta", zor: "Zor" } as const;

export const getRoute = (slug: string) => routes.find((r) => r.slug === slug);
export const routeStops = (r: Route) => r.stops.map((s) => ({ ...s, place: getPlace(s.placeId) }));

export const tabs = [
  { id: "kesfet", label: "Keşfet", href: "/", d: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0M16.24 7.76l-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" },
  { id: "rotalar", label: "Rotalar", href: "/rotalar", d: "M6 16a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15M18 2a3 3 0 1 0 0 6a3 3 0 1 0 0-6z" },
  { id: "belirle", label: "Rotanı Belirle", href: "/rotani-belirle", d: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0M8 12h8M12 8v8" },
  { id: "sosyal", label: "Sosyal", href: "/sosyal", d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { id: "profil", label: "Profil", href: "/profil", d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z" },
] as const;
