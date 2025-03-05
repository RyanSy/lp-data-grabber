import 'dotenv/config';

const client_id = process.env.CLIENT_ID; 
const client_secret = process.env.CLIENT_SECRET;


/**
 * Retrieves an access token used to make calls to the Spotify Web API.
 * 
 * @returns JSON object containing access token data.
 */
export async function getToken() {
    console.log('Getting Spotify access token...');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
    });

    if (response.status === 200) {
        console.log('Spotify access token data successfully retrieved.');
        return response.json();
    } else {
        console.log(`Error getting Spotify access token - ${response.status}: ${response.statusText}`);
        return null;
    }
}


/**
 * Gets new releases from the Spotify catalog.
 * 
 * @param {string} access_token - Access token obtained from the getToken function.
 * @returns An array of JSON objects of new releases.
 */
export async function getNewReleases(access_token) {
    const response = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=50", {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    if (response.status === 200) {
        console.log('New releases successfully retrieved.');
        return response.json();

    } else {
        console.log(`Error getting new releases - ${response.status}: ${response.statusText}`);
        return null;
    }
}


/**
 * Searches the Spotify catalog for a specific album.
 * 
 * @param {string} access_token - Access token obtained from the getToken function.
 * @param {string} query - Album to search for.
 * @returns JSON object containing album data.
 */
export async function searchForAlbum(access_token, query) {
    console.log('Searching for album...');

    const response = await fetch(`https://api.spotify.com/v1/search?&q=${query}&type=album`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    console.log('Album successfully retrieved.');
    // console.log(response);

    return await response.json();
}


/**
 * Gets detailed Spotify catalog information for a specific artist.
 * 
 * @param {string} access_token - Access token obtained from the getToken function.
 * @param {string} href - Link to full artist details obtained from the getAlbum function.
 * @returns JSON object containing detailed artist data.
 */
export async function getArtist(access_token, href) {
    console.log('Getting artist data...');

    const response = await fetch(href, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    console.log('Artist data successfully retrieved.');
    // console.log(response);

    return await response.json();
}