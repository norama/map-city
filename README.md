## Table of Contents

- [Map city](#map-city)
  * [Demo](#demo)
  * [Backend](#backend)
    + [Build](#build)
  * [Frontend](#frontend)
    + [Build](#build-1)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Map City 

This application is a map-based web application showing weather information loaded from [OpenWeatherMap](https://openweathermap.org/api) and photos loaded from [Flickr](https://www.flickr.com/services/api/explore/flickr.photos.search).

The web app uses a map based UI backed with [react-leaflet](https://react-leaflet.js.org/) to show weather data and photos near location. Use the search box in the upper-left corner to search a location by name, click the appropriate from the list suggested (unfortunately otherwise it will not work, pressing ENTER is not enough - this is a limitation of the component used there). Or else, click on the map to select a location. If no specific location is selected or the map is dragged, photos are shown for the center of the map. The associated photos are shown on the right in a scrollable panel and dynamically added as the panel is scrolled down.

## Demo

Click [here](https://map-city-client-2019.now.sh/) to see it running.

## Backend

The backend provides data by REST API using [Node.js Express](https://expressjs.com/), getting the data from the above mentioned public APIs.

API endpoints:

- `/location`: weather data and photos near location
  - Parameters:
    * lat, lon: location on map
    * size: photo size code (default: 's', see https://www.flickr.com/services/api/misc.urls.html)
    * photosCount: number of requested photos (default: 1)

  - Returns:

```
    {
       weather, // see endpoint /location/weather below
       photos   // see endpoint /location/photos below
    }
```

- `/location/weather`: weather data near location
  - Parameters:
    * lat, lon: location on map

  - Returns:

```
    {
        latlon: {lat, lon},
        name, // location name
        country, // country code
        weather: {
            summary,
            description,
            icon, // weather pictogram url
            wind: {speed, direction}, // speed: m/s, direction: degrees
            humidity,
            pressure, // hPa
            temperature // degrees celsius
        }
    }
```

- `/location/photos`: photos near location
  - Parameters:
    * lat, lon: location on map
    * size: photo size code (default: 's', see https://www.flickr.com/services/api/misc.urls.html)
    * count: number of requested photos (default: 1)
    * page: page number (default: 1)

  - Returns: array of photo items:

```
   [{
        url, // static url to show as image
        width,
        height,
        view, // url to link orginal item on flickr
   }, ...]
```

### Build

- Development mode:

```
    cd backend
    yarn start
```

Server will run on `http://localhost:3002`.

Example queries:

```
http://localhost:3002/location?lat=40.4&lon=43.2&photosCount=5
http://localhost:3002/location/weather?lat=40.4&lon=43.2
http://localhost:3002/location/photos?lat=40.4&lon=43.2&count=5

```

- Production mode:

```
    cd backend
    yarn run build
```

Deploy on [Now](https://zeit.co/now):

```
    cd build
    now
```

### Demo

Currently deployed on [Now](https://zeit.co/now) and available at `https://map-city-server-2019.now.sh`.

Example queries:

- https://map-city-server-2019.now.sh/location?lat=40.4&lon=43.2&photosCount=5
- https://map-city-server-2019.now.sh/location/weather?lat=40.4&lon=43.2
- https://map-city-server-2019.now.sh/location/photos?lat=40.4&lon=43.2&count=5


## Frontend

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Build

- Development mode:

```
    cd frontend
    yarn start
```

Server will run on `http://localhost:3000`.

- Production mode:

  **Configuration:** set the deployed backend URL in [.env](https://github.com/norama/map-city/blob/master/frontend/.env). By default, it is set to the current deployment at https://map-city-server-2019.now.sh.

```
    cd frontend
    yarn run build
```

Deploy on [Now](https://zeit.co/now):

```
    cd build
    now --public --name <app-name>
```

In the browser copy the deployed app URL.

Example: currently deployed at

https://map-city-client-2019.now.sh

accessing the deployed backend at

https://map-city-server-2019.now.sh
