// ES Modules
import { ApiClient } from "vtubestudio";
//import { WebSocket } from "ws";
import { icon } from "./icon.js";
//import fs from 'fs';

let auth = '';

function lerp(a, b, alpha) {
    return a + alpha * (b - a);
}
function clamp(min, max, val) {
    return Math.min(Math.max(val, min), max);
}
function randomNormal() {
    return (Math.random() * 2) - 1;
}

function setAuthToken(authenticationToken) {
    // store the authentication token somewhere
    /*
        fs.writeFileSync("./auth-token.txt", authenticationToken, {
            encoding: "utf-8",
        });
    */
    auth = authenticationToken;
}

function getAuthToken() {
    // retrieve the stored authentication token
    /*    return fs.readFileSync("./auth-token.txt", "utf-8");
    */
    return auth;
}

const options = {
    authTokenGetter: getAuthToken,
    authTokenSetter: setAuthToken,
    pluginName: "FrankTTS",
    pluginDeveloper: "AonyxLimited",
    pluginIcon: icon,
    webSocketFactory: (url) => new WebSocket(url),
    // Optionally set the URL or port to connect to VTube Studio at; defaults are as below:

    //port: 25565,
    //url: `ws://localhost:${port}`,
    url: `ws://10.0.0.10:8001`,
};

const apiClient = new ApiClient(options);


apiClient.on("connect", async () => {
    VTuber.ready = true;
});


export class VTuber {
    static ready = false;
    constructor() {
        this.mouth = 0;
        this.weight = 0.5

    }

    update_amplitude(_amplitude) {
        if (!VTuber.ready)
            return;

        this.mouth = _amplitude;

        apiClient.injectParameterData(
            {
                parameterValues: [
                    {
                        id: 'MouthOpen',
                        value: this.mouth,
                        weight: this.weight,
                    },
                ]
            },
        );

    }
}

//module.exports = VTuber
