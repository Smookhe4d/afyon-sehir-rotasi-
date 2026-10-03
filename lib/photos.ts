/** Fotoğraflar Wikimedia Commons'tan; sahibi ve lisansı her kayıtta belirtilir. Doğrulanmamış duraklar bilerek yok. */
export type Photo = { src: string; alt: string; author: string; license: string; page: string; pos?: string };

export const heroPhoto: Photo = {"src": "/art/hero-kale.jpg", "alt": "Afyonkarahisar Kalesi ve şehir", "author": "Ingeborg Simon", "license": "CC BY-SA 3.0", "page": "https://commons.wikimedia.org/wiki/File:Burgberg_Afyonkarahisar_01.jpg"};

export const photos: Record<string, Photo> = {
  "afyon-muzesi": {"src": "/photos/afyon-muzesi.jpg", "alt": "Afyonkarahisar Müzesi fotoğrafı", "author": "Nabbegat", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar_M%C3%BCzesi_01.jpg"},
  "ulu-cami": {"src": "/photos/ulu-cami.jpg", "alt": "Afyon Ulu Cami fotoğrafı", "author": "Dosseman", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar_Ulu_Camii_Exterior_1881.jpg"},
  "millet-hamami": {"src": "/photos/millet-hamami.jpg", "alt": "Millet Hamamı fotoğrafı", "author": "Dosseman", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar_Millet_Hamam%C4%B1_from_far_1890.jpg"},
  "mevlevihane": {"src": "/photos/mevlevihane.jpg", "alt": "Sultan Divani Mevlevihanesi fotoğrafı", "author": "Dosseman", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar_Mevlevihanesi_Ceiling_022.jpg"},
  "zafer-muzesi": {"src": "/photos/zafer-muzesi.jpg", "alt": "Zafer Müzesi fotoğrafı", "author": "Gargarapalvin", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Zafer_M%C3%BCzesi,_Afyonkarahisar,_2019_02.jpg"},
  "kubbeli-cami": {"src": "/photos/kubbeli-cami.jpg", "alt": "Kubbeli Camii fotoğrafı", "author": "Dosseman", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar_Door_of_Kubeli_Camii_3686.jpg"},
  "otpazari-cami": {"src": "/photos/otpazari-cami.jpg", "alt": "Ot Pazarı Camii fotoğrafı", "author": "Dosseman", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar_Ot_Pazar%C4%B1_Mosque_2134.jpg"},
  "aslankaya": {"src": "/photos/aslankaya.jpg", "alt": "Aslankaya Açık Hava Tapınağı fotoğrafı", "author": "Serkanakdogan", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Aslankaya_A%C3%A7%C4%B1k_Hava_Tap%C4%B1na%C4%9F%C4%B1-_Afyonkarahisar.jpg"},
  "kocatepe-aniti": {"src": "/photos/kocatepe-aniti.jpg", "alt": "Kocatepe Anıtı fotoğrafı", "author": "Enas Rudaini", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Afyonkarahisar,_Kocatepe_An%C4%B1t%C4%B1_,_a_historical_place_with_great_view_scene.jpg"},
  "yazilikaya": {"src": "/photos/yazilikaya.jpg", "alt": "Yazılıkaya (Midas Anıtı) fotoğrafı", "author": "Thecatcherintherye", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Yaz%C4%B1l%C4%B1kaya_Midas_An%C4%B1t%C4%B1.jpg"},
  "sazova": {"src": "/photos/sazova.jpg", "alt": "Sazova Bilim, Sanat ve Kültür Parkı fotoğrafı", "author": "Honacan", "license": "CC BY-SA 3.0", "page": "https://commons.wikimedia.org/wiki/File:Bilim_sanat_ve_kultur_parki_eskisehir.jpg"},
  "kizileren-han": {"src": "/photos/kizileren-han.jpg", "alt": "Kızılören Hanı fotoğrafı", "author": "Volker Höhfeld", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:K%C4%B1z%C4%B1l%C3%B6ren_16_09_1972_K%C4%B1z%C4%B1l%C3%B6ren_Han%C4%B1_und_K%C3%BC%C3%A7%C3%BCk_K%C4%B1z%C4%B1l%C3%B6ren_Han%C4%B1.jpg"},
  "ayazini": {"src": "/photos/ayazini.jpg", "alt": "Ayazini (Metropolis) Ören Yeri fotoğrafı", "author": "Raicem", "license": "CC0", "page": "https://commons.wikimedia.org/wiki/File:Ayazini_village_and_the_ancient_settlements_in_the_background.jpg"},
  "gordion": {"src": "/photos/gordion.jpg", "alt": "Gordion Antik Kenti fotoğrafı", "author": "Gordion Archive, Penn Museum", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Gordion_Early_Phrygian_East_Gate.jpg"},
  "akhan": {"src": "/photos/akhan.jpg", "alt": "Akhan Kervansarayı fotoğrafı", "author": "Christian1311", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Ak_Han_von_S%C3%BCden;_bei_Denizli.jpg"},
  "gazligol": {"src": "/photos/gazligol.jpg", "alt": "Gazlıgöl Termal Bölgesi fotoğrafı", "author": "Bluetime93", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Gazl%C4%B1g%C3%B6l_Thermal_Bath,_2024_1.jpg"},
};
