# AVM Rota — prototip

AVM'de saatlerce dolaşmayı sevmeyen tüketiciler için: **gitmeden önce** ne almak
istediğini gündelik dille yaz; uygulama uygun ürünleri **fiyat ve kaliteye göre**
sıralayıp seni **doğru katlara / mağazalara en kısa yürüyüş rotasıyla** yönlendirir.

> Örnek: _"smokin için uygun bir ayakkabı arıyorum"_ → sistem bunu
> **ürün: ayakkabı**, **ortam: resmi/smokin** olarak yorumlar; klasik/rugan
> ayakkabıları puanlayıp sıralar ve seçilen AVM içinde numaralı bir rota çıkarır.

## Çalıştırma

Tek dosyalık, kurulum gerektirmeyen bir web uygulamasıdır. Sadece aç:

```
avm-navigator/index.html   →  tarayıcıda çift tıkla
```

Harici bağımlılık yok (yalnızca Google Fonts ve 3B için three.js internetten
yüklenir; erişilemezse sistem fontlarına / 2B görünüme düşer). Canlı önizleme
(Artifact) bağlantısı sohbet üzerinden paylaşıldı.

Tasarım: sade, minimalist ve şık bir yön — sıcak nötr zemin, ince ayraç çizgileri,
gölgesiz kartlar, tek dingin vurgu rengi; açık/koyu tema desteği.

**Mobil:** dar ekranda akan tek sayfa yerine **alt sekme çubuğu** (Ara · Ürünler ·
Rota) devreye girer; her sekme tek bir bölümü gösterir, app hissi verir. Masaüstünde
iki sütun düzeni korunur.

## Telefonda çalıştırma (PWA)

Uygulama **kurulabilir bir PWA**'dır (`manifest.webmanifest` + `sw.js` + `icon.svg`).
HTTPS bir adreste (ör. GitHub Pages) açtığında telefon tarayıcısından
**"Ana ekrana ekle"** dersen, tam ekran, kendi ikonlu bir app gibi çalışır ve
service worker sayesinde ilk açılıştan sonra **çevrimdışı** da çalışır.

- Telefonda **şimdi** denemek için: canlı önizleme (Artifact) linkini telefon
  tarayıcısında aç → mobil düzen otomatik. Kurulabilir PWA olarak eklemek için
  kendi HTTPS adresinde (GitHub Pages) yayınlaman gerekir (`file://` ve gömülü
  önizlemede service worker kaydı devre dışıdır).
- **Uygulama mağazası** (App Store / Google Play) sürümü istersen: bu PWA'yı
  Capacitor ile sarmalayıp native bir kabuk üretilir (Xcode / Android Studio gerekir).
- iOS için `apple-touch-icon` prod'da PNG olmalı; şu an SVG ikon kullanılıyor.

## Ne yapıyor?

1. **Doğal dil çözümleme** (`parseQuery`) — Türkçe metinden çıkarır:
   - **kategori**: ayakkabı, takım/smokin, gömlek, kravat/papyon, çanta, parfüm…
   - **ortam**: resmi/smokin, iş/ofis, günlük, spor
   - **eğilim**: uygun fiyat / üst segment, kalite önceliği, cinsiyet, bütçe (ör. "3000 TL altında")
   - Türkçeye özgü incelikler: _"smokin için **uygun** ayakkabı"_ → "uygun" = **yakışan**,
     "ucuz" değil; kelime-sınırı eşleştirmesiyle "iş" ↛ "ayakkab**ış**ı" yanlış eşleşmesi engellenir.
2. **Puanlama & sıralama** (`scoreItem`, `buildMatches`) — her ürünü ortam uyumu,
   kalite, fiyat eğilimi ve bütçeye göre 0–100 arası puanlar; fiyat/kalite/eşleşmeye
   göre sıralanabilir.
3. **Rota planlama** (`planRoute`) — seçilen AVM ve giriş noktasından başlayarak
   en iyi eşleşen mağazaları en-yakın-komşu ile sıralar; kat değişimlerini yürüyen
   merdivenden geçirir, toplam mesafe/süre/kat sayısını hesaplar.
