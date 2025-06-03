const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require('./config');

class RefragAPI {
    static AVAILABLE_MAPS = [
        "de_overpass",
        "de_anubis",
        "de_ancient",
        "de_mirage",
        "de_vertigo",
        "de_dust2",
        "de_inferno",
        "de_nuke",
        "de_train"
    ];

    constructor() {
        this.baseURL = 'https://api.refrag.gg';
        this.authData = null;
    }

    async login(email = config.refrag.email, password = config.refrag.password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/sign_in`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Login failed: ${data.message || 'Unknown error'}`);
            }

            this.authData = {
                accessToken: response.headers.get('access-token'),
                client: response.headers.get('client'),
                uid: response.headers.get('uid'),
                expiry: response.headers.get('expiry')
            };

            return this.authData;
        } catch (error) {
            throw new Error(`Login error: ${error.message}`);
        }
    }

    async startNewServer(map = 'de_mirage', authData = this.authData) {
        if (!authData) {
            throw new Error('Authentication required');
        }

        if (!RefragAPI.AVAILABLE_MAPS.includes(map)) {
            throw new Error(`Invalid map. Available maps are: ${RefragAPI.AVAILABLE_MAPS.join(', ')}`);
        }

        try {
            const response = await fetch(`${this.baseURL}/cs_servers/start_new_server`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'access-token': authData.accessToken,
                    'client': authData.client,
                    'expiry': authData.expiry,
                    'uid': authData.uid,
                    'x-game': 'cs2',
                    'x-team-id': config.refrag.teamId
                },
                body: JSON.stringify({
                    server_location_id: 5,
                    game: 'cs2',
                    betaServer: false,
                    secureServer: false,
                    is_assessment: false,
                    launch_settings: {
                        mod: 'retakes',
                        map: map
                    }
                })
            });

            const data = await response.json();
            
            if (data.errors) {
                throw new Error(`Server start failed: ${JSON.stringify(data.errors)}`);
            }

            return data;
        } catch (error) {
            throw new Error(`Server start error: ${error.message}`);
        }
    }

    async getRunningServers(authData = this.authData) {
        if (!authData) {
            throw new Error('Authentication required');
        }

        try {
            const response = await fetch(`${this.baseURL}/cs_servers/running`, {
                headers: {
                    'access-token': authData.accessToken,
                    'client': authData.client,
                    'expiry': authData.expiry,
                    'uid': authData.uid,
                    'x-game': 'cs2'
                }
            });

            const data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No servers found');
            }

            return data;
        } catch (error) {
            throw new Error(`Get servers error: ${error.message}`);
        }
    }

    async getConnectionString(authData = this.authData) {
        const servers = await this.getRunningServers(authData);
        const server = servers[0];
        return `connect ${server.ip}:${server.port}; password ${server.password}`;
    }
}

module.exports = RefragAPI;
