import { WebPlugin } from "@capacitor/core";
import {CameraPreviewPlugin, StreamVideoOptions} from "./definitions";

export class CameraPreviewWeb extends WebPlugin implements CameraPreviewPlugin {
  constructor() {
    super({
      name: "CameraPreview",
      platforms: ["web"]
    });
  }

  private streamOptions: StreamVideoOptions = {
    audio: false,
    camera: "rear"
  };

  async start(options: { parent: string, className: string, position: "rear"|"front" }): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let video = <HTMLVideoElement>document.getElementById("video");
        const parent = document.getElementById(options.parent);

        if (!video) {
          video = <HTMLVideoElement>document.createElement("video");
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
      } catch (e) {
        reject(e);
      }
    });
  }

  private async streamToVideoElement(options: StreamVideoOptions) {
    return new Promise((resolve: () => void, reject: (arg0: string) => void) => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const userMediaOptions = {
            video: (options.camera === "front") ? {facingMode: "user"} : {facingMode: {exact: "environment"}},
            audio: options.audio || false,
          };
          const video = <HTMLVideoElement>document.getElementById("video");
          navigator.mediaDevices.getUserMedia(userMediaOptions).then((stream) => {
            if (options.camera === "front") {
              video.setAttribute("style", "-webkit-transform: scaleX(-1);transform: scaleX(-1);")
            } else {
              video.setAttribute("style", "");
            }
            video.srcObject = stream;
            video.play();
            resolve();
          }, err => {
            reject(err);
          });
        } else {
          reject("has no access to camera.");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async stop(): Promise<any> {
    const video = <HTMLVideoElement>document.getElementById("video");
    video.pause();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.streamOptions).then((stream: MediaStream) => {
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
  }

  async flip(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.stop();
        this.streamOptions.camera = this.streamOptions.camera === "rear" ? "front" : "rear";
        this.streamToVideoElement(this.streamOptions);
        resolve(this.streamOptions.camera);
      } catch (e) {
        reject(e);
      }
    });

  }

  async capture(): Promise<any> {
    return new Promise((resolve, _) => {
      const video = <HTMLVideoElement>document.getElementById("video");
      const canvas = document.createElement("canvas");

      // video.width = video.offsetWidth;

      const context = canvas.getContext("2d");
      canvas.width        = video.videoWidth;
      canvas.height        = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      resolve({
        value: canvas
          .toDataURL("image/png")
          .replace("data:image/png;base64,", "")
      });
    });
  }
}

const CameraPreview = new CameraPreviewWeb();

export { CameraPreview };

import { registerWebPlugin } from "@capacitor/core";
registerWebPlugin(CameraPreview);
