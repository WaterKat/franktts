module.exports = (function (apiClient) {
    const CustomMath = (function (min, max, value) {
        function lerp(a, b, alpha) {
            return a + alpha * (b - a);
        }
        function clamp(min, max, val) {
            return Math.min(Math.max(val, min), max);
        }
        function randomUnit() {
            return (Math.random() * 2) - 1;
        }
        return {
            lerp: lerp,
            clamp: clamp,
            randomUnit: randomUnit,
        }
    })();


    const currentTrackingDefaults = (function () {
        const output = { default: {}, custom: {} };
        const vtubeParamList = apiClient.inputParameterList();
        vtubeParamList.defaultParameters.forEach((item) => {
            output.default[item.name] = {
                min: item.min,
                max: item.max,
                value: item.defaultValue,
            }
        });
        vtubeParamList.customParameters.forEach((item) => {
            output.custom[item.name] = {
                min: item.min,
                max: item.max,
                value: item.defaultValue,
            }
        });
        return output;
    })();


    let requestedChanges = {}
    const debugWeight = 1;


    const requestSend = function () {
        const paramsToSend = [];

        for (let changeKey in requestedChanges) {
            paramsToSend.push({
                id: changeKey,
                value: requestedChanges[changeKey],
                weight: debugWeight,
            })
        }

        apiClient.injectParameterData({
            parameterValues: paramsToSend,
        }).then(() => {
            paramsToSend = [];
        }).catch(() => {
            console.error('Failed to send')
        });
    };


    const setChangeAbsolute = function (key, value) {
        if (typeof currentTrackingDefaults.default[key] !== 'undefined') {
            const paramVal = currentTrackingDefaults.default[key];
            requestedChanges[key] = CustomMath.clamp(paramVal['min'], paramVal['max'], value);
            return;
        }
        if (typeof currentTrackingDefaults.custom[key] !== 'undefined') {
            const paramVal = currentTrackingDefaults.custom[key];
            requestedChanges[key] = CustomMath.clamp(paramVal['min'], paramVal['max'], value);
            return;
        }
        console.error('Parameter not found in VTubeStudio tracking data.');
        return;
    };

    const setChangeRelative = function (key, value) {
        if (typeof currentTrackingDefaults.default[key] !== 'undefined') {
            const paramVal = currentTrackingDefaults.default[key];
            const lerpedValue = CustomMath.lerp(paramVal['min'], paramVal['max'], CustomMath.clamp(0, 1, value));
            requestedChanges[key] = lerpedValue;
            return;
        }
        if (typeof currentTrackingDefaults.custom[key] !== 'undefined') {
            const paramVal = currentTrackingDefaults.custom[key];
            const lerpedValue = CustomMath.lerp(paramVal['min'], paramVal['max'], CustomMath.clamp(0, 1, value));
            requestedChanges[key] = lerpedValue;
            return;
        }
        console.error('Parameter not found in VTubeStudio tracking data.');
        return;
    }

    return {
        requestSend: requestSend,
        setChangeAbsolute: setChangeAbsolute,
        setChangeRelative: setChangeRelative,
    };
})();
