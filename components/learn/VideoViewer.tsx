import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

export default function VideoViewer({
    videoSource,
}: Readonly<{ videoSource: string }>) {
    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.play();
    });

    return (
        <View style={styles.contentContainer}>
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        position: 'absolute',
        inset: 0,
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
