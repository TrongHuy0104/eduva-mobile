import { useCreateQuestion } from "@/hooks/useQuestion";
import { CreateQuestionRequest } from "@/types/requests/create-question.request";
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import GradientButton from "../GradientButton";

interface CreateQuestionModalProps {
  visible: boolean;
  onClose: () => void;
  lessonMaterialId: string
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ visible, onClose, lessonMaterialId }) => {
  const {  mutate, isPending } = useCreateQuestion()

  // Clear all data when modal closes
  React.useEffect(() => {
    if (!visible) {
      setTitle("");
      setContent("");
      setImages([]);
      setShowLinkDialog(false);
      setLinkUrl("");
      setLinkDisplayText("");
      setLinkUrlError("");
      setTitleError("");
      richText.current?.setContentHTML("");
    }
  }, [visible]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const richText = React.useRef<RichEditor | null>(null);

  // Custom link dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDisplayText, setLinkDisplayText] = useState("");
  const [linkUrlError, setLinkUrlError] = useState("");

  // Real image upload logic using expo-image-picker
  const handleImageUpload = async () => {
  let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.status !== 'granted') {
    alert('Permission to access media library is required!');
    return;
  }

  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    base64: true,
    quality: 0.85,
    allowsMultipleSelection: true,
    selectionLimit: 10, // you can change this limit as needed
  });

  if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
    return;
  }

  const newImages = pickerResult.assets.map(asset =>
    asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri
  );

  setImages(prev => [...prev, ...newImages]);
  newImages.forEach(imageSrc => {
    richText.current?.insertHTML(`<img src="${imageSrc}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`);
  });
};


  const [titleError, setTitleError] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError("Tiêu đề không được để trống");
      return;
    }
    setTitleError("");

    const createQuestionRequest: CreateQuestionRequest = {
      title,
      content,
      lessonMaterialId,
    };

    mutate(createQuestionRequest);
    setTitle("");
    setContent("");
    onClose();
  };

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
            <Text style={styles.title}>Hỏi đáp</Text>
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
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }} style={{ flex: 1 }}>
            <Text style={styles.label}>Đặt câu hỏi mới</Text>
            <TextInput
              style={[
                styles.input,
                titleError ? styles.linkDialogInputError : null
              ]}
              placeholder="Nhập tiêu đề câu hỏi"
              placeholderTextColor="#a2adbd"
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (titleError && text.trim()) setTitleError("");
              }}
              onBlur={() => {
                if (!title.trim()) setTitleError("Tiêu đề không được để trống");
              }}
            />
            {titleError ? (
              <Text style={styles.linkDialogError}>{titleError}</Text>
            ) : null}
            {/* Rich Text Editor */}
            <View style={styles.richEditorContainer}>
              <RichToolbar
                editor={richText}
                actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.code, actions.blockquote, actions.insertLink, actions.insertImage, actions.setStrikethrough, actions.undo, actions.redo]}
                iconMap={{
                  [actions.insertImage]: ({ tintColor }: { tintColor?: string }) => (
                    <TouchableOpacity onPress={handleImageUpload}>
                      <FontAwesome6 name="image" size={18} color={tintColor || '#a2adbd'} style={styles.toolbarIcon} />
                    </TouchableOpacity>
                  ),
                  [actions.insertLink]: ({ tintColor }: { tintColor?: string }) => (
                    <TouchableOpacity onPress={() => {
                      setShowLinkDialog(true);
                    }}>
                      <FontAwesome6 name="link" size={18} color={tintColor || '#a2adbd'} style={styles.toolbarIcon} />
                    </TouchableOpacity>
                  )
                }}

                style={styles.toolbar}
                selectedIconTint={'#fff'}
                onPressAddLink={() => {}} // Disable default
                onPressAddImage={handleImageUpload}
              />
              <View style={{paddingBottom: 24}}>
              <RichEditor
                ref={richText}
                style={styles.richEditor}
                placeholder="Mô tả chi tiết câu hỏi của bạn..."
                initialContentHTML={content}
                onChange={setContent}
                editorStyle={{
                  backgroundColor: '#323c4a',
                  color: '#fff',
                  placeholderColor: '#a2adbd',
                  cssText: `
                    pre, code { background-color: #32353b !important; color: #fff !important; }
                    pre { margin-bottom: 12px !important; }
                    div, p { color: #fff !important; font-size: 16px !important; min-height: 1em; }
                    div { min-height: 1em; }
                    pre + div, pre + p, code + div, code + p {
                      margin-top: 12px !important;
                      min-height: 1em !important;
                      display: block !important;
                    }
                    blockquote {
                      border-left-color: #0093fc !important;
                      border-left-width: 2px !important;
                      color: #fff !important;
                      margin: 8px 0 !important;
                    }
                  `
                }}
              />
              </View>
              
            </View>
            <View style={styles.submitBtnContainer}>
              <GradientButton
                variant="outline"
                text="ĐĂNG CÂU HỎI"
                onPress={handleSubmit}
                style={styles.submitBtn}
                isDisabled={!title.trim() || !content.trim()}
              />
            </View>
          </ScrollView>
        </View>

      </View>
      {/* Custom Link Dialog */}
      <Modal
        visible={showLinkDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLinkDialog(false)}
      >
        <View style={styles.linkDialogOverlay}>
          <View style={styles.linkDialogContainer}>
            <Text style={styles.linkDialogTitle}>Chèn liên kết</Text>
            <TextInput
              style={styles.linkDialogInput}
              placeholder="Văn bản hiển thị"
              placeholderTextColor="#a2adbd"
              value={linkDisplayText}
              onChangeText={setLinkDisplayText}
              autoFocus
            />
            <TextInput
              style={[styles.linkDialogInput, linkUrlError ? styles.linkDialogInputError : null]}
              placeholder="Nhập URL liên kết"
              placeholderTextColor="#a2adbd"
              value={linkUrl}
              onChangeText={text => {
                setLinkUrl(text);
                if (linkUrlError && text.trim()) setLinkUrlError("");
              }}
              keyboardType="url"
            />
            {!!linkUrlError && (
              <Text style={styles.linkDialogError}>{linkUrlError}</Text>
            )}
            <View style={styles.linkDialogActions}>
              <Pressable onPress={() => { setShowLinkDialog(false); setLinkUrl(""); }}>
                <Text style={styles.linkDialogCancel}>HỦY</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const url = linkUrl.trim();
                  const text = linkDisplayText.trim() || linkUrl.trim();
                  if (!url) {
                    setLinkUrlError("Vui lòng nhập URL liên kết!");
                    return;
                  }
                  // Add protocol if missing
                  const normalizedUrl = url.match(/^https?:\/\//i) ? url : `https://${url}`;
                  // Insert link with custom color
                  richText.current?.insertHTML(`<a href="${normalizedUrl}" style="color:#0093fc;text-decoration:underline;" target="_blank">${text}</a>`);
                  setShowLinkDialog(false);
                  setLinkUrl("");
                  setLinkDisplayText("");
                  setLinkUrlError("");
                }}
              >
                <Text style={styles.linkDialogOk}>CHÈN</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  linkDialogInputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#ff00001a',
    borderWidth: 1,
  },
  linkDialogError: {
    color: '#f33a58',
    marginTop: -4,
    marginBottom: 20,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#23262d',
    borderRadius: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'absolute',
    top: -6,
    left: -16,
    zIndex: 10,
  },
  backText: {
    color: '#1d9ffb',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  label: {
    color: '#dae4f0',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#323c4a',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    borderWidth: 0,
  },
  richEditorContainer: {
    backgroundColor: '#323c4a',
    borderRadius: 12,
    padding: 0,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#323c4a',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 0,
    gap: 0,
    justifyContent: 'flex-start',
  },
  toolbarIcon: {
    marginHorizontal: 6,
    opacity: 0.92,
  },
  richEditor: {
    minHeight: 120,
    color: '#fff',
    /**
     * Sets the background color of the component to a dark shade of grayish-blue.
     */
    backgroundColor: '#323c4a',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 10,
    fontSize: 16,
    borderWidth: 0,
  },
  imagePreviewRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  imagePreview: {
    width: 56,
    height: 56,
    backgroundColor: '#444b5a',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtn: {
    marginTop: 24,
    width: '100%',
    alignSelf: 'center',
  },
  linkDialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkDialogContainer: {
    backgroundColor: '#23262d',
    borderRadius: 12,
    padding: 24,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  linkDialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  linkDialogInput: {
    width: '100%',
    backgroundColor: '#32353b',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 0,
  },
  linkDialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 24,
  },
  linkDialogCancel: {
    color: '#1d9ffb',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 24,
  },
  linkDialogOk: {
    color: '#1d9ffb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitBtnContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

export default CreateQuestionModal;
