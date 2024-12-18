# TV shows / Movies viewer

I was approached by Jerry (anonymised name), and he has commissioned me to create a tv show / movie viewer. He wants to be able to organise the movies on his watch list, and rate them.

After an extensive interview, I was able to extract this list of requirements.

## Requirements

- A collection of movies and tv shows
- A gui that enables a user to:
  - Add a new entry
  - Edit an entry
  - Delete an entry
  - Filter by:
    - Tv shows / Movies
    - Personal rating (In a range)
    - Rotten tomato rating (In a range)
    - Platform to watch on (Netflix, Amazon Prime etc.)
    - Watched / Not Watched / Rated / Not Rated
  - Sort by:
    - Personal rating (low <-> high)
    - Rotten tomato rating (low <-> high)
    - Alphabetical
    - Date released (Recent <-> Old)
    - Date added to list (Recent <-> Old)
    - Number of recommendations
- A user account
  - Can sign in across devices
  - Secure
    - Password is not stored - hash
  - A profile page with some information about the user

## Classes Needed

From these requirements, I concluded that theses would be the necessary classes.

- Show [CLASS]
  - ID: _UUID_
  - Type: _ShowType_
  - Title: _STRING_
  - Genres: _ARRAY of ShowGenre_
  - Date released: _DATE_
  - Date added: _DATE_
  - Personal rating: _NUMBER (0 - 10)_
  - Rotten tomato rating: _NUMBER (0 - 100)_
  - Recommendations: _INTEGER_
  - Watched: _BOOLEAN_
  - Watchlist: _BOOLEAN_
  - Where to watch: _ARRAY of StreamingPlatform_
- Movie [SUBCLASS of Show]:
  - Length: _NUMBER INT (Seconds)_
- Tv [SUBCLASS of Show]:
  - Seasons: _NUMBER INT_
  - Episodes: _NUMBER INT_
- User [CLASS]
  - ID: _UUIDS_
  - Name: _STRING_
  - Password hash: _STRING_
  - Watched: _ARRAY of Shows_
  - Watchlist: _ARRAY of Shows_
  - Date joined: _DATE_
- StreamingPlatform [CLASS]
  - Name: _STRING_
  - Is Free: _BOOLEAN_
  - Colour: _STRING_ (Hex/RGB)
- ShowType [ENUM]:
  - "TV"
  - "MOVIE"
- ShowGenre [ENUM]:
  - "ROMANCE"
  - "ACTION"
  - "SCI-FI"
  - "DRAMA"
  - "COMEDY"
  - more...

## UI Plan

[Figma Link](https://www.figma.com/design/AltDQREfwKEPBVW3GRyhiB/Watchlist_website?node-id=0-1&t=JkS7BfM77wp5y5Ki-1)

## Architecture / Frameworks

I plan to use React as my front end framework, in Typescript.
I also plan to figure out the storage of accounts and shows later.
