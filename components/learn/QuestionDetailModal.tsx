import { SCREEN_HEIGHT } from '@/constants/app.constants';
import { useDeleteQuestion, useQuestionById } from '@/hooks/useQuestion';
import { formatDateVi } from '@/utils/formatDateVi';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Helper function to replace <p-image src=...> with <img src=...>
function replacePImageWithImg(html: string): string {
  return html.replace(/<p-image([^>]*)src=(['\"])([^'\"]+)\2([^>]*)>/gi, '<img$1src=$2$3$2$4>');
}

interface QuestionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  questionId: string | null;
}

import { useAuth } from '@/contexts/auth.context';
import Toast from 'react-native-toast-message';
import EditQuestionModal from './EditQuestionModal';

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({ visible, onClose, questionId }) => {
  const showModal = visible && !!questionId;
  const { data, isPending } = useQuestionById(questionId ?? '', visible);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const {user} = useAuth()

  const {mutate} = useDeleteQuestion()

  const deleteQuesion = () => {
    if (questionId) {
      mutate(questionId, {
        onSuccess: () => {
          onClose()
        }
      })
    }
    
  }

  // Injected JS to auto-fit height
  const injectedJS = `
    (function() {
      function getMaxHeight() {
        var body = document.body, html = document.documentElement;
        var max = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        var all = document.body.getElementsByTagName('*');
        for (var i = 0; i < all.length; i++) {
          max = Math.max(max, all[i].offsetTop + all[i].offsetHeight);
        }
        return max;
      }
      function sendHeight() {
        var height = getMaxHeight();
        var ratio = window.devicePixelRatio || 1;
        window.ReactNativeWebView.postMessage(Math.ceil(height / ratio));
      }
      window.addEventListener('load', sendHeight);
      window.addEventListener('resize', sendHeight);
      let count = 0;
      let interval = setInterval(function() {
        sendHeight();
        count++;
        if (count > 10) clearInterval(interval);
      }, 200);
      const imgs = document.images;
      for (let i = 0; i < imgs.length; i++) {
        imgs[i].onload = imgs[i].onerror = sendHeight;
      }
    })();
  `;

  return (
    <Modal visible={showModal} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
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
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }} style={{ flex: 1, marginTop: 20 }}>
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
                    <Text style={styles.questionOwnerName}>{data.createdByName}</Text>
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
              <View>
                {data.content ? (
                  <View style={{backgroundColor: '#191c24', borderRadius: 8, position: 'relative'}}>
                    {data.canUpdate && <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: 4, position: 'absolute', top: -28, right: 0, zIndex: 100 }}>
                      <>
                      {data.lastModifiedAt && <Text style={{color: '#4e586b', fontSize: 14, marginRight: 12}}>Đã chỉnh sửa</Text>}
                      <Pressable
                        style={({pressed}) => ({
                          opacity: pressed ? 0.8 : 1,
                        })}
                        onPress={() => setMenuVisible((v) => !v)}
                      >
                        <FontAwesome6 name="ellipsis" size={22} color="#1d9ffb" />
                      </Pressable>
                      </>
                    </View>}
                    {data.canUpdate && menuVisible && (
                      <View style={{ position: 'absolute', top: 28, right: 0, zIndex: 100 }}>
                        {/* Overlay */}
                        <Pressable
                          style={{
                            ...StyleSheet.absoluteFillObject,
                            zIndex: 99,
                          }}
                          onPress={() => setMenuVisible(false)}
                          pointerEvents="auto"
                        />
                        {/* Menu */}
                        <View
                          style={{
                            position: 'absolute',
                            top: -20, 
                            right: 0,
                            backgroundColor: '#3b4554',
                            borderRadius: 10,
                            width: 140,
                            elevation: 10,
                            zIndex: 100,
                          }}
                        >
                          <Pressable onPress={() => { setMenuVisible(false); setEditModalVisible(true); }} style={({pressed}) => ({
                            backgroundColor: pressed ? '#384250' : undefined,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                          })}>
                            {({ pressed }) => (
                              <Text style={{ color: pressed ? '#c8d4e0' : '#fff', fontSize: 16, padding: 12, }}>Chỉnh sửa</Text>
                            )}
                          </Pressable>
                          {data.canDelete && <Pressable onPress={() => deleteQuesion()} style={({pressed}) => ({backgroundColor: pressed ? '#384250' : undefined, borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10 })}>
                            {({ pressed }) => (
                              <Text style={{ color: pressed ? '#c8d4e0' : '#fff', fontSize: 16, padding: 12 }}>Xóa</Text>
                            )}
                          </Pressable>}
                        </View>
                      </View>
                    )}
                    <WebView
                      originWhitelist={["*"]}
                      source={{ html: `<!DOCTYPE html><html lang='vi'><head><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>html,body{min-height:0;height:auto!important;overflow:visible!important;} body{color:#fff;font-size:16px;font-family:sans-serif;padding:8px;padding-top: 4px;} img, p-image { max-width: 100%; max-height: 300px; height: auto; border-radius: 8px; display: block; object-fit: contain; margin: 0 auto 8px; } pre,code{background:#23262d;color:#fff;border-radius:4px;padding:2px 6px;} blockquote{border-left:3px solid #1d9ffb;padding-left:8px;color:#ccc;} strong{color:#1d9ffb;} </style></head><body>${replacePImageWithImg(data.content)}</body></html>` }}
                      style={{ width: '100%', height: SCREEN_HEIGHT * 0.65, backgroundColor: 'transparent' }}
                      showsVerticalScrollIndicator={true}
                      scrollEnabled={true}
                    />
                  </View>
                ) : (
                  <Text style={{ color: '#fff', fontStyle: 'italic', margin: 8 }}>Không có nội dung câu hỏi.</Text>
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
    <Toast/>
  </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
    marginBottom: 16,
  },
  questionOwnerInfo: {
    marginVertical: 16,
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
});

export default QuestionDetailModal;
