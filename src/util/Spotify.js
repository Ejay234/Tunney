const clientID = '#Create an app to obtain ID';
const redirectURI = 'http://localhost:3000/';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check accessToken
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // clears the tokens
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();

        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        const response = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async savePlaylist(name, tracklist) {
        if (!name || !tracklist.length) {
            return;
        }

        const token = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };
        let userID;

        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(responseUserID => responseUserID.json()
        ).then(jsonResponseUserID => {
            userID = jsonResponseUserID.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(responsePlaylistID => responsePlaylistID.json()
            ).then(jsonResponsePlaylistID => {
                const playlistID = jsonResponsePlaylistID.id
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: tracklist })
                });
            })
        })
    }
}

export default Spotify;
