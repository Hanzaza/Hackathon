#!/bin/bash
# ==============================================================================
# SCRIPT DE AUTOMATIZACIÓN PARA MÁQUINA VIRTUAL AZURE UBUNTU 22.04 LTS
# Entregables: Servidor Seguro, Proxy Inverso, Docker y CORS
# ==============================================================================

set -e

echo "=========================================================="
echo "🚀 INICIANDO CONFIGURACIÓN DEL SERVIDOR AZURE..."
echo "Usuario actual: $(whoami)"
echo "=========================================================="

# 1. Actualización de paquetes
echo "📦 Actualizando paquetes del sistema..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Configurar 2GB de memoria SWAP (Evita caídas por memoria en VMs de 1GB o 2GB RAM)
if [ ! -f /swapfile ]; then
    echo "🧠 Configurando memoria SWAP de 2GB..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ SWAP habilitada exitosamente."
else
    echo "ℹ️ SWAP ya configurada."
fi

# 3. Instalar herramientas esenciales y Docker
echo "🐳 Instalando Docker y utilidades..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release git htop ufw

# Agregar llave oficial de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 4. Permitir ejecutar Docker sin 'sudo' para el usuario estándar actual
sudo usermod -aG docker $USER

echo "=========================================================="
echo "✅ SERVIDOR CONFIGURADO CON ÉXITO!"
echo "Docker version: $(docker --version)"
echo "Docker compose version: $(docker compose version)"
echo "=========================================================="
echo "💡 Recuerda cerrar sesión y volver a entrar por SSH para aplicar permisos de Docker."
