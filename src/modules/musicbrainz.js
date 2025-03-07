/**
 * Searches the MusicBrainz database for a specific album.
 * 
 * @param {string} query - Album to search for.
 * @returns JSON object containing album data.
 */
export async function searchForAlbum(query) {
    console.log(`\nSearching MusicBrainz db for "${query}"...`);

    const album = await fetch(`https://musicbrainz.org/ws/2/release?query=release:${query}%20AND%20country:US`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LpDataGrabber/1.0 ( ryanbsy@gmail.com )'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            return data.releases[0];
        })
        .catch(error => {
            console.error(`Error searching for ${query} - ${error}`);
            return null;
        });  

    return album;
}
/**
 * sample output:
 * {
  id: 'd0941904-d861-4c0c-bf38-62a7b82eac98',
  score: 100,
  'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
  count: 1,
  title: 'Return of the SP1200',
  status: 'Official',
  'text-representation': { language: 'eng', script: 'Latn' },
  'artist-credit': [ { name: 'Pete Rock', artist: [Object] } ],
  'release-group': {
    id: 'da819646-254a-4993-aaf6-daee5c890e64',
    'type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
    'primary-type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
    title: 'Return of the SP1200',
    'primary-type': 'Album'
  },
  date: '2019-04-13',
  country: 'US',
  'release-events': [ { date: '2019-04-13', area: [Object] } ],
  barcode: '706091100116',
  asin: 'B07PCK6HV6',
  'label-info': [ { 'catalog-number': 'TRU1001-LP', label: [Object] } ],
  'track-count': 15,
  media: [ { format: '12" Vinyl', 'disc-count': 0, 'track-count': 15 } ]
}
 */



/**
 * Searches the Cover Art Archive for an album cover image.
 * 
 * @param {string} id - Release ID from MusicBrainz to search for.
 * @returns URL string of the image.
 */
export async function searchForCoverArt(id) {
    console.log(`\nSearching for cover art...`);

    const image = await fetch(`https://coverartarchive.org/release/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LpDataGrabber/1.0 ( ryanbsy@gmail.com )'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            return data.images[0].image;
        })
        .catch(error => {
            console.error(`Error searching for image for album id # ${id} - ${error}`);
            return null;
        });  

    return image;
}