import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default class VideoPlayer extends React.Component {
  constructor(props: any) {
    super(props);

    this.player = null;
  }

  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log("onPlayerReady", this);
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player style={{ width: 600, height: 450 }}>
        <video ref={(node) => (this.videoNode = node)} className="video-js" />
      </div>
    );
  }
}
