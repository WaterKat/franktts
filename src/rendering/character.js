const imageSources = require('../config.js').imageSources;

class Character {
    width = 256;
    height = 256;
    size_multiplier = 1;
    frames_per_second = 24;

    constructor(_canvas) {
        this.canvas = _canvas;
        this.ctx = this.canvas.getContext('2d');

        this.active_image = 0;
        this.animation_loop = undefined;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.images = [];
        this.image_count = imageSources.length;

        for (let i = 0; i < this.image_count; i++) {
            const newImage = new Image();
            newImage.onload = () => { this.animate() };
            newImage.src = imageSources[i];

            this.images.push(newImage);
        }

        this.update_amplitude(0);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.images[this.active_image], 0, 0);

        if (this.active_image == 0) {
            this.animation_loop = undefined;
            return;
        }

        setTimeout(() => {
            this.animation_loop = requestAnimationFrame(() => { this.animate() });
        }, 1000 / this.frames_per_second);
    }

    update_amplitude(_amplitude) {
        if (isNaN(_amplitude)) 
            _amplitude = 0;

        this.active_image = Math.floor(this.image_count * _amplitude);
        this.active_image = Math.min(this.image_count - 1, this.active_image);
        this.active_image = Math.max(0, this.active_image);

        if (typeof this.animation_loop == "undefined") {
            requestAnimationFrame(() => { this.animate() });
        }
    }


}

module.exports = Character
