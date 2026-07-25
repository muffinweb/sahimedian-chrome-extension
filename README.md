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

### 🧩 Chrome Uzantısı Olarak Manuel Kurulum (Developer Mode)

Bu projeyi Chrome Web Mağazası'na ihtiyaç duymadan tarayıcınıza manuel olarak kolayca yükleyebilirsiniz:

1. **Projeyi İndirin:**
   - GitHub deposundaki yeşil **`Code`** butonuna tıklayıp **`Download ZIP`** seçeneği ile projeyi bilgisayarınıza indirin ve bir klasöre çıkartın.
   *(Eğer Git kullanıyorsanız: `git clone https://github.com/muffinweb/sahimedian-chrome-extension.git` komutuyla klonlayabilirsiniz.)*

2. **Chrome Uzantılar Sayfasını Açın:**
   - Google Chrome tarayıcınızı açın.
   - Adres çubuğuna `chrome://extensions` yazıp `Enter` tuşuna basın.
   *(Alternatif: Sağ üstteki **Üç Nokta ➔ Diğer Araçlar ➔ Uzantılar** yolunu izleyin.)*

3. **Geliştirici Modunu Aktif Edin:**
   - Açılan sayfanın sağ üst köşesinde yer alan **"Geliştirici modu" (Developer mode)** anahtarını açık konuma getirin.

4. **Uzantıyı Yükleyin:**
   - Sol üstte beliren **"Paketlenmemiş öğe yükle" (Load unpacked)** butonuna tıklayın.
   - Dosyalarını çıkarttığınız proje klasörünü (içinde `manifest.json` bulunan klasör) seçin.

5. **Kullanmaya Başlayın:**
   - Uzantı başarıyla yüklenecektir. Sahibinden.com üzerindeki herhangi bir gayrimenkul arama sonuç sayfasına girdiğinizde analiz arayüzü otomatik olarak hazır hale gelecektir.

---

## 📸 Ekran Görüntüsü

<img width="1445" height="772" alt="Ekran Resmi 2026-07-25 20 14 08" src="https://github.com/user-attachments/assets/614e8bd0-005b-46e3-9f9a-0755629fe12e" />

