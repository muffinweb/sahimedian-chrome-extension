(function () {
  // Global Durum Değişkenleri (F/P Gezgini İçin)
  let sortedFpItems = [];
  let currentFpIndex = 0;

  // Yardımcı İstatistik Fonksiyonları
  function calculateMedian(numbers) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
    } else {
      return sorted[middle];
    }
  }

  function calculatePercentileAverage(numbers, startRatio, endRatio) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);

    const startIndex = Math.floor(sorted.length * startRatio);
    const endIndex = Math.ceil(sorted.length * endRatio);

    const slice = sorted.slice(startIndex, endIndex);
    if (slice.length === 0) return 0;

    const sum = slice.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / slice.length);
  }

  function parseDaysAgo(dateStr) {
    if (!dateStr) return 0;
    const cleanStr = dateStr.trim().toLowerCase();
    if (cleanStr.includes("bugün")) return 0;
    if (cleanStr.includes("dün")) return 1;

    const months = {
      ocak: 0,
      şubat: 1,
      mart: 2,
      nisan: 3,
      mayıs: 4,
      haziran: 5,
      temmuz: 6,
      ağustos: 7,
      eylül: 8,
      ekim: 9,
      kasım: 10,
      aralık: 11,
    };

    const parts = cleanStr.split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1];
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && months[monthStr] !== undefined && !isNaN(year)) {
        const listingDate = new Date(year, months[monthStr], day);
        const today = new Date();
        const diffTime = Math.abs(today - listingDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }
    return 0;
  }

  // 3. F/P İlanı Vurgulama ve Odaklanma Fonksiyonu
  function highlightFpItem(index) {
    if (!sortedFpItems || sortedFpItems.length === 0) return;

    if (index < 0) index = 0;
    if (index >= sortedFpItems.length) index = sortedFpItems.length - 1;
    currentFpIndex = index;

    document
      .querySelectorAll(".fp-highlight-badge")
      .forEach((el) => el.remove());
    document
      .querySelectorAll("#searchResultsTable tbody tr.searchResultsItem")
      .forEach((r) => (r.style.outline = ""));

    const target = sortedFpItems[currentFpIndex];
    if (target && target.element) {
      target.element.style.outline = "3px solid #16a34a";
      target.element.style.position = "relative";

      target.element.scrollIntoView({ behavior: "smooth", block: "center" });

      const counterEl = document.getElementById("fp-nav-counter");
      if (counterEl) {
        counterEl.innerText = `${currentFpIndex + 1} / ${sortedFpItems.length}`;
      }
    }
  }

  // 4. Sağ Alt Köşedeki Şeffaf Gezinme Panelini Oluşturma
  function createNavigationUi() {
    const existingNav = document.getElementById("fp-navigator-ui");
    if (existingNav) existingNav.remove();

    const navContainer = document.createElement("div");
    navContainer.id = "fp-navigator-ui";
    navContainer.style.cssText = `
            position: fixed; bottom: 25px; right: 25px; z-index: 999999;
            background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
            padding: 8px 14px; border-radius: 30px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(255, 255, 255, 0.2); font-family: Arial, sans-serif;
            display: flex; align-items: center; gap: 10px; color: #fff;
        `;

    navContainer.innerHTML = `
            <span style="font-size: 11px; font-weight: bold; color: #cbd5e1; text-transform: uppercase;">F/P Sıra:</span>
            <button id="btn-fp-prev" style="
                background: rgba(255, 255, 255, 0.15); color: #fff; border: none; padding: 5px 10px;
                border-radius: 20px; font-size: 12px; font-weight: bold; cursor: pointer; transition: background 0.2s;
            ">◀ Önceki</button>
            <span id="fp-nav-counter" style="font-size: 12px; font-weight: bold; color: #4ade80; min-width: 45px; text-align: center;">
                1 / ${sortedFpItems.length}
            </span>
            <button id="btn-fp-next" style="
                background: #16a34a; color: #fff; border: none; padding: 5px 12px;
                border-radius: 20px; font-size: 12px; font-weight: bold; cursor: pointer; transition: background 0.2s;
            ">Sonraki ▶</button>
        `;

    document.body.appendChild(navContainer);

    document.getElementById("btn-fp-prev").addEventListener("click", () => {
      if (currentFpIndex > 0) highlightFpItem(currentFpIndex - 1);
    });

    document.getElementById("btn-fp-next").addEventListener("click", () => {
      if (currentFpIndex < sortedFpItems.length - 1)
        highlightFpItem(currentFpIndex + 1);
    });
  }

  // 5. Tabloyu Taramak ve Analiz Etmek İçin Ana Fonksiyon
  function analyzeTable() {
    const rows = document.querySelectorAll(
      "#searchResultsTable tbody tr.searchResultsItem",
    );

    const items = [];
    const prices = [];
    const pricesPerSqm = [];
    const listingAges = [];

    rows.forEach((row) => {
      if (
        row.classList.contains("nativeAd") ||
        row.classList.contains("searchResultsPromoSuper")
      )
        return;

      const priceEl = row.querySelector("td.searchResultsPriceValue span");
      let price = 0;
      if (priceEl) {
        price = parseFloat(priceEl.innerText.replace(/[^0-9]/g, "")) || 0;
      }

      const attributeCells = row.querySelectorAll(
        "td.searchResultsAttributeValue",
      );
      const sqmRaw = attributeCells[0]
        ? attributeCells[0].innerText.trim()
        : "0";
      const sqm = parseFloat(sqmRaw.replace(".", "").replace(",", ".")) || 0;

      const dateEl = row.querySelector("td.searchResultsDateValue");
      const dateText = dateEl ? dateEl.innerText.replace(/\n/g, " ") : "";
      const daysAgo = parseDaysAgo(dateText);

      if (price > 0) {
        const m2Price = sqm > 0 ? Math.round(price / sqm) : 0;
        items.push({ element: row, price, sqm, m2Price, daysAgo });
        prices.push(price);
        if (sqm > 0) pricesPerSqm.push(m2Price);
        if (daysAgo > 0) listingAges.push(daysAgo);
      }
    });

    if (items.length === 0) {
      if (window.Swal) {
        Swal.fire({
          icon: "warning",
          title: "İlan Bulunamadı",
          text: "Sayfada geçerli ilan satırı tespit edilemedi.",
        });
      } else {
        alert("Sayfada geçerli ilan satırı bulunamadı.");
      }
      return;
    }

    sortedFpItems = items
      .filter((i) => i.m2Price > 0)
      .sort((a, b) => a.m2Price - b.m2Price);

    const sortedM2 = [...pricesPerSqm].sort((a, b) => a - b);
    const minM2Price = sortedM2[0] || 0;
    const maxM2Price = sortedM2[sortedM2.length - 1] || 0;
    const m2Spread = maxM2Price - minM2Price;

    const quickSalePrice = calculatePercentileAverage(prices, 0, 0.2);
    const quickSaleM2Price = calculatePercentileAverage(pricesPerSqm, 0, 0.2);

    const fairMarketPrice = calculatePercentileAverage(prices, 0.1, 0.9);
    const fairMarketM2Price = calculatePercentileAverage(
      pricesPerSqm,
      0.1,
      0.9,
    );

    const premiumPrice = calculatePercentileAverage(prices, 0.8, 1.0);
    const premiumM2Price = calculatePercentileAverage(pricesPerSqm, 0.8, 1.0);

    const avgAge =
      listingAges.length > 0
        ? Math.round(
            listingAges.reduce((a, b) => a + b, 0) / listingAges.length,
          )
        : 0;
    const newestAge = listingAges.length > 0 ? Math.min(...listingAges) : 0;

    createNavigationUi();
    highlightFpItem(0);

    const bestFpItem = sortedFpItems[0];

    // SweetAlert2 Gösterimi
    if (window.Swal) {
      Swal.fire({
        title: "📊 Detaylı Gayrimenkul Analizi",
        width: "560px",
        html: `
                    <div id="swal-analysis-container" style="text-align: left; font-size: 13px; line-height: 1.7; color: #2c3e50; padding: 5px;">
                        <div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #3b82f6; display: flex; justify-content: space-between;">
                            <span><b>İncelenen İlan:</b> ${prices.length} Adet</span>
                            <span><b>Ort. İlan Yaşı:</b> ${avgAge} Gün (${newestAge === 0 ? "Bugün eklendi" : newestAge + " gün önce"})</span>
                        </div>

                        <!-- FİYAT SEGMENTLERİ -->
                        <div style="background: #fafafa; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
                            <p style="margin: 3px 0;">⚡ <b>Hızlı Satış (Kelepir) Ort.:</b> 
                                <span style="color: #16a34a; font-weight: bold; float: right;">${quickSalePrice.toLocaleString("tr-TR")} TL</span>
                            </p>
                            <p style="margin: 3px 0;">🎯 <b>Makul Piyasa Ortalaması:</b> 
                                <span style="color: #2563eb; font-weight: bold; float: right;">${fairMarketPrice.toLocaleString("tr-TR")} TL</span>
                            </p>
                            <p style="margin: 3px 0;">💎 <b>Tok Satıcı (Üst Limit) Ort.:</b> 
                                <span style="color: #9333ea; font-weight: bold; float: right;">${premiumPrice.toLocaleString("tr-TR")} TL</span>
                            </p>
                        </div>

                        <!-- METREKARE ANALİZİ -->
                        <div style="background: #fff; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
                            <p style="margin: 3px 0;">⚡ <b>Hızlı Satış m² Fiyatı:</b> 
                                <span style="color: #15803d; font-weight: bold; float: right;">${quickSaleM2Price.toLocaleString("tr-TR")} TL/m²</span>
                            </p>
                            <p style="margin: 3px 0;">📏 <b>Makul Piyasa m² Ortalaması:</b> 
                                <span style="color: #1d4ed8; font-weight: bold; float: right;">${fairMarketM2Price.toLocaleString("tr-TR")} TL/m²</span>
                            </p>
                            <p style="margin: 3px 0;">💎 <b>Tok Satıcı m² Ortalaması:</b> 
                                <span style="color: #7e22ce; font-weight: bold; float: right;">${premiumM2Price.toLocaleString("tr-TR")} TL/m²</span>
                            </p>
                        </div>

                        <!-- SİMÜLATÖR: ÇOKLU MODLU & MARJ HESAPLAMALI SİMÜLATÖR -->
                        <div style="background: #f8fafc; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 10px;">
                            <label style="font-weight: bold; color: #0f172a; display: block; margin-bottom: 6px;">🧮 Özel m² Değer & Marj Simülatörü:</label>
                            
                            <!-- MOD SWITCHER -->
                            <div style="display: flex; gap: 4px; margin-bottom: 8px; background: #e2e8f0; padding: 3px; border-radius: 6px;">
                                <button type="button" class="sim-mode-btn" data-m2="${quickSaleM2Price}" data-mode="quick" style="
                                    flex: 1; padding: 4px 2px; font-size: 11px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;
                                    background: #16a34a; color: #fff; transition: all 0.2s;
                                ">⚡ Hızlı Satış</button>
                                <button type="button" class="sim-mode-btn" data-m2="${fairMarketM2Price}" data-mode="fair" style="
                                    flex: 1; padding: 4px 2px; font-size: 11px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;
                                    background: transparent; color: #475569; transition: all 0.2s;
                                ">🎯 Makul Piyasa</button>
                                <button type="button" class="sim-mode-btn" data-m2="${premiumM2Price}" data-mode="premium" style="
                                    flex: 1; padding: 4px 2px; font-size: 11px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;
                                    background: transparent; color: #475569; transition: all 0.2s;
                                ">💎 Tok Satıcı</button>
                            </div>

                            <!-- INPUT VE MARJ AYARLARI -->
                            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
                                <input type="number" id="swal-input-m2" placeholder="m² girin" style="
                                    flex: 1.2; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; outline: none;
                                ">

                                <!-- MARJ YÖNÜ SWITCHER (ARTIŞ/DÜŞÜŞ) -->
                                <div style="display: flex; background: #e2e8f0; padding: 2px; border-radius: 6px; gap: 2px;">
                                    <button type="button" id="btn-margin-plus" class="margin-dir-btn" data-dir="plus" style="
                                        border: none; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;
                                        background: #22c55e; color: #fff;
                                    ">➕ Artış</button>
                                    <button type="button" id="btn-margin-minus" class="margin-dir-btn" data-dir="minus" style="
                                        border: none; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;
                                        background: transparent; color: #475569;
                                    ">➖ Düşüş</button>
                                </div>

                                <!-- MARJ YÜZDESİ INPUT -->
                                <div style="display: flex; align-items: center; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0 6px; width: 65px;">
                                    <span style="font-size: 11px; color: #64748b; font-weight: bold;">%</span>
                                    <input type="number" id="swal-input-margin" placeholder="0" min="0" style="
                                        width: 100%; border: none; outline: none; padding: 6px 2px; font-size: 12px; font-weight: bold; text-align: center;
                                    ">
                                </div>
                            </div>

                            <!-- CANLI SONUÇ EKRANI -->
                            <div style="font-size: 12px; color: #0f172a; background: #ffffff; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 6px; text-align: center;">
                                <span id="sim-result-label">Tahmini Hızlı Satış Değeri:</span> 
                                <b id="swal-quick-calc-result" style="font-size: 14px; color: #16a34a;">0 TL</b>
                            </div>
                        </div>

                        <!-- F/P İLAN BİLGİSİ -->
                        ${
                          bestFpItem
                            ? `
                        <div style="background: #f0fdf4; padding: 8px 12px; border-radius: 6px; border: 1px solid #bbf7d0; margin-bottom: 10px;">
                            <b style="color: #166534;">⭐ #1 En İyi F/P Seçeneği:</b><br>
                            Fiyat: <b>${bestFpItem.price.toLocaleString("tr-TR")} TL</b> | Birim: <b>${bestFpItem.m2Price.toLocaleString("tr-TR")} TL/m²</b>
                            <div style="font-size: 11px; color: #15803d; margin-top: 2px;">
                                💡 <i>Sağ alttaki <b>"Sonraki ▶"</b> butonunu kullanarak sıradaki alternatif ilanlara hızlıca kayabilirsiniz.</i>
                            </div>
                        </div>`
                            : ""
                        }

                        <!-- PİYASA MARJI VE EKRAN GÖRÜNTÜSÜ BUTONU -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <div style="font-size: 11px; color: #b45309; background: #fffeb3; padding: 6px 10px; border-radius: 6px;">
                                <b>Köpük Marjı:</b> ${m2Spread.toLocaleString("tr-TR")} TL/m²
                            </div>
                            <button id="btn-swal-screenshot" style="
                                background: #475569; color: #fff; border: none; padding: 6px 12px; border-radius: 6px;
                                font-size: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px;
                            ">📸 Ekran Görüntüsü İndir</button>
                        </div>
                    </div>
                `,
        icon: "success",
        confirmButtonText: "İlanları İncele",
        confirmButtonColor: "#2563eb",
        didOpen: () => {
          const m2Input = document.getElementById("swal-input-m2");
          const marginInput = document.getElementById("swal-input-margin");
          const calcResult = document.getElementById("swal-quick-calc-result");
          const resultLabel = document.getElementById("sim-result-label");
          const modeBtns = document.querySelectorAll(".sim-mode-btn");
          const marginPlusBtn = document.getElementById("btn-margin-plus");
          const marginMinusBtn = document.getElementById("btn-margin-minus");

          let activeM2Price = quickSaleM2Price;
          let currentMode = "quick";
          let marginDirection = "plus"; // "plus" veya "minus"

          // Hesaplama Mantığı
          const updateCalculation = () => {
            const sqmVal = parseFloat(m2Input.value) || 0;
            const marginVal = parseFloat(marginInput.value) || 0;

            if (sqmVal > 0) {
              // Marj Yüzdesini Uygula
              let adjustedM2Price = activeM2Price;
              if (marginVal > 0) {
                const multiplier =
                  marginDirection === "plus"
                    ? 1 + marginVal / 100
                    : 1 - marginVal / 100;
                adjustedM2Price = activeM2Price * multiplier;
              }

              const calculatedPrice = Math.round(sqmVal * adjustedM2Price);
              calcResult.innerText = `${calculatedPrice.toLocaleString("tr-TR")} TL`;
            } else {
              calcResult.innerText = "0 TL";
            }
          };

          // Mod Buton Dinleyicileri
          modeBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
              modeBtns.forEach((b) => {
                b.style.background = "transparent";
                b.style.color = "#475569";
              });

              activeM2Price = parseFloat(btn.dataset.m2);
              currentMode = btn.dataset.mode;

              if (currentMode === "quick") {
                btn.style.background = "#16a34a";
                btn.style.color = "#fff";
                calcResult.style.color = "#16a34a";
                resultLabel.innerText = "Tahmini Hızlı Satış Değeri:";
              } else if (currentMode === "fair") {
                btn.style.background = "#2563eb";
                btn.style.color = "#fff";
                calcResult.style.color = "#2563eb";
                resultLabel.innerText = "Tahmini Makul Piyasa Değeri:";
              } else if (currentMode === "premium") {
                btn.style.background = "#9333ea";
                btn.style.color = "#fff";
                calcResult.style.color = "#9333ea";
                resultLabel.innerText = "Tahmini Tok Satıcı Değeri:";
              }

              updateCalculation();
            });
          });

          // Marj Yönü Switcher Dinleyicileri
          marginPlusBtn.addEventListener("click", () => {
            marginDirection = "plus";
            marginPlusBtn.style.background = "#22c55e";
            marginPlusBtn.style.color = "#fff";
            marginMinusBtn.style.background = "transparent";
            marginMinusBtn.style.color = "#475569";
            updateCalculation();
          });

          marginMinusBtn.addEventListener("click", () => {
            marginDirection = "minus";
            marginMinusBtn.style.background = "#ef4444";
            marginMinusBtn.style.color = "#fff";
            marginPlusBtn.style.background = "transparent";
            marginPlusBtn.style.color = "#475569";
            updateCalculation();
          });

          // Input Dinleyicileri
          m2Input.addEventListener("input", updateCalculation);
          marginInput.addEventListener("input", updateCalculation);

          // Ekran Görüntüsü Alma
          const screenshotBtn = document.getElementById("btn-swal-screenshot");
          screenshotBtn.addEventListener("click", () => {
            if (window.html2canvas) {
              screenshotBtn.style.display = "none";

              const targetElement = document.querySelector(".swal2-popup");
              window
                .html2canvas(targetElement, { scale: 2 })
                .then((canvas) => {
                  const link = document.createElement("a");
                  link.download = `sahibinden-analiz-${new Date().toISOString().slice(0, 10)}.png`;
                  link.href = canvas.toDataURL("image/png");
                  link.click();
                  screenshotBtn.style.display = "flex";
                })
                .catch((err) => {
                  console.error("Ekran görüntüsü alınamadı:", err);
                  screenshotBtn.style.display = "flex";
                });
            } else {
              alert(
                "Ekran görüntüsü kütüphanesi yükleniyor, lütfen birkaç saniye sonra tekrar deneyin.",
              );
            }
          });
        },
      });
    }
  }

  // 6. Ekranın Sağ Üstüne Arayüz (UI) Butonunu Ekle
  const existingUi = document.getElementById("median-analyzer-ui");
  if (existingUi) existingUi.remove();

  const uiContainer = document.createElement("div");
  uiContainer.id = "median-analyzer-ui";
  uiContainer.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 999999;
        background: #ffffff; padding: 12px 18px; border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 2px solid #ffe800;
        font-family: Arial, sans-serif; display: flex; flex-direction: column; gap: 6px; align-items: center;
    `;

  uiContainer.innerHTML = `
        <div style="font-weight: bold; font-size: 12px; color: #333;">Sahibinden Gayrimenkul Analiz</div>
        <button id="btn-run-median-analysis" style="
            background: #ffe800; color: #000; border: none; padding: 8px 14px;
            font-weight: bold; font-size: 12px; border-radius: 6px; cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: transform 0.1s ease;
        ">📊 Tam Piyasa Analizi Yap</button>
    `;

  document.body.appendChild(uiContainer);
  document
    .getElementById("btn-run-median-analysis")
    .addEventListener("click", analyzeTable);
})();
