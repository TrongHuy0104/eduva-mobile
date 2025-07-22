import { Feather, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AudioListenerProps {
    uri: string;
}

export interface AudioListenerRef {
    pause: () => Promise<void>;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4];

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioListener = (
    { uri }: AudioListenerProps,
    ref: React.Ref<AudioListenerRef>
) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

    useImperativeHandle(ref, () => ({
        pause: async () => {
            if (sound && isPlaying) {
                await sound.pauseAsync();
            }
        },
    }));
    const [position, setPosition] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const isSeeking = useRef(false);
    // Seek Bar logic state
    const [isUserSeeking, setIsUserSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState<number | null>(null);
    const [controlsLayout, setControlsLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const debounceVolumeRef = useRef<number | null>(null);

    useEffect(() => {
        loadAudio();
        return () => {
            unloadAudio();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uri]);

    const loadAudio = async () => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false, volume, rate: playbackRate },
            onPlaybackStatusUpdate
        );
        setSound(newSound);
    };

    const unloadAudio = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded) return;
        if (!isSeeking.current) {
            setPosition(status.positionMillis / 1000);
        }
        setDuration(status.durationMillis / 1000);
        setIsPlaying(status.isPlaying);
    };

    const handlePlayPause = async () => {
        if (!sound) return;
        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
    };

    const handleSeekStart = () => {
        setIsUserSeeking(true);
        setSeekValue(position);
    };

    const handleSeekChange = (value: number) => {
        setSeekValue(value);
    };

    const handleSeekComplete = async (value: number) => {
        setIsUserSeeking(false);
        setSeekValue(null);
        if (sound) {
            isSeeking.current = true;
            await sound.setPositionAsync(value * 1000);
            setPosition(value);
            isSeeking.current = false;
        }
    };

    const handleSpeedChange = async (rate: number) => {
        setPlaybackRate(rate);
        setShowSpeedMenu(false);
        if (sound) {
            await sound.setRateAsync(rate, true);
        }
    };

    const handleCycleVolume = () => {
        let newVolume = 0;
        if (volume === 0) {
            newVolume = 0.5;
        } else if (volume > 0 && volume < 1) {
            newVolume = 1;
        } else {
            newVolume = 0;
        }
        setVolume(newVolume);
        if (debounceVolumeRef.current) {
            clearTimeout(debounceVolumeRef.current);
        }
        debounceVolumeRef.current = setTimeout(async () => {
            if (sound) {
                await sound.setVolumeAsync(newVolume);
            }
        }, 250) as unknown as number;
    };

    const getVolumeIcon = () => {
        if (volume === 0) return 'volume-x';
        if (volume > 0 && volume < 1) return 'volume-1';
        return 'volume-2';
    };

    useEffect(() => {
        return () => {
            if (debounceVolumeRef.current) {
                clearTimeout(debounceVolumeRef.current);
            }
            if (sound && isPlaying) {
                sound.pauseAsync();
            }
        };
    }, [sound, isPlaying]);

    return (
        <View style={styles.wrapper}>
            <View
                style={styles.container}
                onLayout={(e) => setControlsLayout(e.nativeEvent.layout)}
            >
                {/* Play/Pause Button */}
                <TouchableOpacity
                    onPress={handlePlayPause}
                    style={styles.iconButton}
                >
                    <MaterialIcons
                        name={isPlaying ? 'pause' : 'play-arrow'}
                        size={32}
                        color="#374151"
                    />
                </TouchableOpacity>
                <Text style={styles.time}>
                    {formatTime(
                        isUserSeeking && seekValue !== null
                            ? seekValue
                            : position
                    )}
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={
                        isUserSeeking && seekValue !== null
                            ? seekValue
                            : position
                    }
                    onSlidingStart={handleSeekStart}
                    onValueChange={handleSeekChange}
                    onSlidingComplete={handleSeekComplete}
                    minimumTrackTintColor="#3b82f6"
                    maximumTrackTintColor="#374151"
                    thumbTintColor="#3b82f6"
                />
                <Text style={styles.time}>
                    -
                    {formatTime(
                        Math.max(
                            duration -
                                (isUserSeeking && seekValue !== null
                                    ? seekValue
                                    : position),
                            0
                        )
                    )}
                </Text>
                {/* Volume Button (cycle through levels) */}
                <TouchableOpacity
                    onPress={handleCycleVolume}
                    style={[styles.iconButton, { marginLeft: 10 }]}
                >
                    <Feather name={getVolumeIcon()} size={22} color="#374151" />
                </TouchableOpacity>
                {/* Settings (Playback Speed) */}
                <TouchableOpacity
                    onPress={() => setShowSpeedMenu(true)}
                    style={[styles.iconButton]}
                >
                    <Feather name="settings" size={22} color="#374151" />
                </TouchableOpacity>
            </View>

            {/* Volume Dialog using Modal, positioned below volume button */}

            {/* Speed Popover */}
            {showSpeedMenu && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 100,
                    }}
                    pointerEvents="auto"
                >
                    {/* Overlay */}
                    <TouchableOpacity
                        style={[styles.popoverOverlay, { zIndex: 101 }]}
                        activeOpacity={1}
                        onPress={() => setShowSpeedMenu(false)}
                    />
                    {/* Modal */}
                    <View
                        style={[
                            styles.speedPopover,
                            {
                                top:
                                    controlsLayout.y +
                                    controlsLayout.height +
                                    8,
                                right: 16,
                                zIndex: 102,
                            },
                        ]}
                        pointerEvents="auto"
                    >
                        {PLAYBACK_SPEEDS.map((speed) => (
                            <TouchableOpacity
                                key={speed}
                                style={styles.speedOption}
                                onPress={() => handleSpeedChange(speed)}
                            >
                                <Text
                                    style={
                                        speed === playbackRate
                                            ? styles.speedSelected
                                            : styles.speedText
                                    }
                                >
                                    {speed === 1 ? 'Bình thường' : `${speed}x`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Volume Level Popover (like Speed Popover) */}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#f0f9ff',
        borderRadius: 12,
        paddingHorizontal: 4,
        paddingVertical: 12,
        marginVertical: 'auto',
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconButton: {
        padding: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    slider: {
        flex: 1,
        marginHorizontal: 8,
        height: 32,
    },
    time: {
        color: '#374151',
        fontSize: 15,
        textAlign: 'center',
    },
    speedOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    speedText: {
        color: '#374151',
        fontSize: 16,
    },
    speedSelected: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 16,
    },
    popoverOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        // transparent background to catch outside touches
    },
    speedPopover: {
        position: 'absolute',
        // top will be set dynamically
        // right will be set dynamically
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        elevation: 4,
        minWidth: 120,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
});

export default forwardRef<AudioListenerRef, AudioListenerProps>(AudioListener);
