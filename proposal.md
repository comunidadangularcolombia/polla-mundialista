# Project Constitution: PollaMundialista

## Tech Stack
- **Design & UI Prototyping:** Google Stitch (Herramienta oficial de maquetación interactiva y Vibe Design mediante servidor MCP)

- **Frontend:** Angular (Versión estable con control flow @if/@for)

- **State Management & Reactivity:** 100% Angular Signals (`signal`, `computed`, `resource`)

- **Dependency Injection:** Enfoque funcional moderno utilizando la función `inject()` (Sin inyección por constructor para servicios o componentes)

- **Styling:** Tailwind CSS (Tema minimalista y limpio basado en los tokens de diseño de Google Stitch)

- **Testing & Debugging:** Pruebas unitarias con patrón AAA e inspección en tiempo real mediante el servidor MCP de Chrome DevTools.

- **Deployment:** Despliegue mendiante **GitHub Actions** e integración directa con **GitHub Pages**.

## Approved Architecture Principles
- **Layered Architecture:** Estricta separación de capas:

  - **Component Layer:** Presentación pura de la interfaz de usuario y binding reactivo mediante Signals. Implementa fielmente las vistas exportadas por Google Stitch. Sin lógica de negocio compleja.

  - **Service Layer:** Orquestación del estado, control de flujos HTTP y evaluación de reglas de negocio.

  - **Model Layer:** Definición pura de tipos, interfaces y mapeadores de datos.

- **Single Responsibility Principle (SRP):** Cada clase, función o componente debe cumplir con un único propósito aislado.

- **Human-in-the-Loop (HITL) Model:** El agente de IA es una máquina de ejecución guiada. No debe realizar cambios estructurales, de lógica ni de diseño visual sin aprobación explícita del usuario.

## Mandatory Development Lifecycle (Flujo Secuencial Obligatorio)
El agente de OpenSpec debe seguir estrictamente este orden cronológico para el ciclo de vida del proyecto. Queda prohibido avanzar al siguiente paso o codificar lógicas sin completar y validar la fase anterior:

1. **Fase 1 - Repositorio:** Crear e inicializar el repositorio remoto en GitHub utilizando el servidor MCP de GitHub.

2. **Fase 2 - Sincronización de Diseño:** Conectarse al MCP de Google Stitch, procesar las instrucciones, descargar los componentes visuales mediante utilidades como `curl -L` utilizando los identificadores explícitos adjuntos y consolidar el Design System.

3. **Fase 3 - Construcción (Scaffolding y Código):** Construir la estructura del proyecto Angular e implementar la lógica guiada por las buenas practicas de la arquitectura Angular, la capa de diseño de Google Stitch y los principios SOLID.

4. **Fase 4 - Pruebas y Depuración:** Ejecutar la suite de pruebas unitarias locales (patrón AAA). Ante errores en tiempo de ejecución o interfaz en el navegador, es obligatorio utilizar el servidor **MCP de Chrome DevTools** para inspeccionar la consola, evaluar expresiones y leer el DOM antes de proponer cambios.

5. **Fase 5 - Despliegue:** Realizar el push final y automatizar el despliegue en **GitHub Pages** a través del pipeline de GitHub Actions.

## Boundaries & Guardrails
### ✅ ALWAYS DO:
- Escribir pruebas unitarias automatizadas para toda la lógica y validación de reglas ANTES de dar una tarea por completada.

- Utilizar el patrón Arrange-Act-Assert (AAA) en todos los archivos de pruebas.

- Nombrar los archivos de prueba como `[nombre].spec.ts`.

- Retornar objetos de error explícitos y fuertemente tipados ante fallas de validación.

- **Sincronizar e importar** los componentes visuales, layouts y tokens de diseño generados en el canvas de Google Stitch antes de maquetar el frontend.

- Utilizar Chrome DevTools MCP Server para leer logs de consola y evaluar expresiones en caliente cuando ocurran errores en tiempo de ejecución en el navegador.

### 🚫 NEVER DO:
- **Nunca alterar el orden del Ciclo de Vida:** Queda prohibido construir componentes o inicializar código de la aplicación sin haber creado el repositorio y verificado las pantallas de Stitch primero.

- Nunca utilizar inyección por constructor tradicional (`constructor(private service: Service)`) para dependencias.

- Nunca usar directivas estructurales antiguas (`*ngIf`, `*ngFor`).

- Nunca mezclar lógica matemática de cálculo de puntajes dentro de las plantillas HTML o el código de los componentes visuales.


- **Nunca improvisar la interfaz de usuario (Vibe Designing):** Queda estrictamente prohibido que la IA genere estilos, vistas o layouts en Angular que no coincidan exactamente con la especificación visual y los artefactos de diseño exportados desde Google Stitch.

## Business Error Codes

- **PREDICTION_LOCKED:** Intento de guardar o modificar un pronóstico para un partido que ya se encuentra en vivo ('live') o finalizado ('finished').

- **SCORE_CALCULATION_NOT_ALLOWED:** Intento de calcular el puntaje de la polla en un partido que aún no ha concluido.

- **DUPLICATE_PREDICTION:** Intento de registrar más de una predicción para el mismo identificador de partido (matchId).

## Error Handling Standards
Todas las validaciones o errores del sistema de cara al cliente deben producir un objeto inmutable con este esquema de ejemplo:
```json
{
  "error": "Explicación legible del error para el usuario",
  "code": "CODIGO_DE_ERROR",
  "timestamp": "ISO-8601"
}