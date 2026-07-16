#!/bin/bash

# Script para ejecutar la app de forma local con servidor HTTP

echo "🚀 Iniciando Planificador de Preventivos..."
echo ""

# Verificar qué servidor está disponible
if command -v python3 &> /dev/null; then
    echo "✓ Usando Python HTTP Server"
    echo "📌 La app está disponible en: http://localhost:8000"
    echo "⏹️  Para detener: Ctrl+C"
    echo ""
    python3 -m http.server 8000 --directory .
elif command -v python &> /dev/null; then
    echo "✓ Usando Python HTTP Server"
    echo "📌 La app está disponible en: http://localhost:8000"
    echo "⏹️  Para detener: Ctrl+C"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✓ Usando http-server (Node.js)"
    echo "📌 La app está disponible en: http://localhost:8000"
    echo "⏹️  Para detener: Ctrl+C"
    echo ""
    npx http-server . -p 8000
else
    echo "❌ No se encontró servidor disponible"
    echo "Por favor, instala uno de:"
    echo "  - Python 3: python3 -m http.server 8000"
    echo "  - Node.js: npm install -g http-server"
    exit 1
fi
