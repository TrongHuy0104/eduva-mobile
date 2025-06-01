import Activity from '@/components/profile/Activity';
import UserInformation from '@/components/profile/UserInformation';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const ProfileScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={{ marginTop: 30 }}>
                <UserInformation />
                <Activity />
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingTop: 8,
    },
});
