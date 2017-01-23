
/**
 * Some static helper functions
 */
export class Util {

    public static supportsWebGL(): boolean {
        let result = true;
        try {
            let canvas = document.createElement("canvas");

            // Get WebGLRenderingContext from canvas element.
            let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

            let result = (gl && gl instanceof WebGLRenderingContext);
        }
        catch (e) {
            result = false;
        }

        //Do an extra check using user agent of device...the scene view loads even if the browser doesn't fully support it webgl, so this is to exclude mobile devices explicity.
        if (result && /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent)) {
            result = false;
        }

        return result;

    }


    public static toggleFullScreen() {
        let element: any = document.documentElement;
        let doc: any = document;
        if ((doc.fullScreenElement !== undefined && doc.fullScreenElement === null) || (doc.msFullscreenElement !== undefined && doc.msFullscreenElement === null) || (doc.mozFullScreen !== undefined && !doc.mozFullScreen) || (doc.webkitIsFullScreen !== undefined && !doc.webkitIsFullScreen)) {
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            if (doc.cancelFullScreen) {
                doc.cancelFullScreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitCancelFullScreen) {
                doc.webkitCancelFullScreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
        }
    }

    public static supportsFullScreen(): boolean {
        let element: any = document.documentElement;
        return element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen || element.msRequestFullscreen;
    }


}