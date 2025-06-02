import React from 'react';
import { Platform } from 'react-native';
import Video from 'react-native-video';

//arquivo criado para quando app usado em web, para formatar e passar vídeos sem ref (com fallback)

const ForwardedVideo = (props) => {
  if (Platform.OS === 'web') {
    return (
      <video
        src={props.source?.uri}
        controls
        style={props.style}
      />
    );
  }
  return <Video {...props} />;
};

export default ForwardedVideo;
