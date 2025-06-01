import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const UserInformation = () => {
    const [expanded, setExpanded] = useState(false);
    const handlePress = (value: string) => {
        Linking.openURL(value);
    };
    const bio =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum asperiores cum molestiae qui voluptas voluptates atque veniam explicabo tempore, quam placeat facere doloribus beatae ad, maiores magnam debitis. Velit, amet!';

    const getShortBio = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source="https://files.fullstack.edu.vn/f8-prod/public-images/6833d787bbd19.png"
                contentFit="cover"
            />

            <Text style={styles.heading}>Trọng Huy</Text>
            <Text style={styles.username}>@huytrong</Text>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <FontAwesome6 name="phone" solid size={14} color="#666" />
                    <Pressable onPress={() => handlePress('tel:+0123999945')}>
                        <Text numberOfLines={1} style={styles.linkText}>
                            0123999945
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
                        onPress={() =>
                            handlePress('mailto:tronghuy0104@gmail.com')
                        }
                    >
                        <Text style={styles.linkText} numberOfLines={1}>
                            tronghuy0104@gmail.com
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.infoItem}>
                    <FontAwesome6
                        name="facebook"
                        solid
                        size={14}
                        color="#666"
                    />
                    <Pressable onPress={() => {}}>
                        <Text style={styles.linkText} numberOfLines={1}>
                            https://facebook.com/example
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.infoItem,
                        {
                            alignItems: 'flex-start',
                        },
                    ]}
                >
                    <FontAwesome6
                        name="user-pen"
                        solid
                        size={14}
                        color="#666"
                    />
                    <View>
                        <Text
                            style={styles.bio}
                            onPress={() => setExpanded((prev) => !prev)}
                        >
                            {expanded ? bio : getShortBio(bio, 20)}
                        </Text>
                        {bio.split(' ').length > 20 && (
                            <Text
                                style={{ color: '#0056d6', marginTop: 2 }}
                                onPress={() => setExpanded((prev) => !prev)}
                            >
                                {expanded ? 'Thu gọn' : 'Xem thêm'}
                            </Text>
                        )}
                    </View>
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
    username: {
        marginTop: 2,
        fontSize: 18,
        opacity: 0.7,
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
    bio: {
        textAlign: 'justify',
    },
});
