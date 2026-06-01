# PollaMundialista

Sistema web de polla mundialista para gestionar pronósticos de partidos de fútbol, calcular puntajes automáticamente y visualizar clasificaciones en tiempo real.

## Descripción

PollaMundialista es una aplicación web construida con Angular que permite a los usuarios:

- Registrar pronósticos de resultados de partidos de fútbol
- Calcular puntajes automáticamente según reglas predefinidas
- Visualizar clasificaciones en tiempo real
- Garantizar la integridad de los pronósticos (no se pueden modificar una vez iniciado el partido)

## Tecnologías

- **Framework**: Angular (standalone components)
- **State Management**: Angular Signals
- **Styling**: Tailwind CSS
- **Testing**: Jasmine/Jest con property-based testing
- **Deployment**: GitHub Pages

## Características

- ✅ Registro de pronósticos con validación en tiempo real
- ✅ Cálculo automático de puntajes al finalizar partidos
- ✅ Tabla de clasificación actualizada en tiempo real
- ✅ Diseño responsivo y accesible
- ✅ Persistencia de datos en localStorage

## Reglas de Puntaje

- **3 puntos**: Pronóstico exacto (marcador completo)
- **1 punto**: Resultado correcto (ganador o empate) pero marcador incorrecto
- **0 puntos**: Resultado incorrecto

## Estado del Proyecto

🚧 En desarrollo

## Licencia

MIT
