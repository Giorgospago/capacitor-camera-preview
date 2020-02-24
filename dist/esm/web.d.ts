import { WebPlugin } from "@capacitor/core";
import { CameraPreviewPlugin } from "./definitions";
export declare class CameraPreviewWeb extends WebPlugin implements CameraPreviewPlugin {
    constructor();
    private streamOptions;
    start(options: {
        parent: string;
        className: string;
        position: "rear" | "front";
    }): Promise<any>;
    private streamToVideoElement;
    stop(): Promise<any>;
    flip(): Promise<any>;
    capture(): Promise<any>;
}
declare const CameraPreview: CameraPreviewWeb;
export { CameraPreview };
