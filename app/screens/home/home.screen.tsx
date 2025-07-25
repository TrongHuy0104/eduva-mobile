import SubjectCard from '@/components/ClassCard';
import BannerCarousel from '@/components/home/BannerCarousel';
import EnrollClassForm from '@/components/home/EnrollClassForm';
import SubjectCardSkeleton from '@/components/skeleton/ClassCardSkeleton';
import { windowHeight } from '@/constants/app.constants';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { useClass } from '@/hooks/useClass';
import { ClassModel } from '@/types/models/class.model';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
    const { user } = useAuth();
    const { openModal } = useModal();

    const {
        data: classes,
        isPending: isLoadingClasses,
        totalCount,
    } = useClass();

    let subjectsRowContent;
    if (isLoadingClasses) {
        subjectsRowContent = Array.from({ length: 6 }).map((_, idx) => (
            <View style={styles.subjectCol} key={idx}>
                <SubjectCardSkeleton />
            </View>
        ));
    } else if (classes.length > 0) {
        subjectsRowContent = classes?.map(
            (classItem: ClassModel, idx: number) => (
                <View style={styles.subjectCol} key={classItem.id ?? idx}>
                    <SubjectCard classItem={classItem} />
                </View>
            )
        );
    } else {
        subjectsRowContent = (
            <View style={styles.emptyContainer}>
                <Image
                    style={{
                        width: 160,
                        height: 160,
                        marginHorizontal: 'auto',
                    }}
                    source={require('../../../assets/images/classroom-lesson-empty.svg')}
                    contentFit="contain"
                    transition={1000}
                />
                <Text style={styles.emptyTitle}>
                    Bạn chưa tham gia lớp học nào!
                </Text>
                <Text style={styles.emptySubtitle}>
                    Khi tham gia lớp, bạn sẽ thấy tất cả bài giảng, tài liệu, và
                    video từ giáo viên tại đây. Hãy nhập mã lớp mà giáo viên đã
                    cung cấp để bắt đầu học nhé!
                </Text>
                <Pressable
                    style={({ pressed }) => [
                        {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: windowHeight(36),
                            backgroundColor: '#007bff',
                            borderRadius: 999,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            marginTop: 16,
                        },
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => openModal(<EnrollClassForm />)}
                >
                    <View
                        style={{
                            gap: 6,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <FontAwesome6
                            name="plus"
                            solid
                            size={18}
                            color="#fff"
                        />
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: 16,
                            }}
                        >
                            Tham gia ngay
                        </Text>
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ paddingBottom: 80 }}
        >
            <BannerCarousel />

            {user && (
                // Subject list
                <View style={{ marginTop: 50, paddingHorizontal: 16 }}>
                    <View style={styles.subjectsHeaderContainer}>
                        <Text style={styles.subjectsHeader}>
                            Lớp học của tôi
                        </Text>
                        {!isLoadingClasses && classes.length > 0 && (
                            <Pressable
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={() =>
                                    router.push('/(tabs)/home/classes')
                                }
                            >
                                <Text
                                    style={{
                                        color: '#2093e7',
                                        fontWeight: '500',
                                        fontSize: 17,
                                        marginRight: 4,
                                    }}
                                >
                                    Xem tất cả ({totalCount})
                                </Text>
                                <View style={{ marginTop: 3 }}>
                                    <FontAwesome6
                                        name="chevron-right"
                                        solid
                                        size={17}
                                        color="#2093e7"
                                    />
                                </View>
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.subjectsRow}>{subjectsRowContent}</View>
                </View>
            )}
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    subjectsHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subjectsHeader: {
        fontSize: 24,
        fontWeight: '900',
        color: '#242424',
    },
    subjectsRow: {
        marginTop: 28,
        flexDirection: 'row',
        columnGap: 12,
        rowGap: 32,
        flexWrap: 'wrap',
    },
    subjectCol: {
        width: '48%',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        padding: 20,
        borderColor: 'rgb(192, 204, 226)',
        borderWidth: 1,
        width: '100%',
        borderRadius: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    emptySubtitle: {
        marginTop: 8,
        fontSize: 16,
        fontStyle: 'italic',
        color: '#64748b',
        lineHeight: 24,
    },
});
