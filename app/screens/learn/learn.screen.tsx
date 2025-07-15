import AudioListener from '@/components/learn/AudioListener';
import DocViewer from '@/components/learn/DocViewer';
import Footer from '@/components/learn/Footer';
import PdfViewer from '@/components/learn/PdfViewer';
import VideoViewer from '@/components/learn/VideoViewer';
import { useLessonMaterialById } from '@/hooks/useLessonMaterial';
import { ContentType } from '@/types/enums/lesson-material.enum';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

interface LearnScreenProps {
    classId: string;
    folderId?: string;
    materialId: string;
}

const LearnScreen = ({ classId, folderId, materialId }: LearnScreenProps) => {
    const { data: material } = useLessonMaterialById(materialId);

    const formatUpdateDate = (input?: string | null): string => {
        if (!input) return 'Bài học chưa từng được cập nhật';

        const date = new Date(input);
        if (isNaN(date.getTime())) return 'Định dạng ngày không hợp lệ';

        return `Cập nhật tháng ${
            date.getUTCMonth() + 1
        } năm ${date.getUTCFullYear()}`;
    };

    const getHeight = () => {
        const screenWidth = Dimensions.get('window').width;

        if (
            material?.contentType === ContentType.PDF ||
            material?.contentType === ContentType.DOCX
        ) {
            return 500;
        }
        if (
            material?.contentType === ContentType.Video ||
            material?.contentType === ContentType.Audio
        ) {
            // 16:9 aspect ratio
            return (screenWidth / 16) * 9;
        }
        if (material?.contentType === ContentType.Audio) {
            return 320;
        }
        // Default height if needed
        return 425;
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={{ backgroundColor: '#000' }}>
                    <View
                        style={[
                            styles.mediaContainer,
                            {
                                height: getHeight(),
                            },
                        ]}
                    >
                        {material?.contentType === ContentType.Video && (
                            <VideoViewer
                                videoSource={material?.sourceUrl ?? ''}
                            />
                        )}
                        {material?.contentType === ContentType.PDF && (
                            <PdfViewer pdfSource={material?.sourceUrl ?? ''} />
                        )}
                        {material?.contentType === ContentType.DOCX && (
                            <DocViewer docSource={material?.sourceUrl ?? ''} />
                        )}
                        {material?.contentType === ContentType.Audio && (
                            <AudioListener uri={material?.sourceUrl ?? ''} />
                        )}
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{material?.title}</Text>
                    <Text style={styles.updateDate}>
                        {formatUpdateDate(
                            material?.lastModifiedAt ?? material?.createdAt
                        )}
                    </Text>
                    <Text style={styles.description}>
                        {material?.description}
                    </Text>
                </View>
            </ScrollView>

            <Footer />
        </View>
    );
};

export default LearnScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191d1e',
    },
    scrollView: {
        flex: 1,
    },
    mediaContainer: {
        position: 'relative',
        backgroundColor: '#000',
        height: 425, // Fixed height to accommodate PDF viewer + margin
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 60, // Add padding to prevent content from being hidden behind the button
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginTop: 20,
        marginBottom: 12,
    },
    updateDate: {
        fontSize: 14,
        color: '#fffc',
        marginVertical: 10,
    },
    description: {
        fontSize: 14,
        color: '#fffc',
        marginVertical: 10,
    },
});
