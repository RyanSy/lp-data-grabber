require('dotenv').config();
const client_id = process.env.CLIENT_ID; 
const client_secret = process.env.CLIENT_SECRET;

/**
 * Get access token
 */
async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    },
  });

  return await response.json();
}

/**
 * Get new releases
 */
async function getNewReleases(access_token) {
  const response = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=50", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  return await response.json();
}

getToken().then(response => {
  getNewReleases(response.access_token).then(data => {
    let newReleases = data.albums.items;

    for (let i = 0; i < newReleases.length; i++) {
        // use newReleases[i].href to fetch info on each album
    }

    console.log(newReleases);
  });
});