const popupEl = () => document.getElementById("lote-popup");

function esc(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function toNumStr(v) {
  return v === null || v === undefined ? "" : String(v);
}

export function hidePopup() {
  const el = popupEl();
  if (!el) return;
  el.classList.add("hidden");
  el.innerHTML = "";
}

export function showLotePopup(feature, { onChangeEstado, onSaveData, canEdit = true } = {}) {
  const el = popupEl();
  if (!el) return;

  const p = feature.properties || {};
  const id = p.id || "L13";

  const proyecto = p.proyecto || "Proyecto Machayhuaycco";
  const etapa = p.etapa || "Etapa 1";
  const ubicacion = p.ubicacion || "Ccorihuillca-Humanga, Perú";

  const estadoRaw = (p.estado || "disponible").toLowerCase();
  const estado = ["disponible", "reservado", "vendido"].includes(estadoRaw)
    ? estadoRaw
    : "disponible";

  const imgSrc = "./assets/imagenes/lotes/proyectomachahuayco.jpeg";

  const tipologia = p.tipologia ?? "Interior";
  const area = p.area_m2 ?? p.area ?? "200.9";
  const perTotal = p.perimetro_total ?? p.perimetro ?? "61.02";

  const frente = p.frente ?? "10.18";
  const fondo = p.fondo ?? "10.21";
  const derecha = p.derecha ?? "20.37";
  const izquierda = p.izquierda ?? "20.26";

  const precio = p.precio ?? "100,000";

  el.innerHTML = `
    <div class="lv2-hero">
      <img src="${esc(imgSrc)}" alt="Lote ${esc(id)}"
           onerror="this.src='./assets/images/lotes/placeholder.jpg';" />
      <button class="lv2-close" id="lv2Close" aria-label="Cerrar">✕</button>
      <div class="lv2-heroText">
        <div class="lv2-title">${esc(proyecto)}</div>
        <div class="lv2-sub">${esc(etapa)} · ${esc(id)} · ${esc(ubicacion)}</div>
      </div>
    </div>

    <div class="lv2-body">

      <div class="lv2-tabs">
        <button class="lv2-tab active" data-tab="info">Información</button>
        <button class="lv2-tab" data-tab="peri">Perímetro</button>
      </div>

      <!-- PANEL INFORMACIÓN -->
      <div class="lv2-tab-panel active" id="panel-info">
        <div class="lv2-card">
          <div class="lv2-cardHead"><span class="lv2-check">✓</span> Información</div>

          <!-- ✅ para agregar tipologia -->
          <!--
          <div class="lv2-typo">
            <div class="lv2-fieldLabel">Tipología</div>
            <div class="lv2-fieldValue lv2-edit"
                 data-key="tipologia"
                 data-type="text"
                 title="${canEdit ? "Click para editar" : ""}">${esc(tipologia)}</div>
          </div>
          -->

          <div class="lv2-line"></div>

          <div class="lv2-grid2">
            <div>
              <div class="lv2-fieldLabel">Área</div>
              <div class="lv2-fieldValue lv2-edit"
                   data-key="area_m2"
                   data-type="number"
                   title="${canEdit ? "Click para editar" : ""}">${esc(toNumStr(area))} m²</div>
            </div>
            <div>
              <div class="lv2-fieldLabel">Perímetro total</div>
              <div class="lv2-fieldValue lv2-edit"
                   data-key="perimetro_total"
                   data-type="number"
                   title="${canEdit ? "Click para editar" : ""}">${esc(toNumStr(perTotal))} m</div>
            </div>
          </div>

          <div class="lv2-line"></div>

          <div class="lv2-bottom">
            <div>
              <div class="lv2-priceLabel">Precio referencial</div>
              <div class="lv2-price lv2-edit"
                   data-key="precio"
                   data-type="text"
                   title="${canEdit ? "Click para editar" : ""}">S/ ${esc(toNumStr(precio))}</div>
            </div>

            <div class="lv2-badge ${estado}">
              ${estado.charAt(0).toUpperCase() + estado.slice(1)}
            </div>
          </div>

          ${canEdit ? `
            <div class="lv2-actions">
              <button class="lv2-pill disponible ${estado === "disponible" ? "active" : ""}" data-estado="disponible">✓ Disponible</button>
              <button class="lv2-pill reservado ${estado === "reservado" ? "active" : ""}" data-estado="reservado">⏳ Reservado</button>
              <button class="lv2-pill vendido ${estado === "vendido" ? "active" : ""}" data-estado="vendido">✕ Vendido</button>
            </div>
          ` : ``}
        </div>
      </div>

      <!-- PANEL PERÍMETRO -->
      <div class="lv2-tab-panel" id="panel-peri">
        <div class="lv2-card">
          <div class="lv2-cardHead"><span class="lv2-check">✓</span> Perímetro</div>

          <div class="lv2-grid2">
            <div>
              <div class="lv2-fieldLabel">Frente</div>
              <div class="lv2-fieldValue lv2-edit"
                   data-key="frente"
                   data-type="number"
                   title="${canEdit ? "Click para editar" : ""}">${esc(toNumStr(frente))} m</div>
            </div>
            <div>
              <div class="lv2-fieldLabel">Derecha</div>
              <div class="lv2-fieldValue lv2-edit"
                   data-key="derecha"
                   data-type="number"
                   title="${canEdit ? "Click para editar" : ""}">${esc(toNumStr(derecha))} m</div>
            </div>
            <div>
              <div class="lv2-fieldLabel">Fondo</div>
              <div class="lv2-fieldValue lv2-edit"
                   data-key="fondo"
                   data-type="number"
                   title="${canEdit ? "Click para editar" : ""}">${esc(toNumStr(fondo))} m</div>
            </div>
            <div>
              <div class="lv2-fieldLabel">Izquierda</div>
              <div class="lv2-fieldValue lv2-edit"
                   data-key="izquierda"
                   data-type="number"
                   title="${canEdit ? "Click para editar" : ""}">${esc(toNumStr(izquierda))} m</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  el.classList.remove("hidden");

  el.querySelector("#lv2Close")?.addEventListener("click", hidePopup);

  // estados
  if (canEdit) {
    el.querySelectorAll("[data-estado]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-estado");
        if (!next) return;
        onChangeEstado?.(next);
      });
    });
  }

  // tabs
  const tabs = el.querySelectorAll(".lv2-tab");
  const panels = {
    info: el.querySelector("#panel-info"),
    peri: el.querySelector("#panel-peri"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      Object.values(panels).forEach((pnl) => pnl.classList.remove("active"));

      tab.classList.add("active");
      const key = tab.getAttribute("data-tab");
      panels[key]?.classList.add("active");
    });
  });

  // edición inline
  const makeInput = (target) => {
    if (!target) return;
    if (!canEdit) return;
    if (target.querySelector("input")) return;

    const key = target.getAttribute("data-key");
    const type = target.getAttribute("data-type") || "text";

    const rawText = target.textContent || "";
    const cleaned = rawText
      .replace(" m²", "")
      .replace(" m", "")
      .replace("S/", "")
      .trim();

    const input = document.createElement("input");
    input.className = "lv2-inline-input";
    input.value = cleaned;
    input.inputMode = type === "number" ? "decimal" : "text";

    target.innerHTML = "";
    target.appendChild(input);
    input.focus();
    input.select();

    const commit = () => {
      const newVal = input.value.trim();

      let display = newVal;
      if (key === "area_m2") display = `${newVal} m²`;
      if (["perimetro_total", "frente", "derecha", "fondo", "izquierda"].includes(key)) {
        display = `${newVal} m`;
      }
      if (key === "precio") display = `S/ ${newVal}`;

      target.textContent = display;
      onSaveData?.({ [key]: newVal });
    };

    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") commit();
      if (ev.key === "Escape") {
        showLotePopup(feature, { onChangeEstado, onSaveData, canEdit });
      }
    });

    input.addEventListener("blur", () => commit());
  };

  if (canEdit) {
    el.querySelectorAll(".lv2-edit").forEach((node) => {
      node.addEventListener("click", () => makeInput(node));
    });
  } else {
    el.querySelectorAll(".lv2-edit").forEach((node) => {
      node.classList.add("lv2-edit-disabled");
    });
  }
}
