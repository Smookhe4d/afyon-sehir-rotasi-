/** G-023, G-025: giriş sonrası kısa ve yazılı uygulama tanıtımı. */
export type TourStep = { title: string; text: string; audio?: string; target?: string; /** Hedef ekranda yoksa adım atlanır */ optional?: boolean; mock?: "tur" | "ses" | "harita" | "grup" };
export const TOUR_STEPS: TourStep[] = [
  {
    "title": "Hoş geldiniz",
    "text": "rotAfyon'u birkaç adımda tanıyalım."
  },
  {
    "title": "Rotalar",
    "text": "Hazır rotalar burada. Bir rotayı açıp Tura başla düğmesine basın.",
    "target": "[data-tab=\"rotalar\"]"
  },
  {
    "title": "Tur ekranı",
    "text": "Üstte kaçıncı durakta olduğunuzu görürsünüz. Önceki ve Sonraki düğmeleriyle duraklar arasında geçersiniz.",
    "mock": "tur"
  },
  {
    "title": "Sesli anlatım",
    "text": "Her durakta Dinle düğmesine basın. Geri alabilir, hızı değiştirebilir, metni okuyabilirsiniz.",
    "mock": "ses"
  },
  {
    "title": "Grup turu",
    "text": "Turist rehberinizin gönderdiği bağlantıya dokunup gruba katılın. Ekranınız turist rehberinizle birlikte ilerler.",
    "mock": "grup"
  }
];
