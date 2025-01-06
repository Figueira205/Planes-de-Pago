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
  const historialPlanes = document.getElementById("historialPlanes");

  let acreedores = [];
  let bienes = [];
  let historial = [];

  // Mostrar/Ocultar input de meses "otro"
  periodoMeses.addEventListener("change", () => {
    if (periodoMeses.value === "otro") {
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

    if (nombreA && !isNaN(deudaA)) {
      acreedores.push({ nombre: nombreA, deuda: deudaA });
      actualizarListaAcreedores();
      nombreAcreedorInput.value = "";
      deudaAcreedorInput.value = "";
    } else {
      alert("Por favor, ingresa un nombre y una deuda válidos.");
    }
  });

  function actualizarListaAcreedores() {
    listaAcreedores.innerHTML = "";
    acreedores.forEach((ac, index) => {
      const li = document.createElement("li");
      li.textContent = `${ac.nombre} - Deuda: ${ac.deuda.toFixed(2)} €`;
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

    if (nombreB && !isNaN(valorB)) {
      bienes.push({ nombre: nombreB, valor: valorB });
      actualizarListaBienes();
      nombreBienInput.value = "";
      valorBienInput.value = "";
    } else {
      alert("Por favor, ingresa un nombre y un valor válidos.");
    }
  });

  function actualizarListaBienes() {
    listaBienes.innerHTML = "";
    const total = bienes.reduce((acc, b) => acc + b.valor, 0);
    valorTotalBienesEl.textContent = total.toFixed(2);
    bienes.forEach((b, index) => {
      const li = document.createElement("li");
      li.textContent = `${b.nombre} - Valor: ${b.valor.toFixed(2)} €`;
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
    if (isNaN(mesesVal) || mesesVal <= 0) mesesVal = 60;

    const valorBienes = bienes.reduce((acc, b) => acc + b.valor, 0);

    if (!cliente || !acreedores.length || !bienes.length) {
      alert("Completa todos los campos (cliente, acreedores y bienes)");
      return;
    }

    const deudaTotal = acreedores.reduce((acc, a) => acc + a.deuda, 0);
    const plan = {
      cliente: cliente,
      fecha: new Date().toLocaleString(),
      data: acreedores.map(a => ({
        nombre: a.nombre,
        deuda: a.deuda.toFixed(2),
        porcentaje: ((a.deuda / deudaTotal) * 100).toFixed(2),
        importe: ((a.deuda / deudaTotal) * valorBienes).toFixed(2),
        meses: mesesVal,
        cuotaMensual: (((a.deuda / deudaTotal) * valorBienes) / mesesVal).toFixed(2)
      }))
    };

    historial.push(plan);
    actualizarHistorial();
    alert("Plan creado correctamente.");
  });

  function actualizarHistorial() {
    historialPlanes.innerHTML = "";
    historial.forEach((plan, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${plan.cliente} | ${plan.fecha}</span>
        <div class="actions">
          <button class="btnDescargarPlan">Descargar</button>
        </div>
      `;
      li.querySelector(".btnDescargarPlan").addEventListener("click", () => {
        descargarPlanComoPDF(plan);
      });
      historialPlanes.appendChild(li);
    });
  }

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

  // Limpiar campos
  btnLimpiarCampos.addEventListener("click", () => {
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
  });
});


