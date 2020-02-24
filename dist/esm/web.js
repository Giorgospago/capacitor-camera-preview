var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from "@capacitor/core";
export class CameraPreviewWeb extends WebPlugin {
    constructor() {
        super({
            name: "CameraPreview",
            platforms: ["web"]
        });
        this.streamOptions = {
            audio: false,
            camera: "rear"
        };
    }
    start(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    let video = document.getElementById("video");
                    const parent = document.getElementById(options.parent);
                    if (!video) {
                        video = document.createElement("video");
                        video.id = "video";
                        video.setAttribute("class", options.className || "");
                        parent.appendChild(video);
                    }
                    this.streamOptions = {
                        audio: false,
                        camera: (options.position || "rear")
                    };
                    this.streamToVideoElement(this.streamOptions);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    streamToVideoElement(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        const userMediaOptions = {
                            video: (options.camera === "front") ? { facingMode: "user" } : { facingMode: { exact: "environment" } },
                            audio: options.audio || false,
                        };
                        const video = document.getElementById("video");
                        navigator.mediaDevices.getUserMedia(userMediaOptions).then((stream) => {
                            if (options.camera === "front") {
                                video.setAttribute("style", "-webkit-transform: scaleX(-1);transform: scaleX(-1);");
                            }
                            else {
                                video.setAttribute("style", "");
                            }
                            video.srcObject = stream;
                            video.play();
                            resolve();
                        }, err => {
                            reject(err);
                        });
                    }
                    else {
                        reject("has no access to camera.");
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const video = document.getElementById("video");
            video.pause();
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(this.streamOptions).then((stream) => {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => {
                        track.stop();
                        stream.removeTrack(track);
                    });
                    video.src = "";
                    video.pause();
                    video.parentNode.removeChild(video);
                });
            }
        });
    }
    flip() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.stop();
                    this.streamOptions.camera = this.streamOptions.camera === "rear" ? "front" : "rear";
                    this.streamToVideoElement(this.streamOptions);
                    resolve(this.streamOptions.camera);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    capture() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _) => {
                const video = document.getElementById("video");
                const canvas = document.createElement("canvas");
                // video.width = video.offsetWidth;
                const context = canvas.getContext("2d");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                resolve({
                    value: canvas
                        .toDataURL("image/png")
                        .replace("data:image/png;base64,", "")
                });
            });
        });
    }
}
const CameraPreview = new CameraPreviewWeb();
export { CameraPreview };
import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(CameraPreview);
//# sourceMappingURL=web.js.map