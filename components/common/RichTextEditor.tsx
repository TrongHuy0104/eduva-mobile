import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import {
    RichEditor,
    RichToolbar,
    actions,
} from 'react-native-pell-rich-editor';

interface ToolbarIconProps {
    name: string;
    onPress: () => void;
    tintColor?: string;
    size?: number;
    style?: any;
}

const ToolbarIcon: React.FC<ToolbarIconProps> = ({
    name,
    onPress,
    tintColor = '#a2adbd',
    size = 18,
    style,
}) => (
    <TouchableOpacity onPress={onPress}>
        <FontAwesome6
            name={name as any}
            size={size}
            color={tintColor}
            style={[styles.toolbarIcon, style]}
        />
    </TouchableOpacity>
);

// Pre-defined icon components for the toolbar
const ImageIcon: React.FC<{ tintColor?: string; onPress: () => void }> = ({
    tintColor,
    onPress,
}) => <ToolbarIcon name="image" onPress={onPress} tintColor={tintColor} />;

const LinkIcon: React.FC<{ tintColor?: string; onPress: () => void }> = ({
    tintColor,
    onPress,
}) => <ToolbarIcon name="link" onPress={onPress} tintColor={tintColor} />;

export interface RichTextEditorRef {
    getContent: () => string;
    setContent: (html: string) => void;
    insertImage: (imageUrl: string) => void;
}

