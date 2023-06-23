const Subscription = require('../subscription-methods/subscription.js');

class BrianTTS {
    time_between_messages = 0.5;
    audio_context = new AudioContext();
    audio_amplitude_tick = 24;

    constructor() {
        this.queue = [];

        this.isSuspended = false;
        this.isPlaying = false;
        this.isPaused = false;

        this.analyzer_node = this.audio_context.createAnalyser();
        this.analyzer_node.connect(this.audio_context.destination);

        this.audio_buffer_source_node = undefined;
        this.latest_max_amplitude = 0;

        this.onAmplitudeUpdate = new Subscription();
        this.onStopRequested = new Subscription();
    }

    textToURL(_text) {
        return `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(_text.trim())}`;
    }

    requestStop(_requestedPops) {

        let successfulPops = 0;

        if (this.isPlaying && _requestedPops > 0) {
            successfulPops += 1;
            this.onStopRequested.invoke();
        }

        while (this.queue.length > 0 && successfulPops < _requestedPops) {
            successfulPops += 1;
            this.queue.shift();
        }

        return successfulPops;
    }

    async playFromURL(_url) {
        try {
            // Load audio file from a URL
            const response = await fetch(_url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audio_context.decodeAudioData(arrayBuffer);

            // Create a buffer source node
            this.audio_buffer_source_node = this.audio_context.createBufferSource();
            this.audio_buffer_source_node.buffer = audioBuffer;
            this.audio_buffer_source_node.connect(this.analyzer_node);

            // Start playing the audio
            this.audio_buffer_source_node.start();

            while (this.audio_context.state === 'suspended') {
                this.isSuspended = true;
                this.audio_context.resume();

                if (this.audio_context.state === 'suspended') {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('Page not interacted yet');
                } else {
                    this.isSuspended = false;
                }
            }

            //Update amplitude values
            const amplitudeInterval = setInterval(() => {
                this.onAmplitudeUpdate.invoke(this.getNormalizedCurrentAmplitude());
            }, 1000 / this.audio_amplitude_tick);

            //wait until stopped or until audio ends
            const audioStopPromise = new Promise((resolve) => {
                const stop = () => {
                    this.audio_buffer_source_node.stop();
                }

                this.onStopRequested.subscribe(stop);

                const onStopCleanup = () => {
                    this.onStopRequested.unsubscribe(stop)
                    resolve();
                }

                this.audio_buffer_source_node.addEventListener('ended', () => {
                    onStopCleanup();
                });
                this.onStopRequested.subscribe(() => {
                    onStopCleanup();
                })
            });

            //wait for end of audio
            await audioStopPromise;

            //finish up 
            clearInterval(amplitudeInterval);

            this.latest_max_amplitude = 0;
            this.onAmplitudeUpdate.invoke(this.latest_max_amplitude);

        } catch (error) {
            console.error(error);
        }
    }

    getCurrentAmplitude() {
        var byteData = new Uint8Array(this.analyzer_node.fftSize / 2);
        this.analyzer_node.getByteTimeDomainData(byteData);
        return (Math.max.apply(null, byteData.slice()) - 128) / 128;
    }

    getNormalizedCurrentAmplitude() {
        const absAmplitude = this.getCurrentAmplitude();
        const topAmplitude = this.latest_max_amplitude;
        if (absAmplitude > topAmplitude)
            this.latest_max_amplitude = absAmplitude;
        return absAmplitude / topAmplitude;
    }

    async playQueue() {
        this.isPlaying = true;

        while (this.queue.length > 0) {
            await this.queue[0]();
            this.queue.shift();
            await new Promise((resolve) => setTimeout(resolve, 1000 * this.time_between_messages));
        }

        this.isPlaying = false;
    }

    enqueueRequest(_text) {
        if (_text.trim() == '')
            return;

        this.queue.push(async () => {
            await this.playFromURL(this.textToURL(_text));
        })
        if (!this.isPlaying)
            this.playQueue();
    }

    addAmplitudeSubscriptor(_function) {
        this.onAmplitudeUpdate.subscribe(_function);
    }
    removeAmplitudeSubscriptor(_function) {
        this.onAmplitudeUpdate.unsubscribe(_function);
    }

}

module.exports = BrianTTS;
