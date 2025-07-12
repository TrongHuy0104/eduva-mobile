import ClassCard from '@/components/ClassCard';
import ClassCardSkeleton from '@/components/skeleton/ClassCardSkeleton';
import { PAGE_SIZE } from '@/constants/app.constants';
import { useInfiniteClass } from '@/hooks/useClass';
import { useToast } from '@/hooks/useToast';
import { ClassModel } from '@/types/models/class.model';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const ClassesScreen = () => {
    const toast = useToast();

    const {
        data: classes,
        isPending: isLoadingClasses,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteClass({
        pageSize: PAGE_SIZE,
    });

    if (error) {
        toast.errorGeneral();
    }

    const renderClassItem = ({
        item,
        index,
    }: {
        item: ClassModel;
        index: number;
    }) => (
        <View style={styles.classItem}>
            <ClassCard classItem={item} />
        </View>
    );

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#2093e7" />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderSkeleton = () => (
        <View style={styles.classesRow}>
            {Array.from({ length: 6 }).map((_, idx) => (
                <View style={styles.classItem} key={idx}>
                    <ClassCardSkeleton />
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.classesHeader}>Lớp học của tôi</Text>

            {isLoadingClasses ? (
                renderSkeleton()
            ) : (
                <FlatList
                    data={classes}
                    renderItem={renderClassItem}
                    keyExtractor={(item, index) =>
                        item.id?.toString() || index.toString()
                    }
                    numColumns={2}
                    columnWrapperStyle={styles.classesRow}
                    contentContainerStyle={styles.listContainer}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default ClassesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    classesHeader: {
        fontSize: 24,
        fontWeight: '900',
        color: '#242424',
        marginBottom: 28,
    },
    classesRow: {
        flexDirection: 'row',
        columnGap: 12,
        rowGap: 32,
        flexWrap: 'wrap',
    },
    classItem: {
        width: '48%',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        paddingBottom: 80,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
