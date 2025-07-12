import { Redirect } from 'expo-router';
import React from 'react';

export default function index() {
    // @ts-ignore
    return <Redirect href={'/(tabs)/home'} />;
}
