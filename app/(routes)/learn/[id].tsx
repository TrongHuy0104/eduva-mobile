import LearnScreen from '@/app/screens/learn/learn.screen';
import Header from '@/components/Header';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Class = () => {
    const { id } = useLocalSearchParams();
    const { classId, folderId } = useGlobalSearchParams();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Header />
            <LearnScreen
                materialId={id as string}
                classId={classId as string}
                folderId={folderId as string}
            />
        </SafeAreaView>
    );
};

export default Class;
