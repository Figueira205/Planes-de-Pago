<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preguntas Frecuentes - Planificador de Pagos</title>
  <link rel="stylesheet" href="style.css">
  <link rel="icon" type="image/png" href="./recursos/logo creditaria.png">
</head>
<body>
  <nav>
    <div class="logo">
      <a href="index.html">Planificador de Pagos</a>
    </div>
    <div class="menu">
      <a href="index.html" id="btnInicio">Inicio</a>
      <a href="faq.html" id="btnFAQ">Preguntas Frecuentes</a>
    </div>
  </nav>

  <div class="main-container">
    <div class="container">
      <h1>Guía Completa del Planificador de Pagos</h1>
      <p class="faq-intro">Esta herramienta ayuda a personas y negocios a organizar sus deudas considerando sus bienes y capacidad de pago. Crea planes personalizados que distribuyen pagos entre acreedores de forma equitativa y sostenible.</p>
      
      <div class="faq-section">
        <!-- Sección: Conceptos Básicos -->
        <div class="faq-category">
          <h2>📚 Conceptos Fundamentales</h2>
          
          <div class="faq-item">
            <div class="faq-question">
              <h3>¿Qué es un plan de pagos personalizado?</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <p>Es una estrategia financiera que:<br>
              1. Considera <strong>tus bienes disponibles</strong><br>
              2. Distribuye pagos entre <strong>todos tus acreedores</strong><br>
              3. Respeta tu <strong>capacidad de pago mensual</strong><br>
              4. Puede incluir <strong>reducciones negociadas (quitas)</strong></p>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <h3>¿Quién debería usar esta herramienta?</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <p>Es ideal si:<br>
              ✔ Tienes <strong>múltiples deudas</strong> con diferentes entidades<br>
              ✔ Necesitas <strong>organizar pagos a largo plazo</strong><br>
              ✔ Quieres <strong>negociar con acreedores</strong> usando datos concretos<br>
              ✔ Buscas <strong>evitar la morosidad</strong> mediante planificación</p>
            </div>
          </div>
        </div>

        <!-- Sección: Funcionalidades Clave -->
        <div class="faq-category">
          <h2>⚙️ Funcionalidades Detalladas</h2>

          <div class="faq-item">
            <div class="faq-question">
              <h3>¿Cómo funcionan los acreedores y deudas?</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <p><strong>Paso a paso:</strong><br>
              1. <em>Añade acreedores:</em> Banco, proveedores, préstamos personales<br>
              2. <em>Especifica deudas:</em> Cantidad exacta que debes a cada uno<br>
              3. <em>Sistema calcula:</em> 
                <span class="highlight">% que recibe cada uno</span> basado en tus bienes<br>
              4. <em>Resultado:</em> Plan de pagos proporcional y justo</p>
              <div class="example-box">
                💡 Ejemplo: Si debes €10k a Banco A y €5k a Proveedor B, 
                y tienes €9k en bienes, recibirán 60% y 40% respectivamente.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <h3>¿Qué son las quitas y cómo aplicarlas?</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="fafaq-answer">
              <p><strong>Quita = Reducción negociada de deuda</strong><br>
              • Usa el <span class="highlight">deslizador</span> para establecer % de reducción<br>
              • Se aplica <em>por igual</em> a todos los acreedores<br>
              • Útil para <strong>simular acuerdos de pago</strong></p>
              <div class="warning-box">
                ⚠ Importante: La quita reduce el total adeudado, 
                pero también lo que puedes pagar con tus bienes.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <h3>Límites de pago e hipotecas</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <p><strong>Funcionamiento combinado:</strong><br>
              1. <em>Hipoteca:</em> Gasto fijo prioritario cada mes<br>
              2. <em>Límite:</em> Máximo que puedes pagar mensualmente<br>
              3. <em>Sistema ajusta:</em> Si hipoteca + pagos superan el límite:<br>
                &nbsp;&nbsp;• Reduce proporcionalmente pagos a acreedores<br>
                &nbsp;&nbsp;• Mantiene prioridad en hipoteca</p>
              <div class="example-box">
                💡 Ejemplo: Límite €1,000 + Hipoteca €400 = 
                €600 disponibles para acreedores
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Proceso Completo -->
        <div class="faq-category">
          <h2>📈 Flujo de Trabajo Paso a Paso</h2>

          <div class="faq-item">
            <div class="faq-question">
              <h3>¿Cómo crear un plan efectivo?</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <ol class="steps-list">
                <li><strong>Datos Básicos:</strong> Nombre cliente y periodo (12-120 meses)</li>
                <li><strong>Acreedores:</strong> Añade todas tus deudas relevantes</li>
                <li><strong>Bienes:</strong> Registra propiedades, ahorros, inversiones</li>
                <li><strong>Ajustes:</strong>
                  <ul>
                    <li>¿Tienes hipoteca? Activa y completa monto</li>
                    <li>¿Necesitas límite mensual? Activa y establece cantidad</li>
                    <li>¿Negociando quitas? Usa el deslizador (% deseado)</li>
                  </ul>
                </li>
                <li><strong>Generar Plan:</strong> Revisa tabla interactiva y:
                  <ul>
                    <li>Guarda en Historial para comparar versiones</li>
                    <li>Exporta a PDF para presentar a acreedores</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Sección: Seguridad y Datos -->
        <div class="faq-category">
          <h2>🔒 Privacidad y Gestión de Datos</h2>

          <div class="faq-item">
            <div class="faq-question">
              <h3>¿Dónde se almacena mi información?</h3>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <p><strong>Almacenamiento local:</strong><br>
              • Tus datos <em>nunca</em> abandonan tu dispositivo<br>
              • Historial se guarda en tu navegador<br>
              • Puedes eliminar todo con el botón "Limpiar Campos"</p>
              <div class="warning-box">
                ⚠ Precaución: Al cerrar el navegador en modo incógnito 
                o limpiar caché, perderás los datos guardados.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <footer>
    <p>©2025 Creditaria Financial Group. Todos los derechos reservados.</p>
    <p><a target="_blank" href="https://www.creditaria.com/politica-de-cookies">Política de Cookies</a> | 
    <a target="_blank" href="https://www.creditaria.com/politica-de-privacidad">Política de Privacidad</a></p>
  </footer>

  <script>
    // Mismo script de toggle anterior
    document.querySelectorAll('.faq-question').forEach(item => {
      item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        const icon = item.querySelector('.toggle-icon');
        answer.classList.toggle('active');
        icon.style.transform = answer.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    });
  </script>
</body>
</html>


