import * as Linking from 'expo-linking';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface DocViewerProps {
    docSource: string;
    onError?: (error: any) => void;
}

const DocViewer: React.FC<DocViewerProps> = ({ docSource, onError }) => {
    const [error, setError] = React.useState<string | null>(null);
    const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        docSource
    )}`;

    const handleError = (syntheticEvent: any) => {
        setError('Failed to load document');
        onError?.(syntheticEvent?.nativeEvent);
    };

    const openInBrowser = () => {
        Linking.openURL(docSource);
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.fallbackButton}
                    onPress={openInBrowser}
                >
                    <Text style={styles.fallbackButtonText}>
                        Open in Browser
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: googleDocsUrl }}
                style={styles.webview}
                onError={handleError}
                startInLoadingState
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#000',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 20,
    },
    fallbackButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    fallbackButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default DocViewer;