4. **Wayfinding haritası** — iki görünüm modu:
   - **2B Plan** (`buildMap`, SVG) — katları üst üste şerit olarak çizer;
     mağazaları koridorun iki yanına yerleştirir; rotayı turuncu çizgi ve numaralı
     duraklarla gösterir.
   - **3B Görünüm** (`VIEW3D`, three.js) — katları üst üste dilimler olarak,
     mağazaları blok, rotayı koridor boyunca uzanan turuncu bir tüp olarak çizer;
     sürükleyerek döndür, tekerlekle yakınlaştır. three.js CDN'den yüklenir; bu
     yüzden 3B mod **internet bağlantısı** ister (çevrimdışıysa 2B'ye düşer).
   - Her iki modda da adım adım yönerge listesi eşlik eder.

## Prototip için seçilen AVM'ler

Gerçek İstanbul AVM'lerinin **kat yapısı ve marka karması** temel alınmıştır:

| AVM | Konum | Katlar | Mağaza |
|-----|-------|--------|--------|
| **Aqua Florya** ⭐ (bayrak / test AVM'si) | Florya (Bakırköy) | Zemin · Kat 1 · Kat 2 · Kat 3 | ~66 (tüm katlar) |
| İstinye Park | Sarıyer | Zemin · Kat 1 · Kat 2 | ~13 |
| Zorlu Center | Beşiktaş | Metro (−2) · B1 · Zemin · Teras | ~11 |
| İstanbul Cevahir | Şişli | B1 · Zemin · Kat 1–4 | ~14 |

**Aqua Florya**, saha testleri için **bayrak AVM** olarak seçildi: 4 katın tümünde
moda, ayakkabı, resmi giyim, spor, çocuk, kozmetik, kuyum/saat, elektronik, ev,
kitap, market ve yeme-içme kategorilerinde **~66 mağazalık** genişletilmiş bir
veritabanıyla dolduruldu. Uygulama açılışta ve aramada **varsayılan olarak Aqua
Florya'yı** seçer.

## Önemli not (veri)

Bu bir **prototiptir**. Aqua Florya mağaza listesi, ~160 mağazalık gerçek AVM'nin
tipik zincir karması ve doğrulanan birkaç marka (ör. Sneaks Up, Altınbaş, Apple)
temel alınarak **kürasyonla** genişletilmiştir; mağazaların **tam kat/koridor
yerleşimi ve fiyatlar temsilîdir** (resmî mağaza rehberine ağ politikası izin
vermediği için canlı çekilemedi). Saha testinde gerçekle farklılık görürsen
söyle, veritabanını ona göre düzeltelim. Amaç, yorumlama → sıralama → rota
akışını uçtan uca göstermektir.

Üründe sıradaki adım, kat planlarını AVM'lerin resmî yönlendirme/harita
servislerinden (veya API'lerinden) **canlı** çekmek ve gerçek ürün kataloglarına
(fiyat/stok) bağlanmaktır.

## Yol haritası (öneri)

- [ ] Gerçek kat planı/koordinat verisinin AVM kaynaklarından beslenmesi
- [ ] Ürün kataloğu & fiyat entegrasyonu (mağaza API / fiyat karşılaştırma)
- [ ] LLM tabanlı niyet çözümleme (daha esnek Türkçe anlama)
- [ ] "Buradasınız" konumundan canlı yönlendirme (mobil)
- [ ] Kullanıcı fav/ geçmiş, birden çok ürünü tek turda toplama optimizasyonu

## Yayına alma (deploy)

Bu uygulama **tek statik HTML dosyasıdır** — sunucu/backend yoktur.

### GitHub Pages (önerilen, telefona kurulabilir PWA için gerekli)

Kod tarafı hazır (kök `index.html` yönlendirmesi + `.nojekyll`). Pages ayarını
API'den açamadığım için **tek seferlik şu adımı sen yap** (~20 sn):

1. GitHub'da repo → **Settings → Pages**
2. **Build and deployment → Source: _Deploy from a branch_**
3. **Branch:** `claude/avm-navigation-app-prototype-77tk26` · **Folder:** `/ (root)` → **Save**
4. 1–2 dk sonra yayında:
   - `https://emreaktepe.github.io/MyFirstShiny/` (otomatik uygulamaya yönlenir)
   - `https://emreaktepe.github.io/MyFirstShiny/avm-navigator/` (doğrudan)

Telefonda o adresi aç → tarayıcı menüsü → **"Ana ekrana ekle"** → app gibi çalışır.
(İstersen bu dalı `main`'e merge edip Pages'i `main`'den de yayınlayabilirsin.)

### Diğer seçenekler

- **Claude Artifact** — en hızlısı, repo gerekmez; sohbetteki link zaten canlı,
  paylaş menüsünden paylaşılır (ancak service worker/PWA kurulumu iframe'de pasif).
- **Netlify / Vercel / Cloudflare Pages** — repoyu bağla, kök dizini yayınla.

> 3B mod three.js'i CDN'den çektiği için yayında **internet** gerektirir.

## Dosyalar

```
avm-navigator/
├── index.html            # tek dosyalık uygulama (veri + mantık + arayüz + 2B/3B harita)
├── manifest.webmanifest  # PWA manifesti (ad, ikon, tema rengi, standalone)
├── sw.js                 # service worker (app shell cache, çevrimdışı)
├── icon.svg              # uygulama ikonu (maskable)
└── README.md             # bu dosya
```
