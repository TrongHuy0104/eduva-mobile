import ClassScreen from '@/app/screens/class/class.screen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const Class = () => {
    const { id } = useLocalSearchParams();

    return <ClassScreen classId={id as string} />;
};

export default Class;
