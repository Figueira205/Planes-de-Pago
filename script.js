document.addEventListener("DOMContentLoaded", () => {
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
    const btnNuevoPlan = document.getElementById("btnNuevoPlan");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const modalTableContainer = document.getElementById("modalTableContainer");
  
    let acreedores = [];
    let bienes = [];
    let historial = [];
  
    // Mostrar/Ocultar input de meses 'otro'
    periodoMeses.addEventListener("change", () => {
      if(periodoMeses.value === "otro") {
        periodoMesesOtro.style.display = "block";
      } else {
        periodoMesesOtro.style.display = "none";
      }
    });
  
    // Habilitar/deshabilitar límite
    checkLimite.addEventListener("change", () => {
      limiteMonto.disabled = !checkLimite.checked;
    });
  
    // Añadir Acreedor
    btnAddAcreedor.addEventListener("click", () => {
      const nombreAcreedorInput = document.querySelector(".acreedor-nombre");
      const deudaAcreedorInput = document.querySelector(".acreedor-deuda");
  
      const nombreA = nombreAcreedorInput.value.trim();
      const deudaA = parseFloat(deudaAcreedorInput.value.trim());
  
      if(nombreA && !isNaN(deudaA)) {
        acreedores.push({ nombre: nombreA, deuda: deudaA });
        actualizarListaAcreedores();
        // Limpiar inputs
        nombreAcreedorInput.value = "";
        deudaAcreedorInput.value = "";
      } else {
        alert("Por favor, ingresa nombre y deuda válida.");
      }
    });
  
    function actualizarListaAcreedores() {
      listaAcreedores.innerHTML = "";
      acreedores.forEach((ac, index) => {
        const li = document.createElement("li");
        li.textContent = `${ac.nombre} - Deuda: ${ac.deuda.toFixed(2)}`;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {
          acreedores.splice(index, 1);
          actualizarListaAcreedores();
        });
        li.appendChild(btnEliminar);
        listaAcreedores.appendChild(li);
      });
    }
  
    // Añadir Bien
    btnAddBien.addEventListener("click", () => {
      const nombreBienInput = document.querySelector(".bien-nombre");
      const valorBienInput = document.querySelector(".bien-valor");
  
      const nombreB = nombreBienInput.value.trim();
      const valorB = parseFloat(valorBienInput.value.trim());
  
      if(nombreB && !isNaN(valorB)) {
        bienes.push({ nombre: nombreB, valor: valorB });
        actualizarListaBienes();
        nombreBienInput.value = "";
        valorBienInput.value = "";
      } else {
        alert("Por favor, ingresa nombre y valor válido para el bien.");
      }
    });
  
    function actualizarListaBienes() {
      listaBienes.innerHTML = "";
      const total = bienes.reduce((acc, b) => acc + b.valor, 0);
      valorTotalBienesEl.textContent = total.toFixed(2);
      bienes.forEach((b, index) => {
        const li = document.createElement("li");
        li.textContent = `${b.nombre} - Valor: ${b.valor.toFixed(2)}`;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {
          bienes.splice(index, 1);
          actualizarListaBienes();
        });
        li.appendChild(btnEliminar);
        listaBienes.appendChild(li);
      });
    }
  
    // Crear Plan
    btnCrearPlan.addEventListener("click", () => {
      const cliente = nombreCliente.value.trim();
      let mesesVal = periodoMeses.value === "otro" ? parseInt(periodoMesesOtro.value.trim()) : parseInt(periodoMeses.value);
      if(isNaN(mesesVal) || mesesVal <=0) mesesVal = 60;
  
      const valorBienes = bienes.reduce((acc, b) => acc + b.valor, 0);
  
      if(!cliente || !acreedores.length || !bienes.length) {
        alert("Completa todos los campos (cliente, acreedores y bienes)");
        return;
      }
  
      // 1) Deuda total
      const deudaTotal = acreedores.reduce((acc, a) => acc + a.deuda, 0);
  
      // 2) Porcentaje total original sin límite
      const porcentajeTotalOriginal = (valorBienes * 100) / deudaTotal;
  
      // Cálculo inicial sin límite
      let acreedoresCalculados = acreedores.map(a => {
        const porcentaje = ((a.deuda * porcentajeTotalOriginal) / deudaTotal);
        const importe = (a.deuda * (porcentajeTotalOriginal / 100));
        const cuotaMensual = importe / mesesVal;
        return {
          nombre: a.nombre,
          deuda: a.deuda,
          porcentaje: porcentaje,   // guardamos sin redondear aún
          importe: importe,         // igual
          meses: mesesVal,
          cuotaMensual: cuotaMensual
        };
      });
  
      // Totales iniciales
      let sumaImportes = acreedoresCalculados.reduce((acc, a) => acc + a.importe, 0);
      let sumaCuotas = acreedoresCalculados.reduce((acc, a) => acc + a.cuotaMensual, 0);
  
      // Aplicar límite si está activado
      if(checkLimite.checked) {
        const limite = parseFloat(limiteMonto.value);
        if(!isNaN(limite) && limite > 0 && sumaCuotas > limite) {
          // ratio para reducir todos los valores
          const ratio = limite / sumaCuotas;
  
          // Escalamos todos los importes y cuotas
          acreedoresCalculados = acreedoresCalculados.map(a => {
            const nuevoImporte = a.importe * ratio;
            const nuevaCuota = a.cuotaMensual * ratio;
            return {
              ...a,
              importe: nuevoImporte,
              cuotaMensual: nuevaCuota
            };
          });
  
          // Recalcular totales tras el ajuste
          sumaImportes = acreedoresCalculados.reduce((acc, a) => acc + a.importe, 0);
          sumaCuotas = acreedoresCalculados.reduce((acc, a) => acc + a.cuotaMensual, 0);
  
          // Nuevo porcentaje total basado en el importe final
          // Ahora el porcentaje total reflejará la relación entre lo que se paga finalmente y la deuda total
          const nuevoPorcentajeTotal = (sumaImportes * 100) / deudaTotal;
  
          // Recalcular porcentajes individuales basados en el importe relativo
          // Ahora cada porcentaje debe ser (importe / sumaImportes) * nuevoPorcentajeTotal
          acreedoresCalculados = acreedoresCalculados.map(a => {
            const porc = ((a.importe / sumaImportes) * nuevoPorcentajeTotal);
            return {
              ...a,
              porcentaje: porc
            };
          });
        }
      }
  
      // Redondeamos los valores finales
      acreedoresCalculados = acreedoresCalculados.map(a => {
        return {
          ...a,
          deuda: a.deuda.toFixed(2),
          porcentaje: a.porcentaje.toFixed(2),
          importe: a.importe.toFixed(2),
          cuotaMensual: a.cuotaMensual.toFixed(2)
        };
      });
  
      // Añadir fila TOTAL
      const porcentajeTotalFinal = (sumaImportes * 100) / deudaTotal;
      acreedoresCalculados.push({
        nombre: "TOTAL",
        deuda: deudaTotal.toFixed(2),
        porcentaje: porcentajeTotalFinal.toFixed(2),
        importe: sumaImportes.toFixed(2),
        meses: mesesVal,
        cuotaMensual: sumaCuotas.toFixed(2)
      });
  
      mostrarTabla(acreedoresCalculados);
      guardarEnHistorial(cliente, acreedoresCalculados);
    });
  
    function mostrarTabla(data) {
      let html = generarHTMLTabla(data);
      tablaResultados.innerHTML = html;
    }
  
    function generarHTMLTabla(data) {
      let html = `
        <table>
          <thead>
            <tr>
              <th>Identidad Acreedora</th>
              <th>Deuda</th>
              <th>Porcentaje</th>
              <th>Importe a Abonar</th>
              <th>Número de Meses</th>
              <th>Cuotas Mensuales</th>
            </tr>
          </thead>
          <tbody>
      `;
      data.forEach(row => {
        html += `
          <tr>
            <td>${row.nombre}</td>
            <td>${row.deuda}</td>
            <td>${row.porcentaje}</td>
            <td>${row.importe}</td>
            <td>${row.meses}</td>
            <td>${row.cuotaMensual}</td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
      return html;
    }
  
    function guardarEnHistorial(cliente, data) {
      const fecha = new Date().toLocaleString();
      const plan = {
        cliente: cliente,
        fecha: fecha,
        data: data
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
          // Lógica para descargar (ej: CSV o PDF)
          alert("Descargar plan no implementado aún.");
        });
        li.querySelector(".btnVerPlan").addEventListener("click", () => {
          mostrarModalConPlan(plan);
        });
        historialPlanes.appendChild(li);
      });
    }
  
    btnNuevoPlan.addEventListener("click", () => {
      limpiarCampos();
    });
  
    btnLimpiarCampos.addEventListener("click", () => {
      limpiarCampos();
    });

    // Descargar Plan en PDF
  function descargarPlanComoPDF(plan) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Plan de Pago - Cliente: ${plan.cliente}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${plan.fecha}`, 10, 20);

    doc.autoTable({
      head: [['Identidad Acreedora', 'Deuda', 'Porcentaje', 'Importe a Abonar', 'Meses', 'Cuotas Mensuales']],
      body: plan.data.map(row => [
        row.nombre,
        `${row.deuda} €`,
        `${row.porcentaje}%`,
        `${row.importe} €`,
        row.meses,
        `${row.cuotaMensual} €`
      ]),
      startY: 30,
    });

    doc.save(`Plan_Pago_${plan.cliente.replace(/\s+/g, '_')}.pdf`);
  }


    function limpiarCampos() {
      nombreCliente.value = "";
      periodoMeses.value = "60";
      periodoMesesOtro.value = "";
      periodoMesesOtro.style.display = "none";
      checkLimite.checked = false;
      limiteMonto.disabled = true;
      limiteMonto.value = "";
      acreedores = [];
      bienes = [];
      actualizarListaAcreedores();
      actualizarListaBienes();
      tablaResultados.innerHTML = "";
    }
  
    // Modal
    modalClose.addEventListener("click", () => {
      modalOverlay.style.display = "none";
      modalTableContainer.innerHTML = "";
    });
  
    function mostrarModalConPlan(plan) {
      modalTableContainer.innerHTML = generarHTMLTabla(plan.data);
      modalOverlay.style.display = "flex";
    }
  
  });
  