export interface RichTextEditorProps {
    initialContent?: string;
    placeholder?: string;
    onContentChange?: (html: string) => void;
    style?: ViewStyle;
    editorStyle?: any;
    placeholderTextColor?: string;
    autoFocus?: boolean;
    initialHeight?: number;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    (
        {
            initialContent = '',
            placeholder = 'Nhập nội dung...',
            onContentChange = () => {},
            style,
            editorStyle,
            placeholderTextColor = '#a2adbd',
            autoFocus = true,
            initialHeight = 120,
        },
        ref
    ) => {
        const richTextRef = useRef<RichEditor | null>(null);
        const [content, setContent] = useState(initialContent);
        const [showLinkDialog, setShowLinkDialog] = useState(false);
        const [linkUrl, setLinkUrl] = useState('');
        const [linkDisplayText, setLinkDisplayText] = useState('');
        const [linkUrlError, setLinkUrlError] = useState('');

        useImperativeHandle(ref, () => ({
            getContent: () => content,
            setContent: (html: string) => {
                const processedHtml = replacePImageWithImg(html);
                setContent(processedHtml);
                richTextRef.current?.setContentHTML(processedHtml);
            },
            insertImage: (imageUrl: string) => {
                const imgTag = `<img src="${imageUrl}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`;
                richTextRef.current?.insertHTML(imgTag);
            },
        }));

        const replacePImageWithImg = (html: string): string => {
            return html.replace(
                /<p-image([^>]*)src=(["'])([^"'>]+)\2([^>]*)\/?>(?:<\/p-image>)?/gi,
                '<img$1src=$2$3$2$4 style="max-width:100%;border-radius:8px;margin:8px 0;" />'
            );
        };

        // Keep internal content in sync when initialContent prop changes
        React.useEffect(() => {
            const processed = replacePImageWithImg(initialContent);
            if (processed !== content) {
                setContent(processed);
                // update editor if mounted
                if (richTextRef.current) {
                    try {
                        richTextRef.current.setContentHTML(processed);
                    } catch (e) {
                        console.warn('Failed to set initial content on RichEditor', e);
                    }
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [initialContent]);

        const handleChange = (html: string) => {
            const processedHtml = replacePImageWithImg(html);
            setContent(processedHtml);
            onContentChange?.(processedHtml);
        };

        const handleAddImage = async () => {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.status !== 'granted') {
                alert('Cần quyền truy cập thư viện ảnh!');
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                base64: true,
                quality: 0.85,
                allowsMultipleSelection: true,
                selectionLimit: 10,
            });

            if (
                pickerResult.canceled ||
                !pickerResult.assets ||
                pickerResult.assets.length === 0
            ) {
                return;
            }

            pickerResult.assets.forEach((asset) => {
                if (asset.base64) {
                    const imgTag = `<img src="data:image/jpeg;base64,${asset.base64}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`;
                    richTextRef.current?.insertHTML(imgTag);
                }
            });
        };

        const handleInsertLink = () => {
            const url = linkUrl.trim();
            const text = linkDisplayText.trim() || linkUrl.trim();

            if (!url) {
                setLinkUrlError('Vui lòng nhập URL liên kết!');
                return;
            }

            const urlPattern = /^https?:\/\//i;
            const normalizedUrl = urlPattern.exec(url) ? url : `https://${url}`;

            richTextRef.current?.insertHTML(
                `<a href="${normalizedUrl}" style="color:#0093fc;text-decoration:underline;" target="_blank">${text}</a>`
            );

            setShowLinkDialog(false);
            setLinkUrl('');
            setLinkDisplayText('');
            setLinkUrlError('');
        };

        return (
            <View style={[styles.richEditorContainer, style]}>
                <RichToolbar
                    editor={richTextRef}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.code,
                        actions.blockquote,
                        actions.insertLink,
                        actions.insertImage,
                        actions.setStrikethrough,
                        actions.undo,
                        actions.redo,
                    ]}
                    iconMap={{
                        [actions.insertImage]: ({
                            tintColor,
                        }: {
                            tintColor?: string;
                        }) => (
                            <ImageIcon
                                tintColor={tintColor}
                                onPress={handleAddImage}
                            />
                        ),
                        [actions.insertLink]: ({
                            tintColor,
                        }: {
                            tintColor?: string;
                        }) => (
                            <LinkIcon
                                tintColor={tintColor}
                                onPress={() => setShowLinkDialog(true)}
                            />
                        ),
                    }}
                    style={styles.toolbar}
                    selectedIconTint="#fff"
                    onPressAddLink={() => {}}
                    onPressAddImage={handleAddImage}
                />
                <View style={{ paddingBottom: 24 }}>
                    <RichEditor
                        ref={richTextRef}
                        focusable={autoFocus}
                        initialContentHTML={replacePImageWithImg(
                            initialContent
                        )}
                        onChange={handleChange}
                        placeholder={placeholder}
                        style={[styles.richEditor, editorStyle]}
                        // initialHeight={initialHeight || 120}
                        editorStyle={{
                            backgroundColor: '#323c4a',
                            color: '#fff',
                            placeholderColor: '#a2adbd',
                            cssText: `
                .mention {
                  color: #0093fc !important;
                  font-weight: 600 !important;
                }
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
                },
              `,
                        }}
                    />
                </View>

                {showLinkDialog && (
                    <Modal
                        visible={showLinkDialog}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowLinkDialog(false)}
                    >
                        <View style={styles.linkDialogOverlay}>
                            <View style={styles.linkDialogContainer}>
                                <View style={styles.linkDialog}>
                                    <Text style={styles.linkDialogTitle}>
                                        Chèn liên kết
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.linkDialogInput,
                                            linkUrlError &&
                                                styles.linkDialogInputError,
                                        ]}
                                        placeholder="Văn bản hiển thị (tùy chọn)"
                                        value={linkDisplayText}
                                        onChangeText={setLinkDisplayText}
                                        placeholderTextColor="#a2adbd"
                                    />
                                    <TextInput
                                        style={[
                                            styles.linkDialogInput,
                                            linkUrlError &&
                                                styles.linkDialogInputError,
                                        ]}
                                        placeholder="URL liên kết"
                                        value={linkUrl}
                                        onChangeText={(text) => {
                                            setLinkUrl(text);
                                            if (linkUrlError)
                                                setLinkUrlError('');
                                        }}
                                        placeholderTextColor="#a2adbd"
                                        keyboardType="url"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {linkUrlError ? (
                                        <Text style={styles.linkDialogError}>
                                            {linkUrlError}
                                        </Text>
                                    ) : null}
                                    <View style={styles.linkDialogActions}>
                                        <Text
                                            style={styles.linkDialogButton}
                                            onPress={() =>
                                                setShowLinkDialog(false)
                                            }
                                        >
                                            HỦY
                                        </Text>
                                        <Text
                                            style={[
                                                styles.linkDialogButton,
                                                styles.linkDialogButtonPrimary,
                                            ]}
                                            onPress={handleInsertLink}
                                        >
                                            CHÈN
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
);

const styles = StyleSheet.create({
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
    richEditor: {
        color: '#fff',
        backgroundColor: '#323c4a',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 10,
        paddingBottom: 0,
        fontSize: 16,
        borderWidth: 0,
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
    linkDialog: {
        backgroundColor: '#23262d',
        width: '100%',
    },
    linkDialogTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    linkDialogInput: {
        backgroundColor: '#3e4a56',
        borderRadius: 6,
        padding: 12,
        color: '#fff',
        marginBottom: 12,
        fontSize: 14,
    },
    linkDialogInputError: {
        borderColor: '#e74c3c',
        borderWidth: 1,
    },
    linkDialogError: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
    },
    linkDialogActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    linkDialogButton: {
        color: '#a2adbd',
        padding: 8,
        marginLeft: 16,
        fontWeight: '500',
    },
    linkDialogButtonPrimary: {
        color: '#0093fc',
    },
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
