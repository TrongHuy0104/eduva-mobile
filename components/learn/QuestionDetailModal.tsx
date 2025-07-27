import { useCreateComment } from '@/hooks/useComment';
import { useDeleteQuestion, useQuestionById } from '@/hooks/useQuestion';
import { CreateCommentRequest } from '@/types/requests/create-comment-request.model';
import { formatDateVi } from '@/utils/formatDateVi';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import Toast from 'react-native-toast-message';
import HTMLContent from '../common/HTMLContent';
import RichTextEditor, { RichTextEditorRef } from "../common/RichTextEditor";
import DetailComments from './DetailComments';
import EditQuestionModal from './EditQuestionModal';

// Helper function to replace <p-image src=...> with <img src=...>
function replacePImageWithImg(html: string): string {
  return html.replace(/<p-image([^>]*)src=(["'])([^"']+)\2([^>]*)>/gi, '<img$1src=$2$3$2$4>');
}

interface QuestionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  questionId: string | null;
}


const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({ visible, onClose, questionId }) => {
  const { width } = useWindowDimensions();
  const { data, isPending } = useQuestionById(questionId ?? '', visible);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  // Reset state when modal is closed
  useEffect(() => {
    if (!visible) {
      setShowReplyInput(false);
      setCommentContent('');
      richTextEditorRef.current?.setContent('');
    }
  }, [visible]);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const richTextEditorRef = useRef<RichTextEditorRef>(null);
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();
  
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollPosition.current = event.nativeEvent.contentOffset.y;
  }, []);
  
  const { mutate } = useDeleteQuestion()

  const deleteQuestion = async () => {
    if (questionId) {
      mutate(questionId, {
        onSuccess: () => {
          // Scroll to top before closing
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
          }
          // Close after a short delay to show the scroll
          setTimeout(() => {
            onClose();
          }, 100);
        }
      });
    }
  };

  const handleReplySubmit = async () => {
    if (!richTextEditorRef.current || isCreatingComment) return;
    
    const content = richTextEditorRef.current.getContent();
    if (!content.trim()) return;
    
    try {
      const createCommentRequest: CreateCommentRequest = {
        questionId: questionId!,
        content: content,
      };
      
      await new Promise<void>((resolve, reject) => {
        createComment(createCommentRequest, {
          onSuccess: () => {
            richTextEditorRef.current?.setContent('');
            setCommentContent('');
            resolve();
          },
          onError: (error) => {
            console.error('Failed to post reply:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error in handleReplySubmit:', error);
    }
  };

  const comments = data?.comments ?? [];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <FontAwesome6 name="arrow-left" size={20} color="#1d9ffb" />
              <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>
            <Text style={styles.titleAbsolute}>Hỏi đáp</Text>
            {/* Close button */}
            <Pressable
                onPress={onClose}
                style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    position: 'absolute',
                    top: -8,
                    right: -8,
                }}
            >
                <FontAwesome6
                    name="xmark"
                    solid
                    size={24}
                    color="#1d9ffb"
                />
            </Pressable>
          </View>

          {!questionId ? (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 32 }}>Không tìm thấy dữ liệu câu hỏi.</Text>
          ) : isPending ? (
            <ActivityIndicator size="large" color="#fff" style={{alignSelf: 'center', marginTop: 16}} />
          ) : data ? (
            <ScrollView 
              ref={scrollViewRef}
              style={{ flex: 1, marginTop: 20 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              scrollEventThrottle={16}
              onScroll={handleScroll}
              scrollsToTop={true}
            >
              {/* Question title */}
              <Text style={styles.questionTitle}>{data.title}</Text>
              
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
                    <Text style={[styles.questionOwnerName, {maxWidth: width * 0.5}]} numberOfLines={1} ellipsizeMode="tail">{data.createdByName}</Text>
                    <Text style={styles.questionOwnerTime}>{formatDateVi(data.createdAt)}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <Image
                    style={{
                        width: 16,
                        height: 16,
                    }}
                    source={data.commentCount > 0 ? require('../../assets/images/circle-check-green.svg') : require('../../assets/images/circle-question-mark.svg')}
                    contentFit="contain"
                    transition={1000}
                  />
                  <Text style={{color: data.commentCount > 0 ? '#48bd79' : '#808b9a'}}>{data.commentCount > 0 ? 'Đã trả lời' : 'Chưa trả lời'}</Text>
                </View>
              </View>

              {/* Question content */}
              <View style={{ flex: 1, marginTop: 12 }}>
                <HTMLContent 
                  content={data?.content || ''} 
                  contentWidth={width - 40} 
                />
              </View>

              {/* Menu */}
              {data.canUpdate && (
                <View style={styles.menuContainer}>
                  {data.lastModifiedAt && (
                    <Text style={styles.lastModifiedText}>Đã chỉnh sửa</Text>
                  )}
                  <Pressable
                    style={({pressed}) => ({
                      opacity: pressed ? 0.8 : 1,
                          })}
                          onPress={() => setMenuVisible((v) => !v)}
                  >
                    <FontAwesome6 name="ellipsis" size={22} color="#1d9ffb" />
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
                            setEditModalVisible(true);
                                }}
                                style={({ pressed }) => ({
                                  backgroundColor: pressed ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                  padding: 12,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                })}
                              >
                                <FontAwesome6 name="pen-to-square" size={16} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 14 }}>Chỉnh sửa</Text>
                        </Pressable>
                        <View style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                        {
                          data.canDelete && (
                            <Pressable
                              onPress={() => {
                                setMenuVisible(false);
                                deleteQuestion();
                                    }}
                                    style={({ pressed }) => ({
                                      backgroundColor: pressed ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                                      padding: 12,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      borderBottomLeftRadius: 10,
                                      borderBottomRightRadius: 10,
                                    })}
                                  >
                                <FontAwesome6 name="trash" size={16} color="#ff4d4f" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 14 }}>Xóa</Text>
                            </Pressable>
                          )
                        }
                        </View>
                      </View>
                    )}
                </View>
              )}

              {/* Create My Comment */}
              <View style={styles.commentInputContainer}>
                <Image 
                  source={{ uri: data.createdByAvatar }} 
                  style={styles.avatar} 
                />
                
                {!showReplyInput ? (
                  <Pressable 
                    onPress={() => setShowReplyInput(true)}
                    style={styles.addCommentButton}
                  >
                    <Text style={styles.addCommentText}>Thêm bình luận</Text>
                  </Pressable>
                ) : (
                    <View style={styles.replyInputContainer}>
                    <RichTextEditor
                        key={`rich-editor-${visible ? 'visible' : 'hidden'}`}
                        ref={richTextEditorRef}
                        placeholder="Nhập bình luận mới của bạn..."
                        style={styles.replyEditor}
                        editorStyle={[styles.replyEditorContent, {minHeight: 50}]}
                        initialHeight={50}
                        onContentChange={setCommentContent}
                    />
                    <View style={styles.replyActions}>
                      <TouchableOpacity 
                          onPress={() => setShowReplyInput(false)}
                          style={styles.cancelButton}
                        >
                          <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.button, 
                          styles.primaryButton,
                          (!commentContent?.trim() || isCreatingComment) && styles.disabledButton
                        ]}
                        onPress={handleReplySubmit}
                        disabled={!commentContent?.trim() || isCreatingComment}
                      >
                        {isCreatingComment && (
                          <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                        )}
                        <Text style={styles.buttonText}>
                          Bình luận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>


            {/* Comments */}
            <View style={{marginTop: 24}}>
              <Text style={styles.commentCount}>{data?.commentCount} bình luận</Text>
              {comments.length > 0 && (
                <DetailComments comments={comments} />
              )}
              </View>
            </ScrollView>
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 32 }}>Không tìm thấy dữ liệu câu hỏi.</Text>
          )}
        </View>
      </View>

      {/* Edit Modal */}
      {data && (
        <EditQuestionModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          questionId={data.id}
          initialTitle={data.title}
          initialContent={data.content}
          lessonMaterialId={data.lessonMaterialId}
        />
      )}
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#23262d',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // center children horizontally
    marginBottom: 0,
    position: 'relative',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 12,
    position: 'relative',
    top: 6,
    paddingRight: 16,
  },
  backText: {
    color: '#1d9ffb',
    fontSize: 16,
    marginLeft: 4,
  },
  titleAbsolute: {
    position: 'absolute',
    left: '50%',
    transform: [{translateX: '-50%'}],
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    zIndex: 0
  },
  questionTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 8,
  },
  questionContent: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 16,
  },
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
    tintColor: '#0093fc'
  },
  questionOwnerTime: {
    color: '#808b9a',
    fontSize: 14,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  expandBtnText: {
    color: '#1d9ffb',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentCount: {
    fontSize: 18,
    color: '#dae4f0',
    fontWeight: '700',
    marginBottom: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8
  },
  avatar: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    objectFit: 'cover'
  },
  addCommentButton: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#323c4a',
  },
  addCommentText: {
    color: '#808b9a',
    marginLeft: 8
  },
  replyInputContainer: {
    flex: 1,
    marginBottom: 12,
    flexShrink: 1,
  },
  replyEditor: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  replyEditorContent: {
    minHeight: 120,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#1d9ffb',
  },
  disabledButton: {
    opacity: 0.5,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default QuestionDetailModal;
