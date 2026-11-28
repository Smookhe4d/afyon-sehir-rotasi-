/** G-027: Sosyal alanda küfür ve hakaret içeren yazıları paylaşılmadan önce durdurur.
 *  Kesin süzgeç değildir. Gözden kaçan içerik yönetim panelinden kaldırılır. */
const KOKLER = [
  "amk", "aq", "amina", "aminako", "amcik", "amcık", "orospu", "orspu", "oruspu", "pic", "piç", "pezevenk", "sik", "sikerim", "siktir", "sikik",
  "yarak", "yarrak", "yarram", "got", "göt", "gotveren", "götveren", "ibne", "kahpe", "kaltak", "surtuk", "sürtük", "serefsiz", "şerefsiz",
  "gavat", "pust", "puşt", "dalyarak", "yavsak", "yavşak", "gerizekali", "gerizekalı",
  "fuck", "shit", "bitch", "asshole", "dick", "cunt", "whore", "porn", "porno",
];
// Masum kelimeler (ör. "sikke", "gotik", "picnic") yanlış yakalanmasın diye kısa kökler yalnızca tam kelime olarak aranır.
const EK = "(?:[a-zçğıöşü]{0,6})";
const ONLY = new Set(["aq", "got", "göt", "pic", "piç", "sik", "dick"]);

function sade(s: string) {
  return s.toLocaleLowerCase("tr-TR")
    .replace(/[0@]/g, "o").replace(/[1!|]/g, "i").replace(/3/g, "e").replace(/4/g, "a").replace(/5\$/g, "s").replace(/7/g, "t")
    .replace(/[.*_\-+~'"`´]/g, "")
    .replace(/(.)\1{2,}/g, "$1$1");
}

const RE = new RegExp(
  `(?:^|[^a-zçğıöşü])(?:${KOKLER.map((k) => (ONLY.has(k) ? `${k}(?=$|[^a-zçğıöşü])` : `${k}${EK}`)).join("|")})(?=$|[^a-zçğıöşü])`,
  "u",
);

export function kufurVar(text: string) {
  const t = sade(text);
  return RE.test(t) || RE.test(t.replace(/\s+/g, " "));
}
