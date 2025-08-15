import { useAuth } from '@/contexts/auth.context';
import {
    useCreateComment,
    useDeleteComment,
    useUpdateComment,
} from '@/hooks/useComment';
import { useToast } from '@/hooks/useToast';
import { CommentEntity, Reply } from '@/types/models/comment.model';
import { CreateCommentRequest } from '@/types/requests/create-comment-request.model';
import { UpdateCommentRequest } from '@/types/requests/update-comment-request.model';
import { formatDateVi } from '@/utils/formatDateVi';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    ViewStyle,
} from 'react-native';
import HTMLContent from '../common/HTMLContent';
import RichTextEditor, { RichTextEditorRef } from '../common/RichTextEditor';

interface CommentItemProps {
    data: CommentEntity | Reply;
    isBestComment?: boolean;
    style?: StyleProp<ViewStyle>;
    contentWidth?: number;
    questionId?: string;
    commentId?: string;
}

export default function CommentItem({
    data,
    isBestComment = false,
    contentWidth,
    style,
    questionId,
    commentId,
}: Readonly<CommentItemProps>) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [commentCreateContent, setCommentCreateContent] = useState('');
    const [commentEditContent, setCommentEditContent] = useState(data.content);

    const richTextEditorRef = useRef<RichTextEditorRef>(null);
    const editRichTextEditorRef = useRef<RichTextEditorRef>(null);

    const { mutate: deleteCommentMutation } = useDeleteComment();
    const { mutate: createCommentMutation, isPending: isCreatingComment } =
        useCreateComment();
    const { mutate: updateCommentMutation, isPending: isUpdatingComment } =
        useUpdateComment();
    const { user } = useAuth();
    const toast = useToast();

    const width = useWindowDimensions().width;

    const handleDeleteComment = () => {
        deleteCommentMutation(data.id, {
            onSuccess: () => {
                toast.success(
                    'Xóa bình luận thành công',
                    'Bình luận của bạn đã được xóa thành công'
                );
            },
        });
    };

    const handleReplySubmit = async () => {
        if (!richTextEditorRef.current) return;

        const content = richTextEditorRef.current.getContent();
        if (!content.trim()) return;

        try {
            const createCommentRequest: CreateCommentRequest = {
                questionId: questionId!,
                content,
                parentCommentId: data.parentCommentId
                    ? data.parentCommentId
                    : commentId!,
            };

            createCommentMutation(createCommentRequest, {
                onSuccess: () => {
                    richTextEditorRef.current?.setContent('');
                    setShowReplyInput(false);
                    toast.success(
                        'Tạo bình luận thành công',
                        'Bình luận của bạn đã được tạo thành công'
                    );
                },
            });
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    const handleEditSubmit = () => {
        if (!editRichTextEditorRef.current || !data) return;

        const content = editRichTextEditorRef.current.getContent();
        if (!content.trim()) return;

        try {
            const updateCommentRequest: UpdateCommentRequest = {
                content,
            };
            updateCommentMutation(
                { commentId: data.id, data: updateCommentRequest },
                {
                    onSuccess: () => {
                        setIsEditing(false);
                    },
                }
            );
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    return (
        <View
            style={[
                styles.commentContainer,
                {
                    backgroundColor: isBestComment ? '#48bd790a' : undefined,
                    borderWidth: isBestComment ? 1 : undefined,
                    borderColor: isBestComment ? '#48bd7929' : undefined,
                },
                style,
            ]}
        >
            {/* Question owner */}
            <View style={styles.questionOwner}>
                <View style={styles.questionOwnerInfo}>
                    <Image
                        source={{ uri: data.createdByAvatar }}
                        style={{ width: 42, height: 42, borderRadius: 9999 }}
                        contentFit="cover"
                        transition={1000}
                    />
                    <View>
                        <Text
                            style={[
                                styles.questionOwnerName,
                                { maxWidth: width * 0.45 },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {data.createdByName}
                        </Text>
                        <Text style={styles.questionOwnerTime}>
                            {formatDateVi(data.createdAt)}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        position: 'relative',
                        top: 4,
                    }}
                >
                    {isBestComment && (
                        <Image
                            style={{
                                width: 16,
                                height: 16,
                            }}
                            source={require('../../assets/images/circle-check-green.svg')}
                            contentFit="contain"
                            transition={1000}
                        />
                    )}
                    {isBestComment && (
                        <Text
                            style={{ color: '#48bd79', maxWidth: width * 0.25 }}
                        >
                            Bình luận
                            {'\n'}
                            <Text style={{ color: '#48bd79' }}> tốt nhất</Text>
                        </Text>
                    )}
                </View>
            </View>

            {/* Comment Content */}
            {isEditing ? (
                <View style={styles.editContainer}>
                    <RichTextEditor
                        ref={editRichTextEditorRef}
                        initialContent={data.content}
                        placeholder="Chỉnh sửa bình luận..."
                        style={styles.replyEditor}
                        editorStyle={styles.replyEditorContent}
                        initialHeight={50}
                        onContentChange={setCommentEditContent}
                    />
                    <View style={styles.replyActions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setIsEditing(false)}
                        >
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.primaryButton,
                                (!commentEditContent?.trim() ||
                                    isUpdatingComment) &&
                                    styles.disabledButton,
                            ]}
                            onPress={handleEditSubmit}
                            disabled={
                                !commentEditContent?.trim() || isUpdatingComment
                            }
                        >
                            {isUpdatingComment && (
                                <ActivityIndicator
                                    color="#fff"
                                    style={{ marginRight: 8 }}
                                />
                            )}
                            <Text style={styles.buttonText}>Cập nhật</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1, marginTop: 12 }}>
                    <HTMLContent
                        content={data.content}
                        contentWidth={contentWidth}
                    />
                </View>
            )}

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 12,
                    justifyContent: 'space-between',
                }}
            >
                {/* Reply */}
                <Pressable
                    style={({ pressed }: { pressed: boolean }) => [
                        {
                            opacity: pressed ? 0.8 : 1,
                        },
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            position: 'relative',
                            top: -2,
                        },
                    ]}
                    onPress={() => setShowReplyInput(!showReplyInput)}
                >
                    <FontAwesome6 name="share" size={18} color="#1d9ffb" />
                    <Text style={styles.replyText}>
                        {showReplyInput ? 'Hủy' : 'Phản hồi'}
                    </Text>
                </Pressable>
                {/* Menu */}
                {data.canUpdate && (
                    <View style={styles.menuContainer}>
                        {Boolean(data.lastModifiedAt) && (
                            <Text style={styles.lastModifiedText}>
                                Đã chỉnh sửa
                            </Text>
                        )}
                        <Pressable
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.8 : 1,
                            })}
                            onPress={() => setMenuVisible((v) => !v)}
                        >
                            <FontAwesome6
                                name="ellipsis"
                                size={22}
                                color="#1d9ffb"
                            />
                        </Pressable>

                        {menuVisible && (
                            <View style={styles.menuWrapper}>
                                {/* Overlay */}
                                <Pressable
                                    style={styles.menuOverlay}
                                    onPress={() => setMenuVisible(false)}
                                    pointerEvents="auto"
                                />
                                {/* Menu */}
                                <View style={[styles.menu, { width: 140 }]}>
                                    <Pressable
                                        onPress={() => {
                                            setMenuVisible(false);
                                            setIsEditing(true);
                                        }}
                                        style={({ pressed }) => ({
                                            backgroundColor: pressed
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'transparent',
                                            padding: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderTopLeftRadius: 10,
                                            borderTopRightRadius: 10,
                                        })}
                                    >
                                        <FontAwesome6
                                            name="pen-to-square"
                                            size={16}
                                            color="#fff"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 14,
                                            }}
                                        >
                                            Chỉnh sửa
                                        </Text>
                                    </Pressable>
                                    <View
                                        style={{
                                            height: 1,
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.1)',
                                        }}
                                    />
                                    {data.canDelete && (
                                        <Pressable
                                            onPress={() => {
                                                setMenuVisible(false);
                                                handleDeleteComment();
                                            }}
                                            style={({ pressed }) => ({
                                                backgroundColor: pressed
                                                    ? 'rgba(255, 0, 0, 0.1)'
                                                    : 'transparent',
                                                padding: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                            })}
                                        >
                                            <FontAwesome6
                                                name="trash"
                                                size={16}
                                                color="#ff4d4f"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text
                                                style={{
                                                    color: '#ff4d4f',
                                                    fontSize: 14,
                                                }}
                                            >
                                                Xóa
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Reply Input */}
            {showReplyInput && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 8,
                        marginTop: 8,
                        marginLeft: 16,
                    }}
                >
                    <Image
                        source={user?.avatarUrl}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            objectFit: 'cover',
                        }}
                    />
                    <View style={styles.replyInputContainer}>
                        <RichTextEditor
                            ref={richTextEditorRef}
                            placeholder="Viết bình luận..."
                            style={styles.replyEditor}
                            initialContent={
                                user?.id === data.createdByUserId
                                    ? ''
                                    : `<p><span class="mention" data-mention="@${data.createdByName}">@${data.createdByName}</span>&nbsp;</p>`
                            }
                            editorStyle={styles.replyEditorContent}
                            initialHeight={50}
                            onContentChange={setCommentCreateContent}
                        />
                        <View style={styles.replyActions}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowReplyInput(false)}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.primaryButton,
                                    (!commentCreateContent?.trim() ||
                                        isCreatingComment) &&
                                        styles.disabledButton,
                                ]}
                                onPress={handleReplySubmit}
                                disabled={
                                    !commentCreateContent?.trim() ||
                                    isCreatingComment
                                }
                            >
                                {isCreatingComment && (
                                    <ActivityIndicator
                                        color="#fff"
                                        style={{ marginRight: 8 }}
                                    />
                                )}
                                <Text style={styles.buttonText}>Gửi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    questionOwner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between',
    },
    questionOwnerInfo: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    questionOwnerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        tintColor: '#0093fc',
    },
    questionOwnerTime: {
        color: '#808b9a',
        fontSize: 14,
    },
    commentContainer: {
        flexDirection: 'column',
        padding: 8,
        borderRadius: 12,
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 4,
    },
    lastModifiedText: {
        color: '#4e586b',
        fontSize: 14,
        marginRight: 12,
    },
    menuWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999, // High z-index for the menu wrapper
    },
    menuOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 998,
    },
    menu: {
        position: 'absolute',
        bottom: 30, // Position below the menu button
        right: 0,
        backgroundColor: '#3b4554',
        borderRadius: 10,
        minWidth: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1001, // Highest z-index for the menu itself
        overflow: 'hidden',
    },
    replyText: {
        fontSize: 14,
        fontWeight: 600,
        color: '#0093fc',
    },
    replyInputContainer: {
        marginBottom: 12,
        flexShrink: 1,
    },
    replyEditor: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    replyEditorContent: {
        minHeight: 50,
    },
    editContainer: {
        marginTop: 8,
        marginBottom: 12,
    },
    replyActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        flexDirection: 'row',
        gap: 8,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#3e4a56',
    },
    primaryButton: {
        backgroundColor: '#1d9ffb',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});
