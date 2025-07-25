import { useLessonQuestions, useMyQuestions } from "@/hooks/useQuestion";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import GradientButton from "../GradientButton";
import CreateQuestionModal from "./CreateQuestionModal";
import QuestionItem from "./QuestionItem";


interface CommentListProps {
    materialTitle: string;
    materialId: string;
}

const QUESTIONS_PER_PAGE = 8;

const CommentList = ({ materialTitle, materialId }: CommentListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [myCurrentPage, setMyCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Lesson questions
    const { data: lessonQuestions, isPending: lessonQuestionsPending, totalCount: lessonQuestionsTotalCount } = useLessonQuestions(materialId, {
        pageIndex: currentPage,
        pageSize: QUESTIONS_PER_PAGE,
        sortBy: 'createdAt',
        sortDirection: 'desc',
    });

    // My questions
    const { data: myQuestions, isPending: myQuestionsPending, totalCount: myQuestionsTotalCount } = useMyQuestions({
        pageIndex: myCurrentPage,
        pageSize: QUESTIONS_PER_PAGE,
        sortBy: 'createdAt',
        sortDirection: 'desc',
    });

    // Pagination for lesson questions
    const totalPages = useMemo(() => Math.ceil((lessonQuestionsTotalCount || 0) / QUESTIONS_PER_PAGE), [lessonQuestionsTotalCount, QUESTIONS_PER_PAGE]);
    const paginatedQuestions = lessonQuestions || [];
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    // Pagination for my questions
    const myTotalPages = useMemo(() => Math.ceil((myQuestionsTotalCount || 0) / QUESTIONS_PER_PAGE), [myQuestionsTotalCount, QUESTIONS_PER_PAGE]);
    const paginatedMyQuestions = myQuestions || [];
    const handleMyPageChange = (page: number) => {
        if (page < 1 || page > myTotalPages) return;
        setMyCurrentPage(page);
    };
    const getMyPageNumbers = () => {
        const pages = [];
        if (myTotalPages <= 7) {
            for (let i = 1; i <= myTotalPages; i++) pages.push(i);
        } else {
            if (myCurrentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', myTotalPages);
            } else if (myCurrentPage >= myTotalPages - 3) {
                pages.push(1, '...', myTotalPages - 4, myTotalPages - 3, myTotalPages - 2, myTotalPages - 1, myTotalPages);
            } else {
                pages.push(1, '...', myCurrentPage - 1, myCurrentPage, myCurrentPage + 1, '...', myTotalPages);
            }
        }
        return pages;
    };


    if (!lessonQuestionsPending) {

    }

    return (
        <>
        <View style={styles.container}>
            {/* Current material */}
            <View style={styles.currentMaterial}>
                <Text style={styles.title}>{materialTitle}</Text>
            </View>
            {/* List comments */}
            <View>
                {/* Lesson questions */}
                <View style={{marginTop: 16}}>
                    {lessonQuestionsPending ? (
                        <ActivityIndicator style={{alignSelf: 'center', marginTop: 16}} size={'large'} color={'#fff'}/>
                    ) : (
                        <>
                            <Text style={styles.subtitle}>Các câu hỏi của bài học ({lessonQuestionsTotalCount})</Text>
                            {(!paginatedQuestions || paginatedQuestions.length === 0) ? (
                                <View style={styles.emptyContainer}>
                                    <Image
                                        source={require('@/assets/images/question-empty.svg')}
                                        style={styles.emptyImage}
                                    />
                                    <Text style={styles.emptyText}>Chưa có câu hỏi nào tại bài học này.</Text>
                                </View>
                            ) : (
                                <>
                                    <View style={{marginTop: 8}}>
                                        {paginatedQuestions.map((question) => (
                                                <QuestionItem
                                                    key={question.id}
                                                    question={question}
                                                />
                                        ))}
                                    </View>
                                    {/* Pagination controls */}
                                    <View style={[styles.paginationContainer, totalPages <= 5 && { justifyContent: 'flex-end' }]}>
                                        {totalPages > 1 && (
                                            <TouchableOpacity
                                                onPress={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                                            >
                                                <Text style={styles.pageButtonText}>{'<'}</Text>
                                            </TouchableOpacity>
                                        )}
                                        {totalPages <= 5 && <Text style={[styles.pageButtonText, {color: '#a2adbd'}]}>Trang: </Text>}
                                        {getPageNumbers().map((page, idx) =>
                                            typeof page === 'number' ? (
                                                <TouchableOpacity
                                                    key={page}
                                                    onPress={() => handlePageChange(page)}
                                                    disabled={currentPage === page}
                                                    style={[styles.pageButton, currentPage === page && styles.pageButtonActive]}
                                                >
                                                    <Text style={[styles.pageButtonText, currentPage === page && styles.pageButtonTextActive]}>{page}</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <Text key={"ellipsis-" + idx} style={styles.pageEllipsis}>...</Text>
                                            )
                                        )}
                                        {totalPages > 1 && (
                                            <TouchableOpacity
                                                onPress={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                                            >
                                                <Text style={styles.pageButtonText}>{'>'}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </View>
            </View>

            {/* Add New Question */}
            <View style={styles.addQuestionContainer}>
                <Text style={styles.addQuestionText}>Không tìm thấy câu hỏi bạn cần?</Text>
                <GradientButton variant="outline" text="Đặt câu hỏi mới" onPress={() => setShowCreateModal(true)} style={{flexShrink: 0}}/>
            </View>

            {/* Create Question Modal */}
            <CreateQuestionModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                lessonMaterialId={materialId}
            />

            {/* My Questions Section */}
            <View style={{marginTop: 32}}>
                {myQuestionsPending ? (
                    <ActivityIndicator style={{alignSelf: 'center', marginTop: 16}} size={'large'} color={'#fff'}/>
                ) : (
                    <>
                        <Text style={styles.subtitle}>Các câu hỏi của bạn ({myQuestionsTotalCount})</Text>
                        {(!paginatedMyQuestions || paginatedMyQuestions.length === 0) ? (
                            <View style={styles.emptyContainer}>
                                <Image
                                    source={require('@/assets/images/question-empty.svg')}
                                    style={styles.emptyImage}
                                />
                                <Text style={styles.emptyText}>Bạn chưa đặt câu hỏi nào.</Text>
                            </View>
                        ) : (
                            <>
                                <View style={{marginTop: 8}}>
                                    {paginatedMyQuestions.map((question) => (
                                        <QuestionItem
                                            key={question.id}
                                            question={question}
                                        />
                                    ))}
                                </View>
                                {/* Pagination controls for my questions */}
                                <View style={[styles.paginationContainer, myTotalPages <= 5 && { justifyContent: 'flex-end' }]}> 
                                    {myTotalPages > 1 && (
                                        <TouchableOpacity
                                            onPress={() => handleMyPageChange(myCurrentPage - 1)}
                                            disabled={myCurrentPage === 1}
                                            style={[styles.pageButton, myCurrentPage === 1 && styles.pageButtonDisabled]}
                                        >
                                            <Text style={styles.pageButtonText}>{'<'}</Text>
                                        </TouchableOpacity>
                                    )}
                                    {myTotalPages <= 5 && <Text style={[styles.pageButtonText, {color: '#a2adbd'}]}>Trang: </Text>}
                                    {getMyPageNumbers().map((page, idx) =>
                                        typeof page === 'number' ? (
                                            <TouchableOpacity
                                                key={page}
                                                onPress={() => handleMyPageChange(page)}
                                                disabled={myCurrentPage === page}
                                                style={[styles.pageButton, myCurrentPage === page && styles.pageButtonActive]}
                                            >
                                                <Text style={[styles.pageButtonText, myCurrentPage === page && styles.pageButtonTextActive]}>{page}</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <Text key={'my-ellipsis-' + idx} style={styles.pageEllipsis}>...</Text>
                                        )
                                    )}
                                    {myTotalPages > 1 && (
                                        <TouchableOpacity
                                            onPress={() => handleMyPageChange(myCurrentPage + 1)}
                                            disabled={myCurrentPage === myTotalPages}
                                            style={[styles.pageButton, myCurrentPage === myTotalPages && styles.pageButtonDisabled]}
                                        >
                                            <Text style={styles.pageButtonText}>{'>'}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </>
                        )}
                    </>
                )}
            </View>
        </View>
        <Toast position="bottom"/>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginBottom: 30,
    },
    currentMaterial: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dae4f0',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#a2adbd',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#dae4f0',
    },
    questionItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#222c3a',
    },
    questionTitle: {
        fontSize: 15,
        color: '#fff',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    pageButton: {
        minWidth: 32,
        height: 32,
        borderRadius: 6,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232c3b',
    },
    pageButtonActive: {
        backgroundColor: '#0093fc',
        opacity: 1,
    },
    pageButtonDisabled: {
        opacity: 0.5,
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    pageButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pageEllipsis: {
        color: '#a2adbd',
        fontSize: 18,
        marginHorizontal: 4,
    },
    emptyContainer: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        width: 81,
        height: 80,
        marginTop: 30
    },
    emptyText: {
        fontSize: 14,
        color: '#fffc',
        marginTop: 12
    },
    addQuestionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        gap: 8,
    },
    addQuestionText: {
        fontSize: 16,
        color: '#dae4f0',
        flexShrink: 1,
        lineHeight: 24,
    }
})

export default CommentList;
