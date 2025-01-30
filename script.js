document.addEventListener("DOMContentLoaded", () => {
  // Función de formateo numérico
  function formatearNumero(num) {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  // NUEVO: Ajustamos esta función para que, si parseFloat da NaN,
  // no borre de inmediato el valor y, si prefieres, puedas notificar al usuario.
  function formatearInputNumero(input) {
    const valorOriginal = input.value;
    const valor = valorOriginal
      .replace(/\./g, '')      // Elimina puntos
      .replace(',', '.');      // Reemplaza comas por puntos (para parseFloat)

    const numero = parseFloat(valor);
} 

  // Elementos del DOM
  const nombreCliente = document.getElementById("nombreCliente");
  const periodoMeses = document.getElementById("periodoMeses");
  const periodoMesesOtro = document.getElementById("periodoMesesOtro");
  const checkLimite = document.getElementById("checkLimite");
  const limiteMonto = document.getElementById("limiteMonto");
  const btnAddAcreedor = document.getElementById("btnAddAcreedor");
  const listaAcreedores = document.getElementById("listaAcreedores");
  const btnAddBien = document.getElementById("btnAddBien");
  const listaBienes = document.getElementById("listaBienes");
  const valorTotalBienesEl = document.getElementById("valorTotalBienes");
  const btnCrearPlan = document.getElementById("crearPlan");
  const btnLimpiarCampos = document.getElementById("limpiarCampos");
  const tablaResultados = document.getElementById("tablaResultados");
  const historialPlanes = document.getElementById("historialPlanes");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalTableContainer = document.getElementById("modalTableContainer");
  const checkHipoteca = document.getElementById("checkHipoteca");
  const hipotecaMonto = document.getElementById("hipotecaMonto");

  // NUEVO: Campo para la quita
  const quitaPorcentaje = document.getElementById("quitaPorcentaje");

  // Variables de estado
  let acreedores = [];
  let bienes = [];
  let historial = [];

  // Manejo de Enter
  function manejarEnterEnInputs(selector, botonId = null) {
    const inputs = Array.from(document.querySelectorAll(selector));
    inputs.forEach(input => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const currentIndex = inputs.indexOf(event.target);
          if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
          } else if (botonId && currentIndex === inputs.length - 1) {
            document.getElementById(botonId).click();
          }
        }
      });
    });
  }

  // NUEVO: Ajustamos el listener para que NO sobreescriba siempre el valor
  checkHipoteca.addEventListener("change", () => {
    hipotecaMonto.disabled = !checkHipoteca.checked;
    // NUEVO: Solo si se activa y no tiene valor, fijamos "0,00"
    if (checkHipoteca.checked && !hipotecaMonto.value) {
      hipotecaMonto.value = "";
      formatearInputNumero(hipotecaMonto);
    }
  });

  periodoMeses.addEventListener("change", () => {
    periodoMesesOtro.style.display = periodoMeses.value === "otro" ? "block" : "none";
  });

  // NUEVO: Igual para el checkLimite
  checkLimite.addEventListener("change", () => {
    limiteMonto.disabled = !checkLimite.checked;
    // NUEVO: Solo si se activa y no tiene valor, fijamos "0,00"
    if (checkLimite.checked && !limiteMonto.value) {
      limiteMonto.value = "";
      formatearInputNumero(limiteMonto);
    }
  });

  // Formateo de inputs numéricos (blur)
  // Asegúrate de tener estos elementos en tu HTML. 
  // Ejemplo: class="acreedor-deuda", class="bien-valor", etc.
  document.querySelector('.acreedor-deuda').addEventListener('blur', function() {
    formatearInputNumero(this);
  });

  document.querySelector('.bien-valor').addEventListener('blur', function() {
    formatearInputNumero(this);
  });

  hipotecaMonto.addEventListener('blur', function() {
    formatearInputNumero(this);
  });

  limiteMonto.addEventListener('blur', function() {
    formatearInputNumero(this);
  });

  // Acreedores
  btnAddAcreedor.addEventListener("click", () => {
    const nombreInput = document.querySelector(".acreedor-nombre");
    const deudaInput = document.querySelector(".acreedor-deuda");
    
    const nombre = nombreInput.value.trim();
    // Reemplazamos puntos y comas para parsear
    const deuda = parseFloat(deudaInput.value.replace(',', '.'));

    if (nombre && !isNaN(deuda) && deuda > 0) {
      acreedores.push({ nombre, deuda });
      actualizarListaAcreedores();
      nombreInput.value = "";
      deudaInput.value = "";
    } else {
      alert("Por favor ingrese nombre y deuda válidos");
    }
  });

  function actualizarListaAcreedores() {
    listaAcreedores.innerHTML = "";
    acreedores.forEach((acreedor, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${acreedor.nombre} - ${formatearNumero(acreedor.deuda)}€
        <button class="eliminar" data-index="${index}">×</button>
      `;
      li.querySelector("button").addEventListener("click", () => {
        acreedores.splice(index, 1);
        actualizarListaAcreedores();
      });
      listaAcreedores.appendChild(li);
    });
  }

  // Bienes
  btnAddBien.addEventListener("click", () => {
    const nombreInput = document.querySelector(".bien-nombre");
    const valorInput = document.querySelector(".bien-valor");
    
    const nombre = nombreInput.value.trim();
    const valor = parseFloat(valorInput.value.replace(/\./g, '').replace(',', '.'));

    if (nombre && !isNaN(valor) && valor > 0) {
      bienes.push({ nombre, valor });
      actualizarListaBienes();
      nombreInput.value = "";
      valorInput.value = "";
    } else {
      alert("Por favor ingrese nombre y valor válidos");
    }
  });

  function actualizarListaBienes() {
    listaBienes.innerHTML = "";
    let total = 0;
    bienes.forEach((bien, index) => {
      total += bien.valor;
      const li = document.createElement("li");
      li.innerHTML = `
        ${bien.nombre} - ${formatearNumero(bien.valor)}€
        <button class="eliminar" data-index="${index}">×</button>
      `;
      li.querySelector("button").addEventListener("click", () => {
        bienes.splice(index, 1);
        actualizarListaBienes();
      });
      listaBienes.appendChild(li);
    });
    valorTotalBienesEl.textContent = formatearNumero(total);
  }

  // Cálculo del Plan de Pagos
  btnCrearPlan.addEventListener("click", () => {
    // Validaciones básicas
    const cliente = nombreCliente.value.trim();
    if (!cliente || !acreedores.length || !bienes.length) {
      alert("Complete todos los campos obligatorios");
      return;
    }

    // Cálculo de meses
    const meses = periodoMeses.value === "otro" ? 
      parseInt(periodoMesesOtro.value) || 60 : 
      parseInt(periodoMeses.value);

    // Cálculos iniciales
    const deudaSinQuita = acreedores.reduce((sum, a) => sum + a.deuda, 0);
    const quita = parseFloat(quitaPorcentaje.value) || 0;

    // Aplicamos la quita al total de la deuda
    const deudaTotal = deudaSinQuita * (1 - quita / 100);

    const valorBienesTotal = bienes.reduce((sum, b) => sum + b.valor, 0);

    // Ajuste: Tomamos el menor entre el valor de los bienes y la deuda con quita
    const valorBienesAjustado = Math.min(valorBienesTotal, deudaTotal);

    // Se recalcula el porcentajeTotal con la deuda ya rebajada
    const porcentajeTotal = (valorBienesAjustado / deudaTotal) * 100;

    // Ajustamos la deuda de cada acreedor según la quita,
    // luego calculamos la parte que le corresponde usando el mismo porcentaje
    let acreedoresCalculados = acreedores.map(a => {
      const deudaConQuitaCred = a.deuda * (1 - quita / 100);
      const importe = deudaConQuitaCred * (porcentajeTotal / 100);
      
      return {
        nombre: a.nombre,
        // Mostramos en "Deuda" la parte con quita (para que se refleje esa reducción)
        deuda: deudaConQuitaCred,
        // Porcentaje de la deuda con quita frente al total con quita
        porcentaje: (deudaConQuitaCred / deudaTotal) * porcentajeTotal,
        importe: importe,
        cuotaMensual: importe / meses,
        meses: meses
      };
    });

    let sumaCuotas = acreedoresCalculados.reduce((sum, a) => sum + a.cuotaMensual, 0);
    let sumaImportes = acreedoresCalculados.reduce((sum, a) => sum + a.importe, 0);

    // Manejo de Hipoteca y Límite
    let montoHipoteca = 0;
    if (checkHipoteca.checked) {
      montoHipoteca = parseFloat(
        hipotecaMonto.value.replace(/\./g, '').replace(',', '.')
      ) || 0;
    }

    if (checkLimite.checked) {
      const limite = parseFloat(limiteMonto.value) || 0;
      
      // Validaciones de límite
      if (montoHipoteca > limite) {
        alert("El pago de hipoteca supera el límite mensual");
        return;
      }
      
      const limiteDisponible = limite - montoHipoteca;
      
      if (limiteDisponible <= 0) {
        alert("El límite debe ser mayor al pago de hipoteca");
        return;
      }

      // Ajustar cuotas si superan el límite
      if (sumaCuotas > limiteDisponible) {
        const ratio = limiteDisponible / sumaCuotas;
        acreedoresCalculados = acreedoresCalculados.map(a => ({
          ...a,
          importe: a.importe * ratio,
          cuotaMensual: a.cuotaMensual * ratio
        }));

        // Actualizar totales
        sumaCuotas = acreedoresCalculados.reduce((sum, a) => sum + a.cuotaMensual, 0);
        sumaImportes = acreedoresCalculados.reduce((sum, a) => sum + a.importe, 0);
      }
    }

    // Formatear números para presentar en la tabla
    acreedoresCalculados = acreedoresCalculados.map(a => ({
      ...a,
      deuda: formatearNumero(a.deuda),
      porcentaje: formatearNumero(a.porcentaje),
      importe: formatearNumero(a.importe),
      cuotaMensual: formatearNumero(a.cuotaMensual)
    }));

    // Construimos el array de resultados para mostrar
    const resultados = [];

    // Si hubo quita > 0, añadimos un par de filas informativas
    if (quita > 0) {
      resultados.push({
        nombre: "Deuda Original",
        deuda: formatearNumero(deudaSinQuita),
        porcentaje: "-",
        importe: "-",
        meses: "-",
        cuotaMensual: "-"
      });
      resultados.push({
        nombre: "Quita",
        deuda: quita + " %",
        porcentaje: "-",
        importe: "-" + formatearNumero(deudaSinQuita - deudaTotal),
        meses: "-",
        cuotaMensual: "-"
      });
    }

    // Añadimos cada acreedor
    resultados.push(...acreedoresCalculados);

    // Añadir Hipoteca (si procede)
    let totalMensual = sumaCuotas;
    if (checkHipoteca.checked) {
      resultados.push({
        nombre: "Pago de Hipoteca",
        deuda: "-",
        porcentaje: "-",
        importe: "-",
        meses: "-",
        cuotaMensual: formatearNumero(montoHipoteca)
      });
      totalMensual += montoHipoteca;
    }

    // Finalmente añadimos el total general
    resultados.push({
      nombre: "Total",
      deuda: formatearNumero(deudaTotal),
      porcentaje: formatearNumero(porcentajeTotal),
      importe: formatearNumero(sumaImportes),
      meses: meses,
      cuotaMensual: formatearNumero(totalMensual)
    });

    mostrarTabla(resultados);
    guardarEnHistorial(cliente, resultados);
  });

  // Mostrar tabla de resultados
  function mostrarTabla(data) {
    let html = `
      <table>
        <thead>
          <tr>
            <th>Identidad Acreedora</th>
            <th>Deuda</th>
            <th>Porcentaje</th>
            <th>Importe a Abonar</th>
            <th>Meses</th>
            <th>Cuota Mensual</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    data.forEach(row => {
      // Usamos nullish coalescing (??) para que, si es null/undefined, sea ""
      let deuda = row.deuda ?? "";
      let porcentaje = row.porcentaje ?? "";
      let importe = row.importe ?? "";
      let cuota = row.cuotaMensual ?? "";
  
      // Solo si el campo no está vacío, le añadimos el símbolo
      if (deuda.trim() !== "-") {
        deuda += " €";
      }
      if (porcentaje.trim() !== "-") {
        porcentaje += " %";
      }
      if (importe.trim() !== "-") {
        importe += " €";
      }
      if (cuota.trim() !== "-") {
        cuota += " €";
      }
  
      html += `
        <tr>
          <td>${row.nombre}</td>
          <td>${deuda}</td>
          <td>${porcentaje}</td>
          <td>${importe}</td>
          <td>${row.meses}</td>
          <td>${cuota}</td>
        </tr>
      `;
    });
  
    html += `</tbody></table>`;
    document.getElementById("tablaResultados").innerHTML = html;
  }
  

  // Historial 
  function guardarEnHistorial(cliente, data) {
    const fecha = new Date().toLocaleString();
    const plan = {
      cliente,
      fecha,
      data
    };
    historial.push(plan);
    actualizarHistorial();
  }

  function actualizarHistorial() {
    historialPlanes.innerHTML = "";
    historial.forEach((plan, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${plan.cliente} | ${plan.fecha}</span>
        <div class="actions">
          <button class="btnVerPlan">Ver</button>
          <button class="btnEliminarPlan">Eliminar</button>
          <button class="btnDescargarPlan">Descargar</button>
        </div>
      `;

      li.querySelector(".btnEliminarPlan").addEventListener("click", () => {
        historial.splice(index, 1);
        actualizarHistorial();
      });

      li.querySelector(".btnDescargarPlan").addEventListener("click", () => {
        descargarPlanPDF(plan);
      });

      li.querySelector(".btnVerPlan").addEventListener("click", () => {
        mostrarModalConPlan(plan);
      });

      historialPlanes.appendChild(li);
    });
  }

  // Mostrar modal con plan
  function mostrarModalConPlan(plan) {
    modalTableContainer.innerHTML = generarHTMLTabla(plan.data);
    modalOverlay.style.display = "flex";
  }

  // Generar HTML para tablas
  function generarHTMLTabla(data) {
    return `
      <table>
        <thead>
          <tr>
            <th>Identidad Acreedora</th>
            <th>Deuda</th>
            <th>Porcentaje</th>
            <th>Importe</th>
            <th>Meses</th>
            <th>Cuota Mensual</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td>${row.nombre}</td>
              <td>${row.deuda} €</td>
              <td>${row.porcentaje} %</td>
              <td>${row.importe} €</td>
              <td>${row.meses}</td>
              <td>${row.cuotaMensual} €</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  // Generar PDF
  function generarHTMLTabla(data) {
    // -- Aquí insertas la misma lógica condicional que usaste en "mostrarTabla" --
    return `
      <table>
        <thead>
          <tr>
            <th>Identidad Acreedora</th>
            <th>Deuda</th>
            <th>Porcentaje</th>
            <th>Importe</th>
            <th>Meses</th>
            <th>Cuota Mensual</th>
          </tr>
        </thead>
        <tbody>
          ${
            data.map(row => {
              // Usamos nullish coalescing (??) para evitar null/undefined
              let deuda = row.deuda ?? "";
              let porcentaje = row.porcentaje ?? "";
              let importe = row.importe ?? "";
              let cuota = row.cuotaMensual ?? "";
  
              // Si el campo NO está vacío ("") ni es "-", le agregamos su símbolo
              if (deuda.trim() !== "" && deuda.trim() !== "-") {
                deuda += " €";
              }
              if (porcentaje.trim() !== "" && porcentaje.trim() !== "-") {
                porcentaje += " %";
              }
              if (importe.trim() !== "" && importe.trim() !== "-") {
                importe += " €";
              }
              if (cuota.trim() !== "" && cuota.trim() !== "-") {
                cuota += " €";
              }
  
              // Retornamos la fila con los valores formateados
              return `
                <tr>
                  <td>${row.nombre}</td>
                  <td>${deuda}</td>
                  <td>${porcentaje}</td>
                  <td>${importe}</td>
                  <td>${row.meses}</td>
                  <td>${cuota}</td>
                </tr>
              `;
            }).join("")
          }
        </tbody>
      </table>
    `;
  }
  
  // Generar PDF
  function descargarPlanPDF(plan) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter'
    });
  
    // Al llamar generarHTMLTabla(plan.data) aquí,
    // ya usará la lógica condicional para ocultar los símbolos si está vacío
    let tablaHTML = generarHTMLTabla(plan.data);
  
    const divTemporal = document.createElement("div");
    divTemporal.innerHTML = `
      <style>
        * {
          color: #000 !important;
          font-family: Arial, sans-serif;
        }
        .pdf-header {
          padding-left: 10px;
          text-align: center;
          margin-bottom: 10px;
        }
        .pdf-header h2 {
          margin: 0; 
          font-size: 18pt;
          white-space: nowrap;
        }
        .pdf-header p {
          margin: 0px 0;
          font-size: 10pt;
        }
        .table-container {
          margin-top: 10px;
          padding-left: 10px;
          padding-right: 7px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 0;
          margin-left: 3px;
          border: 1px solid #000;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
          font-size: 10pt;
          white-space: nowrap; 
        }
        th {
          background-color: #ffffff;
        }
      </style>
      <div class="pdf-header">
        <h2>Plan de Pago - ${plan.cliente}</h2>
        <p>Fecha: ${plan.fecha}</p>
      </div>
      <div class="table-container">
        ${tablaHTML}
      </div>
    `;
  
    doc.html(divTemporal, {
      callback: function (doc) {
        doc.save(`Plan_${plan.cliente.replace(/\s+/g, '_')}.pdf`);
      },
      x: 40,
      y: 20,
      width: 520,
      windowWidth: 800
    });
  }

  // Limpiar formulario
  function limpiarCampos() {
    nombreCliente.value = "";
    periodoMeses.value = "60";
    periodoMesesOtro.value = "";
    checkLimite.checked = false;
    limiteMonto.value = "";
    checkHipoteca.checked = false;
    hipotecaMonto.value = "";
    quitaPorcentaje.value = 0;
    document.getElementById("quitaValue").textContent = "0";

    acreedores = [];
    bienes = [];
    actualizarListaAcreedores();
    actualizarListaBienes();
    tablaResultados.innerHTML = "";
  }

  // Event Listeners finales
  btnLimpiarCampos.addEventListener("click", limpiarCampos);
  modalClose.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    modalTableContainer.innerHTML = "";
  });

  manejarEnterEnInputs(".form-group.acreedor-group input", "btnAddAcreedor");
  manejarEnterEnInputs(".form-group.bien-group input", "btnAddBien");
  manejarEnterEnInputs("#nombreCliente");
});




