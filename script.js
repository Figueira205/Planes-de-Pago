document.addEventListener("DOMContentLoaded", () => {
  const nombreCliente = document.getElementById("nombreCliente");
  const btnAddAcreedor = document.getElementById("btnAddAcreedor");
  const listaAcreedores = document.getElementById("listaAcreedores");
  const btnCrearPlan = document.getElementById("crearPlan");
  const historialPlanes = document.getElementById("historialPlanes");

  let acreedores = [];
  let historial = [];

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

  // Crear Plan
  btnCrearPlan.addEventListener("click", () => {
    const cliente = nombreCliente.value.trim();
    if (!cliente || !acreedores.length) {
      alert("Completa los campos de cliente y acreedores.");
      return;
    }

    const deudaTotal = acreedores.reduce((acc, a) => acc + a.deuda, 0);
    const plan = {
      cliente: cliente,
      fecha: new Date().toLocaleString(),
      data: acreedores.map(a => ({
        nombre: a.nombre,
        deuda: a.deuda.toFixed(2),
        porcentaje: ((a.deuda / deudaTotal) * 100).toFixed(2)
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
      head: [['Identidad Acreedora', 'Deuda', 'Porcentaje']],
      body: plan.data.map(row => [row.nombre, row.deuda, `${row.porcentaje}%`]),
      startY: 30,
    });

    doc.save(`Plan_Pago_${plan.cliente.replace(/\s+/g, '_')}.pdf`);
  }
});

