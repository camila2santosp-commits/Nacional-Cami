// Autenticación con Google
// OAuth2 para Google Drive y YouTube (será integrado cuando proporciones conectores)

const Auth = {

    // Configuración (será completada con datos reales)
    config: {
        clientId: '80822067233-s40dkcgksulmqnl9itf15ait4pdrephm.apps.googleusercontent.com',
        redirectUri: window.location.origin,
        scopes: [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/youtube.readonly'
        ]
    },

    isAuthenticated: false,
    accessToken: null,

    // Inicializa Google Sign-In
    init() {
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.authenticate());
        }

        // Verificar si hay token guardado
        const savedToken = Storage.getConnectors().googleAccessToken;
        if (savedToken) {
            this.accessToken = savedToken;
            this.isAuthenticated = true;
            this.updateUI();
            document.getElementById('loadFromDriveBtn').disabled = false;
        }
    },

    // Inicia autenticación con Google
    authenticate() {
        if (!this.config.clientId) {
            alert('❌ Conectores no configurados.\n\nEn la pestaña "Config", ingresa el Client ID de Google en el campo "Conectores"');
            return;
        }

        // Usar Google OAuth2 implicit flow (simplificado para SPA)
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'token',
            scope: this.config.scopes.join(' ')
        });

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    },

    // Procesa el token de OAuth2 desde la URL
    handleOAuthCallback() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');

        if (token) {
            this.accessToken = token;
            this.isAuthenticated = true;

            // Guardar token
            const connectors = Storage.getConnectors();
            connectors.googleAccessToken = token;
            Storage.saveConnectors(connectors);

            this.updateUI();
            document.getElementById('loadFromDriveBtn').disabled = false;

            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    },

    // Actualiza la UI después de autenticación
    updateUI() {
        const authBtn = document.getElementById('authBtn');
        const userInfo = document.getElementById('userInfo');

        if (this.isAuthenticated) {
            authBtn.textContent = '✓ Conectado';
            authBtn.disabled = true;
            authBtn.style.backgroundColor = '#4CAF50';
            userInfo.textContent = '✓ Google Drive conectado';
            userInfo.style.color = '#4CAF50';
        }
    },

    // Logout
    logout() {
        this.isAuthenticated = false;
        this.accessToken = null;

        const connectors = Storage.getConnectors();
        connectors.googleAccessToken = '';
        Storage.saveConnectors(connectors);

        const authBtn = document.getElementById('authBtn');
        const userInfo = document.getElementById('userInfo');

        authBtn.textContent = 'Conectar Google';
        authBtn.disabled = false;
        authBtn.style.backgroundColor = '';
        userInfo.textContent = '';

        document.getElementById('loadFromDriveBtn').disabled = true;
    },

    // Llamada a Google Drive API (se usa cuando tenemos token)
    async driveAPI(method, params) {
        if (!this.accessToken) {
            console.error('No hay token de autenticación');
            return null;
        }

        const url = new URL('https://www.googleapis.com/drive/v3/' + params.path);
        if (params.query) {
            Object.entries(params.query).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: params.body ? JSON.stringify(params.body) : undefined
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expirado
                    this.logout();
                    alert('Sesión expirada. Por favor, vuelve a conectar con Google.');
                }
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en Drive API:', error);
            return null;
        }
    },

    // Llama a YouTube API (sin autenticación, usando API key)
    async youtubeAPI(method, params) {
        const apiKey = Storage.getConnectors().youtubeApiKey;
        if (!apiKey) {
            console.error('No hay API key de YouTube configurada');
            return null;
        }

        const url = new URL('https://www.googleapis.com/youtube/v3/' + params.path);
        url.searchParams.append('key', apiKey);

        if (params.query) {
            Object.entries(params.query).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en YouTube API:', error);
            return null;
        }
    },

    // Buscar videos en YouTube
    async searchYoutubeVideos(query, channelId) {
        return this.youtubeAPI('GET', {
            path: 'search',
            query: {
                part: 'snippet',
                q: query,
                channelId: channelId,
                type: 'video',
                maxResults: 10,
                order: 'relevance'
            }
        });
    },

    // Obtener videos del canal
    async getChannelVideos(channelId) {
        return this.youtubeAPI('GET', {
            path: 'search',
            query: {
                part: 'snippet',
                channelId: channelId,
                type: 'video',
                maxResults: 50,
                order: 'date'
            }
        });
    },

    // Listar archivos Excel en una carpeta de Drive
    async listExcelFilesInFolder(folderId) {
        if (!folderId) {
            console.error('ID de carpeta no proporcionado');
            return [];
        }

        const result = await this.driveAPI('GET', {
            path: 'files',
            query: {
                q: `'${folderId}' in parents and (mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel') and trashed=false`,
                spaces: 'drive',
                fields: 'files(id, name, modifiedTime)',
                pageSize: 50,
                orderBy: 'modifiedTime desc'
            }
        });

        return result?.files || [];
    },

    // Obtener contenido del archivo Excel de Drive
    async downloadExcelFile(fileId) {
        if (!this.accessToken) {
            console.error('No hay token de autenticación');
            return null;
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    alert('Sesión expirada. Por favor, vuelve a conectar con Google.');
                }
                throw new Error(`Download error: ${response.status}`);
            }

            return await response.arrayBuffer();
        } catch (error) {
            console.error('Error descargando archivo:', error);
            return null;
        }
    }
};

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    Auth.handleOAuthCallback();
});
