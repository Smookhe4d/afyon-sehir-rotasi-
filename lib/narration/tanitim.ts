/** G-023: giriş sonrası uygulama tanıtımının adımları. Metinler sesli kayıtlarla birebir aynıdır. */
export type TourStep = { title: string; text: string; audio: string; target?: string; /** Hedef ekranda yoksa adım atlanır (örneğin masaüstünde QR düğmesi yok) */ optional?: boolean; mock?: "tur" | "ses" | "harita" | "grup" };
export const TOUR_STEPS: TourStep[] = [
  {
    "title": "Hoş geldiniz",
    "text": "Merhaba, rotAfyon'a hoş geldiniz! Ben Elif. Bir dakikada uygulamayı birlikte tanıyalım. Her adımda ilgili düğmeyi ekranda göstereceğim.",
    "audio": "/audio/tanitim/tanitim-1.mp3"
  },
  {
    "title": "Keşfet",
    "text": "Burası Keşfet sekmesi. Öne çıkan rotaları, yakınınızdaki yerleri ve hava durumunu burada görürsünüz.",
    "audio": "/audio/tanitim/tanitim-2.mp3",
    "target": "[data-tab=\"kesfet\"]"
  },
  {
    "title": "Arama",
    "text": "Aramak istediğiniz bir yer varsa bu kutuya adını yazın. Duraklar ve rotalar hemen listelenir.",
    "audio": "/audio/tanitim/tanitim-3.mp3",
    "target": "[data-tour=\"search\"]",
    "optional": true
  },
  {
    "title": "Rotalar",
    "text": "Rotalar sekmesinde tüm hazır rotalar var. Bir rotayı açıp Tura başla dediğinizde durak durak gezmeye başlarsınız.",
    "audio": "/audio/tanitim/tanitim-4.mp3",
    "target": "[data-tab=\"rotalar\"]"
  },
  {
    "title": "Sosyal",
    "text": "Sosyal sekmesinde diğer gezginlerin paylaşımlarını görebilir, kendi deneyiminizi paylaşabilirsiniz.",
    "audio": "/audio/tanitim/tanitim-5.mp3",
    "target": "[data-tab=\"sosyal\"]"
  },
  {
    "title": "Profil",
    "text": "Profil sekmesinde gezdiğiniz durakları, kazandığınız rozetleri ve ayarlarınızı bulursunuz. Bu tanıtımı da oradan yeniden izleyebilirsiniz.",
    "audio": "/audio/tanitim/tanitim-6.mp3",
    "target": "[data-tab=\"profil\"]"
  },
  {
    "title": "QR okuyucu",
    "text": "Bu yuvarlak düğme QR okuyucu. Duraklardaki QR kodu okutursanız o durağın anlatımı doğrudan açılır.",
    "audio": "/audio/tanitim/tanitim-7.mp3",
    "target": "[data-tour=\"qr\"]",
    "optional": true
  },
  {
    "title": "Tur ekranı",
    "text": "Tura başladığınızda ekranın üstünde kaçıncı durakta olduğunuzu görürsünüz. Alttaki Önceki ve Sonraki düğmeleriyle duraklar arasında geçersiniz.",
    "audio": "/audio/tanitim/tanitim-8.mp3",
    "mock": "tur"
  },
  {
    "title": "Sesli anlatım",
    "text": "Her durakta sesli anlatım var. Dinle düğmesine basın. On beş saniye geri ya da ileri alabilir, hızı değiştirebilir, konuşmanın metnini ekranda okuyabilirsiniz.",
    "audio": "/audio/tanitim/tanitim-9.mp3",
    "mock": "ses"
  },
  {
    "title": "Harita",
    "text": "Üstteki Harita sekmesine geçince konumunuzu ve bir sonraki durağa giden yolu görürsünüz. Bir durağa vardığınızda uygulama bunu kendisi anlar ve durağı gezildi olarak işaretler.",
    "audio": "/audio/tanitim/tanitim-10.mp3",
    "mock": "harita"
  },
  {
    "title": "Grup turu",
    "text": "Grupla geziyorsanız turist rehberiniz size bir bağlantı gönderir. Bağlantıya dokunup gruba katılın. Turist rehberiniz bir sonraki durağa geçtiğinde ekranınız da onunla birlikte ilerler.",
    "audio": "/audio/tanitim/tanitim-11.mp3",
    "mock": "grup"
  },
  {
    "title": "Hazırsınız",
    "text": "Hepsi bu kadar! Telefonunuzun sesini açın, kulaklığınız varsa takın. İyi gezmeler!",
    "audio": "/audio/tanitim/tanitim-12.mp3"
  }
];
