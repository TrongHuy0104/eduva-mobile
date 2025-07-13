import Folder from '@/components/class/Folder';
import ClassDetailSkeleton from '@/components/skeleton/ClassDetailSkeleton';
import { useStudentClassById } from '@/hooks/useClass';
import { useFolders } from '@/hooks/useFolder';
import { useLastMaterialTracking } from '@/hooks/useLastMaterialTracking';
import { useLessonMaterials } from '@/hooks/useLessonMaterial';
import { useToast } from '@/hooks/useToast';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ClassScreen = ({ classId }: { classId: string }) => {
    const toast = useToast();
    const {
        data: studentClass,
        error: studentClassError,
        isPending: isLoadingStudentClass,
    } = useStudentClassById(classId);

    const {
        data: folders,
        error: foldersError,
        isPending: isLoadingFolders,
    } = useFolders(classId);

    const [isEnabledLoadMaterial, setIsEnabledLoadMaterial] = useState(false);

    const { data: lessonMaterials, error: lessonMaterialsError } =
        useLessonMaterials(
            folders[0]?.id,
            {
                classId,
                folderId: folders[0]?.id,
                sortBy: 'lastmodifiedat',
                sortDirection: 'asc',
            },
            isEnabledLoadMaterial
        );

    const { setLastLesson, getLastLesson, clearAll } =
        useLastMaterialTracking();

    // Track lesson materials when they are successfully loaded
    useEffect(() => {
        if (
            lessonMaterials &&
            lessonMaterials.length > 0 &&
            isEnabledLoadMaterial
        ) {
            console.log(lessonMaterials);

            const folderHasLesson = folders?.find(
                (folder) => folder.countLessonMaterial > 0
            );

            if (folderHasLesson) {
                // Set the first lesson as the last accessed lesson
                setLastLesson(
                    classId,
                    folderHasLesson?.id,
                    lessonMaterials?.[0]?.id
                );
            }
        }
    }, [
        lessonMaterials,
        isEnabledLoadMaterial,
        folders,
        classId,
        setLastLesson,
    ]);

    if (studentClassError || foldersError || lessonMaterialsError) {
        toast.errorGeneral();
    }

    const redirect = async () => {
        if (studentClass?.countLessonMaterial === 0) {
            toast.info(
                'Lớp học trống',
                'Chưa có bài học nào được thêm vào lớp học này!'
            );
        } else {
            const lastLesson = await getLastLesson(classId);

            if (lastLesson) {
                clearAll();

                //     router.push({
                //         pathname: `/learn/${lastLesson.material}`,
                //         query: {
                //           classId,
                //           folderId: lastLesson.folder,
                //         },
                //       });
            } else {
                const folderHasLesson = folders.find(
                    (folder) => folder.countLessonMaterial > 0
                );

                if (!folderHasLesson) return;

                setIsEnabledLoadMaterial(true);

                console.log(lessonMaterials);

                // router.push(
                //     `/learn/${lessonMaterials[0].id}?classId=${classId}&folderId=${folderHasLesson.id}`
                // );
            }
        }
    };

    return (
        <View style={styles.container}>
            {isLoadingStudentClass || isLoadingFolders ? (
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
                                    01 giờ 34 phút
                                </Text>{' '}
                            </Text>
                        </View>

                        {folders?.map((folder, index) => (
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
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={redirect}
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
