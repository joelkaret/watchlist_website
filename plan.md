# TV shows / Movies viewer

I was approached by Boris Johnson, and he has commissioned me to create a tv show / movie viewer. He wants to be able to organise the movies on his watch list, and rate them.

After an extensive interview, I was able to extract this list of requirements.

### Requirements:

-   A collection of movies and tv shows.
-   A gui that enables a user to:
    -   Add a new entry
    -   Edit an entry
    -   Delete an entry
    -   Filter by:
        -   Tv shows / Movies
        -   Personal rating (In a range)
        -   Rotten tomato rating (In a range)
        -   Platform to watch on (Netflix, Amazon Prime etc.)
        -   Watched / Not Watched / Rated / Not Rated
    -   Sort by:
        -   Personal rating (low <-> high)
        -   Rotten tomato rating (low <-> high)
        -   Alphabetical
        -   Date released (Recent <-> Old)
        -   Date added to list (Recent <-> Old)
        -   Number of recommendations
-   A class of "Show"
    -   Type: _ENUM: "TV" or "MOVIE"_
    -   Title: _STRING_
    -   Date released: _DATE_
    -   Date added: _DATE_
    -   Personal rating: _NUMBER (0 - 10)_
    -   Rotten tomato rating: _NUMBER (0 - 100)_
    -   Recommendations: _INTEGER_
    -   Watched: _BOOLEAN_
    - Watchlist: _BOOLEAN_
    - Where to watch: _ARRAY of STRING_
a