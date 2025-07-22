import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const VideoViewer = React.forwardRef(
    (
        { videoSource }: Readonly<{ videoSource: string }>,
        ref: React.Ref<any>
    ) => {
        const player = useVideoPlayer(videoSource, (player) => {
            player.loop = true;
            player.play();
        });

        React.useImperativeHandle(ref, () => ({
            pause: () => {
                try {
                    player?.pause();
                } catch (error) {
                    console.log('Error pausing video:', error);
                }
            },
            play: () => {
                try {
                    player?.play();
                } catch (error) {
                    console.log('Error playing video:', error);
                }
            }
        }));

        React.useEffect(() => {
            return () => {
                try {
                    player?.pause();
                } catch (error) {
                    console.log('Error cleaning up video:', error);
                }
            };
        }, [player]);

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
);

VideoViewer.displayName = 'VideoViewer'; // Add this line

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

export default VideoViewer;
