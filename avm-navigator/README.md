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

Harici bağımlılık yok (yalnızca Google Fonts internetten yüklenir; erişilemezse
sistem fontlarına düşer). Canlı önizleme (Artifact) bağlantısı sohbet üzerinden
paylaşıldı.

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

| AVM | Konum | Katlar |
|-----|-------|--------|
| İstinye Park | Sarıyer | Zemin · Kat 1 · Kat 2 |
| Zorlu Center | Beşiktaş | Metro (−2) · B1 · Zemin · Teras |
| İstanbul Cevahir | Şişli | B1 · Zemin · Kat 1–4 |
| Aqua Florya | Florya (Bakırköy) | Zemin · Kat 1 · Kat 2 · Kat 3 |

## Önemli not (veri)

Bu bir **prototiptir**. Mağaza listeleri ve marka/kat yerleşimi, gerçek AVM
web sitelerindeki mağaza rehberleri temel alınarak **kürasyonla** oluşturulmuştur;
mağazaların koridor içindeki tam koordinatları ve ürün fiyatları **temsilîdir**.
Amaç, yorumlama → sıralama → rota akışını uçtan uca göstermektir.

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

Bu uygulama **tek statik HTML dosyasıdır** — sunucu/backend yoktur. Yayınlamak
için birkaç yol var:

- **Claude Artifact** — en hızlısı. Sohbette yayınlanan Artifact linki zaten
  canlıdır; sayfadaki paylaş menüsünden başkalarıyla paylaşabilirsin. Ayrı bir
  cloud repo **gerekmez**.
- **Kendi alan adın / kalıcı hosting** — statik dosya olduğu için herhangi bir
  statik hostta yayınlanır: GitHub Pages (bu repodan doğrudan), Netlify, Vercel,
  Cloudflare Pages. Bunların çoğu bir Git reposuna bağlanır; yani "cloud repo"
  yalnızca **kendi hostinginde** yayınlamak istersen gerekir, Claude üzerinden
  paylaşmak için değil.

> 3B mod three.js'i CDN'den çektiği için yayında **internet** gerektirir.

## Dosyalar

```
avm-navigator/
├── index.html   # tek dosyalık uygulama (veri + mantık + arayüz)
└── README.md    # bu dosya
```
