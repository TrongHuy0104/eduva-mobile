import React from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ImageGalleryModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ visible, images, initialIndex = 0, onClose }) => {
  const flatListRef = React.useRef<FlatList<string>>(null);

  React.useEffect(() => {
    if (visible && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [visible, initialIndex]);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          renderItem={renderItem}
          keyExtractor={(item, idx) => item + idx}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <View style={styles.closeBtnInner} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.96,
    height: height * 0.96,
    borderRadius: 12,
    backgroundColor: '#111',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 24,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtnInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
});

export default ImageGalleryModal;
