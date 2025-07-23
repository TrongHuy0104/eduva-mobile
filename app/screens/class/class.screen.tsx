import Folder from '@/components/class/Folder';
import ClassDetailSkeleton from '@/components/skeleton/ClassDetailSkeleton';
import { useStudentClassById } from '@/hooks/useClass';
import { useLastMaterialTracking } from '@/hooks/useLastMaterialTracking';
import { useAllFoldersAndLessonMaterials } from '@/hooks/useLessonMaterial';
import { useToast } from '@/hooks/useToast';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ClassScreen = ({ classId }: { classId: string }) => {
    const toast = useToast();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const {
        data: studentClass,
        error: studentClassError,
        isPending: isLoadingStudentClass,
    } = useStudentClassById(classId);

    const {
        data: foldersAndLessonMaterials,
        error: foldersLessonMaterialsError,
        isPending: isLoadingFoldersLessonMaterials,
    } = useAllFoldersAndLessonMaterials(classId);

    const { getLastLesson } = useLastMaterialTracking();

    if (studentClassError || foldersLessonMaterialsError)
        return toast.errorGeneral();

    const redirect = async () => {
        if (isRedirecting) return; // Prevent multiple redirects

        try {
            setIsRedirecting(true);

            if (studentClass?.countLessonMaterial === 0) {
                toast.info(
                    'Lớp học trống',
                    'Chưa có bài học nào được thêm vào lớp học này!'
                );
            } else {
                const lastLesson = await getLastLesson(classId);

                if (lastLesson) {
                    router.replace(
                        // @ts-ignore
                        `/learn/${lastLesson.material}?classId=${classId}&folderId=${lastLesson.folder}`
                    );
                } else {
                    if (!foldersAndLessonMaterials) return;

                    const folderHasLesson = foldersAndLessonMaterials.find(
                        (folder) => folder.countLessonMaterials > 0
                    );

                    if (!folderHasLesson) return;

                    router.replace(
                        // @ts-ignore
                        `/learn/${folderHasLesson[0].id}?classId=${classId}&folderId=${folderHasLesson.id}`
                    );
                }
            }
        } finally {
            // Reset after a short delay to prevent rapid re-taps
            setTimeout(() => {
                setIsRedirecting(false);
            }, 1000);
        }
    };

    const getTotalDurationFormatted = (): string => {
        let totalDuration = 0;

        if (!foldersAndLessonMaterials) return '0 phút';

        foldersAndLessonMaterials.forEach((group) => {
            group.lessonMaterials.forEach((material) => {
                totalDuration += material.duration || 0;
            });
        });

        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);

        if (hours >= 1) {
            const paddedHours = String(hours).padStart(2, '0');
            const paddedMinutes = String(minutes).padStart(2, '0');
            return `${paddedHours} giờ ${paddedMinutes} phút`;
        } else if (minutes > 0) {
            return `${minutes} phút`;
        } else {
            return `0 phút`;
        }
    };

    return (
        <View style={styles.container}>
            {isLoadingStudentClass || isLoadingFoldersLessonMaterials ? (
                <ClassDetailSkeleton />
            ) : (
                <>
                    <ScrollView style={{ flex: 1, marginBottom: 12 }}>
                        <Image
                            style={styles.thumbnail}
                            source={studentClass?.backgroundImageUrl}
                            contentFit="cover"
                            transition={1000}
                        />
                        <Text style={styles.classTitle}>
                            {studentClass?.name}
                        </Text>
                        <Text style={styles.subtitle}>Danh sách bài học</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>
                                <Text style={{ fontWeight: '600' }}>
                                    {studentClass?.countLessonMaterial}
                                </Text>{' '}
                                bài học
                            </Text>
                            <View
                                style={{
                                    marginHorizontal: 8,
                                    width: 5,
                                    height: 5,
                                    borderRadius: 999,
                                    backgroundColor: '#000',
                                }}
                            ></View>
                            <Text style={{ fontSize: 16 }}>
                                <Text>Thời lượng </Text>
                                <Text style={{ fontWeight: '600' }}>
                                    {getTotalDurationFormatted()}
                                </Text>{' '}
                            </Text>
                        </View>

                        {foldersAndLessonMaterials?.map((folder, index) => (
                            <Folder
                                key={folder.id}
                                folder={folder}
                                classId={classId}
                                index={index}
                            />
                        ))}
                    </ScrollView>
                    <Pressable
                        style={({ pressed }) => [
                            {
                                width: '100%',
                                position: 'fixed',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#0093fc',
                                borderRadius: 999,
                                height: 40,
                                paddingHorizontal: 10,
                                marginBottom: 12,
                            },
                            {
                                opacity:
                                    pressed && !isRedirecting
                                        ? 0.7
                                        : isRedirecting
                                        ? 0.5
                                        : 1,
                            },
                        ]}
                        onPress={redirect}
                        disabled={isRedirecting}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: 16,
                            }}
                        >
                            Tham gia ngay
                        </Text>
                    </Pressable>
                </>
            )}
        </View>
    );
};

export default ClassScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    classTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#242424',
        marginBottom: 16,
        marginTop: 16,
    },
    thumbnail: {
        width: '100%',
        height: 160,
        borderRadius: 16,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3A3a3a',
        marginBottom: 10,
    },
});
