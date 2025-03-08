import { getCharactersBefore, getCharactersAfter } from "../util/titleSeparator.js";
/**
 * Searches the MusicBrainz database for a specific album.
 * 
 * @param {string} title - Album to search for.
 * @returns JSON object containing MusicBrainz release-group data.
 */
export async function searchForAlbum(title) {
    console.log(`Searching MusicBrainz db for "${title}"...`);

    // trim whitespace, remove spceial characters, and encode
    const artist = getCharactersBefore(title, '-').trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/ /g, '%20');
    const release = getCharactersAfter(title, '-').trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/ /g, '%20');

    const result = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=artist:%22${artist}%22%20AND%20release:%22${release}%22`, {
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
          return response.json();
        })
        .then(data => {
          const releaseGroups = data['release-groups'];

          let releaseGroup;
          if (releaseGroups.length > 0) {
            console.log('Release group found.')
            releaseGroup = releaseGroups[0]
          } else {
            console.log('No release group found.');
            releaseGroup = null;
          }

          return releaseGroup;
        })
        .catch(error => {
          console.error(`Error searching for ${album} - ${error}.`);
          return null;
        });  

    return result;
}

// searchForAlbum('A Tribe Called Quest - The Low End Theory').then(data => console.log(data));

/**
 * Sample result:
 * 
 * {
      id: 'c3733436-fcba-3c08-b082-d548df5c5139',
      'type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
      score: 100,
      'primary-type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
      count: 18,
      title: 'The Low End Theory',
      'first-release-date': '1991-09-24',
      'primary-type': 'Album',
      'artist-credit': [ { name: 'A Tribe Called Quest', artist: [Object] } ],
      releases: [
        {
          id: '7f951fa8-bfd3-4b0d-9c26-3f357d556613',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '4c6ba9ff-95ee-4a28-abc3-6755d6d1972d',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '4e91cfe1-8196-40c1-aed6-0dcadb763a3b',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: 'ffc8dd55-3ab3-4d62-a181-c3371189c507',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: 'f7665768-5c71-4373-8a6c-5a0b8bd6b217',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '2f7ca6d1-00ee-4f37-8901-d2e2521a57fe',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '057796e8-30bb-4397-8e3d-3a8e6f0d7b19',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '00833c5d-da40-44d0-b5d7-a52328b251bc',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '19aaadc2-9ffa-3001-ad4f-111c367309a3',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: 'a9dc3a10-39bb-4d03-8be2-200c18cdd2d1',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '6358e16c-1363-4607-975a-b477097d1a2f',
          'status-id': '518ffc83-5cde-34df-8627-81bff5093d92',
          title: 'The Low End Theory',
          status: 'Promotion'
        },
        {
          id: 'e405a0f0-50e4-4121-83f5-5aa8596b87a4',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '69959f4a-29fd-4867-83ec-bfb4036b30d1',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '0097556c-c0b2-4be8-993b-4bf22284a0e4',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '79e54943-5a93-4fdc-a7f7-27d33f1a1b28',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: 'cf45c6f5-b53f-4424-8caf-9ff792796cf2',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: '63747b49-c817-4688-a3c3-c6b534672f3e',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        },
        {
          id: 'e2b51264-ab8f-4168-849d-738e703ac24e',
          'status-id': '4e304316-386d-3409-af2e-78857eec5cfe',
          title: 'The Low End Theory',
          status: 'Official'
        }
      ],
      tags: [
        { count: 0, name: 'hip-hop' },
        { count: 1, name: 'mellow' },
        { count: 10, name: 'hip hop' },
        { count: 4, name: 'conscious' },
        { count: 0, name: 'hip hop rnb and dance hall' },
        { count: 0, name: 'hip hop rap' },
        { count: 1, name: 'sampling' },
        { count: 1, name: 'boom bap' },
        { count: 1, name: 'rhythmic' },
        { count: 7, name: 'jazz rap' },
        { count: 4, name: 'conscious hip hop' },
        { count: 5, name: 'east coast hip hop' }
      ]
    }
 */



/**
 * Searches the Cover Art Archive for an album cover image.
 * 
 * @param {string} id - Release ID from MusicBrainz to search for.
 * @returns URL string of the image.
 */
export async function searchForCoverArt(id) {
    console.log(`Searching for cover art...`);

    const image = await fetch(`http://coverartarchive.org/release-group/${id}`, {
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
          return response.json();
        })
        .then(data => {
          const images = data.images;

          let image;
          if (images.length > 0) {
            console.log('Cover art found.');
            image = images[0].image;
          } else {
            console.log('No cover art found.');
            image = null;
          }

          return image;
        })
        .catch(error => {
            console.error(`Error searching for image for album id # ${id} - ${error}.`);
            return null;
        });  

    return image;
}

// Search cover art using release group id from sample result above.
// searchForCoverArt('c3733436-fcba-3c08-b082-d548df5c5139').then(data => console.log(data)); 

/**
 * Sample result:
 * 
 * http://coverartarchive.org/release/69959f4a-29fd-4867-83ec-bfb4036b30d1/1672879787.jpg
 */