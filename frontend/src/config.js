const config = {
    serviceUrl: getServiceUrl(),
    serviceEndpoint: "location"
}

function getServiceUrl() {
    switch (process.env.NODE_ENV) {
        case "development":
            return "http://localhost:3002";
        case "production":
            return "https://map-city-server-2019.now.sh";
        default: // "test"
            return "http://localhost:3002"; // TODO: test server
    }
}

export default config;