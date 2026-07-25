# 📊 Sahibinden Real Estate Market Analyzer

**Sahibinden Real Estate Market Analyzer**, Sahibinden.com üzerindeki emlak arama sonuçlarını anlık olarak analiz eden, istatistiki fiyat segmentasyonu oluşturan ve interaktif simülasyon imkanı sunan bir tarayıcı içi analiz aracıdır.

Piyasadaki veri gürültüsünü (aşırı yüksek veya aşırı düşük fiyatlı ilanlar) eleyerek gerçekçi pazar değerini tespit etmenize ve en avantajlı F/P (Fiyat/Performans) ilanlarını kolayca keşfetmenize yardımcı olur.

---

## 🚀 Öne Çıkan Özellikler

- 📐 **İstatistiki Segment Analizi:**
  - **⚡ Hızlı Satış (Kelepir) Ortalaması:** Alt %20'lik dilimdeki ilanların ortalaması.
  - **🎯 Makul Piyasa Ortalaması:** %10 - %90 arası makul bantta kalan ilanların ortalaması.
  - **💎 Tok Satıcı (Üst Limit) Ortalaması:** Üst %20'lik dilimdeki ilanların ortalaması.
  - **⚖️ Medyan $m^2$ Hesabı:** Aykırı değerleri ezen metrekare birim fiyat hesaplaması.

- 🧮 **Gelişmiş Özel $m^2$ & Marj Simülatörü:**
  - Kendi taşınmazınızın $m^2$ değerini girerek anlık tahmini fiyat hesaplama.
  - Mod geçiş butonları (`Hızlı Satış`, `Makul Piyasa`, `Tok Satıcı`).
  - **Pazarlık / Prim Yüzdesi:** Belirlediğiniz bir yüzde oranını (%20, %15 vb.) **Artış (+)** veya **Düşüş (-)** yönlü ekleyerek simüle edebilme.

- 🎯 **Dereceli F/P İlan Gezgini (Navigator):**
  - Tüm ilanları $m^2$ birim fiyatına göre en iyiden en kötüye sıralama.
  - Ekranın sağ alt köşesindeki şeffaf panel üzerinden **"Önceki / Sonraki"** butonlarıyla ilanlar arasında gezinme.
  - Seçilen ilana pürüzsüz kaydırma (**Smooth Scroll**) ve yeşil çerçeve / sıra rozeti ile vurgulama.

- 📸 **Raporlama & Görsel Alma:**
  - `html2canvas` entegrasyonu sayesinde analiz sonuç kartını tek tıkla yüksek çözünürlüklü **PNG** olarak bilgisayara indirme.

---

## 🛠️ Teknolojiler

- **Dil:** JavaScript (ES6+ Native DOM API & IIFE)
- **Arayüz (UI):** [SweetAlert2](https://sweetalert2.github.io/)
- **Ekran Görüntüsü Motoru:** [html2canvas](https://html2canvas.hertzen.com/)

---

## 📦 Kurulum ve Kullanım

### Yöntem 1: Developer Console (Hızlı Kullanım)

1. Sahibinden.com üzerinde herhangi bir gayrimenkul arama sonuç sayfasına gidin (örn: _İzmir Konak Satılık Daire_).
2. Klavyenizden `F12` veya `Ctrl + Shift + I` (Mac'te `Cmd + Option + I`) basarak **Developer Tools** ekranını açın.
3. **Console** sekmesine gelin.
4. `script.js` dosyasındaki kodların tamamını yapıştırıp `Enter` tuşuna basın.
5. Sayfanın sağ üst köşesinde beliren **"📊 Tam Piyasa Analizi Yap"** butonuna tıklayın.

### Yöntem 2: Bookmarklet (Yer İmleri Butonu)

1. Tarayıcınızda yeni bir yer imi (bookmark) oluşturun.
2. Yer iminin adını `Emlak Analiz` yapın.
3. Adres / URL kısmına `javascript:` yazıp ardından `script.js` içeriğini yapıştırın.
4. Sahibinden ilan sayfasındayken bu yer imine tıklayarak çalıştırın.

---

## 📸 Ekran Görüntüsü

_(Buraya oluşturduğun SweetAlert2 analiz kartının ve F/P gezgininin bir ekran görüntüsünü ekleyebilirsin)_

```text
[Analiz Kartı Görseli]
```
