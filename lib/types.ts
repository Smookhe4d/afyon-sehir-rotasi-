export type PlaceKind =
  | "muze" | "cami" | "hamam" | "turbe" | "han" | "kale" | "oren-yeri" | "doga"
  | "carsi" | "yeme-icme" | "anit" | "park" | "termal" | "kasaba" | "diger";

export type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  /** İlçe / il bilgisi (belgede geçtiği kadarıyla) */
  area: string;
  /** Turist odaklı kısa not; kaynak belgedeki bilgiden türetilmiştir */
  note?: string;
  /** [boylam, enlem]. precision "area": yaklaşık konum (bina/nokta doğrulanmadı) */
  coords?: [number, number];
  precision?: "exact" | "area";
  /** Kaynaklı anlatım paragrafları */
  about?: string[];
  facts?: { label: string; value: string }[];
  visitTips?: string[];
  sources?: { title: string; url: string }[];
  /** public/ altında göreli yol; fotoğraflar sonradan eklenir */
  photo?: string;
};

export type RouteScope = "il-ici" | "cevre-il";
export type RouteCategory = "kultur" | "inanc" | "gastronomi" | "doga" | "termal" | "savas-alanlari" | "han-kervansaray" | "frig";
export type Difficulty = "kolay" | "orta" | "zor";

export type RouteStop = {
  placeId: string;
  /** Bu rota bağlamındaki ek not (ör. "öğle yemeği molası") */
  note?: string;
  /** Rota başlangıç/bitiş işareti */
  role?: "baslangic" | "bitis" | "mola" | "konaklama";
};

export type Route = {
  slug: string;
  title: string;
  scope: RouteScope;
  category: RouteCategory;
  /** Kısa tanıtım (1–2 cümle) */
  summary: string;
  /** Uzun anlatım; paragraflar */
  description: string[];
  /** Belgede açıkça belirtilen uzunluk (km). Tahmin edilmez. */
  distanceKm?: number;
  distanceNote?: string;
  /** Belgede belirtilmişse */
  difficulty?: Difficulty;
  difficultyNote?: string;
  /** Yürüyüş / bisiklet gibi belgede geçen yapılabilirlik */
  modes?: ("arac" | "yuruyus" | "bisiklet")[];
  /** Rota kapsadığı iller (çok il için) */
  provinces?: string[];
  stops: RouteStop[];
  /** Ziyaretçiye faydalı pratik notlar */
  tips?: string[];
  source?: string;
};

export type PlaceExtra = Pick<Place, "coords" | "precision" | "about" | "facts" | "visitTips" | "sources">;
