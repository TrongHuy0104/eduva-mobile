import { useAuth } from '@/contexts/auth.context';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const UserInformation = () => {
    const { user } = useAuth();

    const handlePress = (value: string) => {
        Linking.openURL(value);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffd900', '#b45264']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.avatarWrapper}
            >
                <Image
                    style={styles.image}
                    source={user?.avatarUrl}
                    contentFit="cover"
                />
            </LinearGradient>

            <Text style={styles.heading}>{user?.fullName}</Text>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <FontAwesome6 name="phone" solid size={14} color="#666" />
                    <Pressable
                        onPress={() => {
                            if (user?.phoneNumber) {
                                handlePress(`tel:+${user.phoneNumber}`);
                            }
                        }}
                    >
                        <Text numberOfLines={1} style={styles.linkText}>
                            {user?.phoneNumber ?? 'Chưa cập nhật'}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.infoItem}>
                    <FontAwesome6
                        name="envelope"
                        solid
                        size={14}
                        color="#666"
                    />
                    <Pressable
                        onPress={() => handlePress(`mailto:${user?.email}`)}
                    >
                        <Text style={styles.linkText} numberOfLines={1}>
                            {user?.email}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.infoItem}>
                    <FontAwesome6 name="school" solid size={14} color="#666" />
                    <Text numberOfLines={1}>Trường: {user?.school?.name}</Text>
                </View>
            </View>
        </View>
    );
};

export default UserInformation;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        borderRadius: 9999,
    },
    image: {
        width: 216,
        height: 216,
        borderRadius: 9999,
    },
    heading: {
        flexWrap: 'wrap',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
    },
    infoContainer: {
        gap: 12,
        marginTop: 20,
        marginLeft: -15,

        width: '68%',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
    },
    linkText: {
        color: '#0056d6',
    },
});
