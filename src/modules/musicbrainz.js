import { getCharactersBefore, getCharactersAfter } from "../util/titleSeparator.js";



/**
 * Searches the MusicBrainz database for recording metadata.
 * 
 * @param {string} title - Recording to search for.
 * @returns JSON object containing MusicBrainz recording metadata.
 */
export async function searchForRecording(title) {
  console.log(`Searching MusicBrainz db for recording metadata for "${title}"...`);

  // Extract values from title & trim whitespace.
  const artist = getCharactersBefore(title, '-').trim();
  const recording = getCharactersAfter(title, '-').trim();

  const recordingMetaData = await fetch(`https://musicbrainz.org/ws/2/release/?query=artist:"${artist}" and recording:"${recording}" and format:vinyl and status:official and type:album&limit=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LpDataGrabber/1.0 ( ryanbsy@gmail.com )'
      }
  })
      .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}.`);
        }

        console.log('Recording metadata found.');
        return response.json();
      })
      .catch(error => {
        console.error(`Error searching for ${title} - ${error}.`);
        return null;
      });  

  return recordingMetaData;
}

// Sample request:
// searchForRecording('Billy Idol - Rebel Yell').then(data => console.log(data));

/**
Sample result:

{
  created: '2025-03-21T16:01:22.819Z',
  count: 4459236,
  offset: 0,
  releases: [
    {
      id: 'c17691cc-3849-437c-a07e-71e94e374b44',
      score: 100,
      'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
      'packaging-id': 'f7101ce3-0384-39ce-9fde-fbbd0044d35f',
      count: 1,
      title: 'Rebel Yell',
      status: 'Official',
      packaging: 'Cardboard/Paper Sleeve',
      'text-representation': [Object],
      'artist-credit': [Array],
      'release-group': [Object],
      date: '1983',
      country: 'PT',
      'release-events': [Array],
      barcode: '',
      'label-info': [Array],
      'track-count': 9,
      media: [Array]
    }
  ]
}
 */



/**
 * Searches the Cover Art Archive for an album's cover image.
 * 
 * @param {string} id - MusicBrainz release group ID to search for.
 * @returns JSON object containing cover art metadata..
 */
export async function searchForCoverArt(id) {
    console.log(`Searching for cover art metadata...`);

    const coverArtMetaData = await fetch(`http://coverartarchive.org/release-group/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LpDataGrabber/1.0 ( ryanbsy@gmail.com )'
        }
    })
        .then(response => {          
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}.`);
          }

          console.log('Cover art metadata found.');
          return response.json();
        })
        .catch(error => {
            console.error(`Error searching for cover art for id # ${id} - ${error}.`);
            return null;
        });  

    return coverArtMetaData;
}

// Sample request:
// searchForCoverArt('5c4a34dd-86b9-3b5e-89d7-61b49628a806').then(data => console.log(data)); 

/**

Sample result:

{
  images: [
    {
      approved: true,
      back: false,
      comment: '',
      edit: 103617114,
      front: true,
      id: 36687618168,
      image: 'http://coverartarchive.org/release/75a89615-3383-4ef3-8a5c-cc2630295aea/36687618168.jpg',
      thumbnails: [Object],
      types: [Array]
    }
  ],
  release: 'https://musicbrainz.org/release/75a89615-3383-4ef3-8a5c-cc2630295aea'
}

*/