import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { StyleSheet, View, AppState, AppStateStatus } from 'react-native';
import { useAuth } from '@/contexts/auth.context';

const VideoViewer = React.forwardRef(
    (
        { videoSource }: Readonly<{ videoSource: string }>,
        ref: React.Ref<any>
    ) => {
        const { isSignout } = useAuth();
        // allowAutoPlayRef controls whether the player should auto-play when initialized.
        // It is set to false when a global logout happens so media does not resume automatically.
        const allowAutoPlayRef = React.useRef<boolean>(true);
        const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);

        const player = useVideoPlayer(videoSource, (player) => {
            player.loop = true;
            // Only autoplay if we are allowed and user is signed in
            if (allowAutoPlayRef.current && !isSignout) {
                player.play();
            }
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
                    // User explicitly playing should re-enable autoplay for this session
                    allowAutoPlayRef.current = true;
                    player?.play();
                } catch (error) {
                    console.log('Error playing video:', error);
                }
            }
        }));

        // When signout happens, pause the player and prevent future autoplay until user explicitly plays.
        React.useEffect(() => {
            if (isSignout) {
                allowAutoPlayRef.current = false;
                try {
                    player?.pause();
                } catch (error) {
                    console.log('Error pausing video on signout:', error);
                }
            }
        }, [isSignout, player]);

        // Pause video when app goes to background/inactive to prevent background playback
        React.useEffect(() => {
            const handleAppStateChange = (nextState: AppStateStatus) => {
                if (nextState !== 'active') {
                    try {
                        player?.pause();
                    } catch (e) {
                        console.log('Error pausing video on app state change:', e);
                    }
                }
                appStateRef.current = nextState;
            };

            const subscription = AppState.addEventListener('change', handleAppStateChange);
            return () => subscription.remove();
        }, [player]);

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
