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
    const response = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=10", {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    return await response.json();
}

getToken().then(response => {
    let token = response.access_token;

    getNewReleases(token).then(async data => {
        let newReleases = data.albums.items;

        for (let i = 0; i < newReleases.length; i++) {
            if (newReleases[i].album_type != 'single') {
                const response = await fetch(newReleases[i].href, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token },
                });
                const album = await response.json();
                // console.log(album);
                console.log('artist:', album.artists[0].name);
                console.log('title:', album.name);
                console.log('genres:', album.genres);
                console.log('image:', album.images[0].url);
                console.log('upc:', album.external_ids.upc);
                console.log('album type:', album.album_type);
                console.log('');
            }
        }
    }).catch(err => console.error(err));

}).catch(err => console.error(err));