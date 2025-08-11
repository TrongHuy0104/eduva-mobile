import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Banner {
    id: string;
    style: [string, string, ...string[]];
    title: string;
    description: string;
    buttonContent: string;
}

const BANNERS: Banner[] = [
    {
        id: 'banner-1',
        style: ['#2c8cbc', '#58c8c7'],
        title: 'Tham gia lớp học dễ dàng 👑',
        description:
            'Chỉ cần nhập mã lớp do giáo viên cung cấp, bạn sẽ nhanh chóng được kết nối với lớp học của mình. Không cần thao tác phức tạp, mọi thứ được thiết kế để bạn có thể bắt đầu học ngay lập tức.',
        buttonContent: 'Tham gia ngay',
    },
    {
        id: 'banner-2',
        style: ['#8a0aff', '#6006ff'],
        title: 'Tài liệu học tập mọi lúc mọi nơi',
        description:
            'Truy cập và học bài trên mọi thiết bị, bất cứ khi nào bạn muốn. Dù ở nhà, ở trường hay đang di chuyển, bạn vẫn có thể tiếp tục bài học, ôn tập kiến thức và luyện tập kỹ năng mà không bị gián đoạn.',
        buttonContent: 'Bắt đầu học',
    },
    {
        id: 'banner-3',
        style: ['#6828fa', '#ffbaa4'],
        title: 'Hỏi đáp ngay trong bài học',
        description:
            'Nếu gặp chỗ chưa hiểu, bạn có thể đặt câu hỏi ngay trong bài học và nhận được lời giải thích chi tiết từ giáo viên cũng như góp ý từ các bạn học khác. Tương tác nhanh chóng, học tập hiệu quả hơn.',
        buttonContent: 'Đặt câu hỏi',
    },
    {
        id: 'banner-4',
        style: ['#2877fa', '#6717cd'],
        title: 'Kết nối với giáo viên và bạn học',
        description:
            'Học tập, trao đổi và chia sẻ kinh nghiệm trực tiếp trên Eduva. Tăng cường kết nối với giáo viên và bạn học để cùng nhau tiến bộ mỗi ngày.',
        buttonContent: 'Kết nối ngay',
    },
    {
        id: 'banner-5',
        style: ['#7612ff', '#05b2ff'],
        title: 'Học tập hiệu quả hơn',
        description:
            'Giao diện đơn giản, dễ sử dụng, giúp bạn tập trung hơn và đạt được mục tiêu học tập nhanh chóng. Tối ưu trải nghiệm để bạn học ít mà hiệu quả nhiều.',
        buttonContent: 'Trải nghiệm ngay',
    },
];

const { width } = Dimensions.get('window');
const BANNER_PADDING = 16;
const WRAPPER_WIDTH = width;
const BANNER_WIDTH = WRAPPER_WIDTH - BANNER_PADDING * 2;

const DOT_WIDTH = 36;
const DOT_HEIGHT = 8;
const DOT_MARGIN = 6;

const BannerCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const intervalRef = useRef<number | null>(null);
    const isAutoScroll = useRef(true);
    // Animated value for active dot position
    const activeDotAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(activeDotAnim, {
            toValue: activeIndex,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [activeIndex, activeDotAnim]);
    // Animated values for dots
    const dotWidths = useRef(
        BANNERS.map((_, i) => new Animated.Value(i === 0 ? 32 : 18))
    ).current;

    useEffect(() => {
        dotWidths.forEach((anim, i) => {
            Animated.timing(anim, {
                toValue: activeIndex === i ? 32 : 18,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, [activeIndex, dotWidths]);

    const stopAutoScroll = React.useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    // Auto scroll logic
    const startAutoScroll = React.useCallback(() => {
        stopAutoScroll();
        intervalRef.current = setInterval(() => {
            if (isAutoScroll.current) {
                let next = activeIndex + 1;
                if (next >= BANNERS.length) next = 0;
                scrollToIndex(next);
            }
        }, 3000);
    }, [activeIndex, stopAutoScroll]);

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, [activeIndex, dotWidths, startAutoScroll, stopAutoScroll]);

    const onMomentumScrollEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const slide = Math.round(offsetX / BANNER_WIDTH);

        if (slide >= BANNERS.length) {
            scrollToIndex(0);
        } else if (slide < 0) {
            scrollToIndex(BANNERS.length - 1);
        }
    };

    const scrollToIndex = (idx: number) => {
        scrollRef.current?.scrollTo({
            x: idx * BANNER_WIDTH,
            animated: true,
        });
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slide = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
        setActiveIndex(slide);
    };

    const onTouchStart = () => {
        isAutoScroll.current = false;
        stopAutoScroll();
    };
    const onTouchEnd = () => {
        isAutoScroll.current = true;
        startAutoScroll();
    };

    return (
        <View
            style={{
                width: WRAPPER_WIDTH,
                paddingHorizontal: BANNER_PADDING,
                marginTop: 20,
            }}
        >
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {BANNERS.map((item) => (
                    <View
                        key={item.id}
                        style={[
                            styles.banner,
                            { width: BANNER_WIDTH, height: 250 },
                        ]}
                    >
                        <LinearGradient
                            colors={item.style}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                        <Text style={styles.bannerTitle}>{item.title}</Text>
                        <Text style={styles.bannerDesc}>
                            {item.description}
                        </Text>
                        <TouchableOpacity style={styles.bannerButton}>
                            <Text style={styles.bannerButtonText}>
                                {item.buttonContent}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.dotsContainer}>
                {BANNERS.map((item, index) => (
                    <TouchableOpacity
                        key={`dot-${item.id}`}
                        onPress={() => {
                            scrollToIndex(index);
                            isAutoScroll.current = true;
                            startAutoScroll();
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.dot} />
                    </TouchableOpacity>
                ))}
                {/* Dot active animate */}
                <Animated.View
                    style={[
                        styles.activeDot,
                        {
                            position: 'absolute',
                            left: activeDotAnim.interpolate({
                                inputRange: [0, BANNERS.length - 1],
                                outputRange: [
                                    0,
                                    (DOT_WIDTH + DOT_MARGIN * 2) *
                                        (BANNERS.length - 1),
                                ],
                            }),
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 10,
        minHeight: 180,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    bannerTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 8,
    },
    bannerDesc: {
        color: '#fff',
        fontSize: 15,
        marginBottom: 18,
    },
    bannerButton: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 18,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    bannerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 8,
        height: DOT_HEIGHT,
        position: 'relative',
    },
    dot: {
        width: DOT_WIDTH,
        height: DOT_HEIGHT,
        borderRadius: DOT_HEIGHT / 2,
        backgroundColor: '#e0e0e0',
        marginHorizontal: DOT_MARGIN,
    },
    activeDot: {
        width: DOT_WIDTH,
        height: DOT_HEIGHT,
        borderRadius: DOT_HEIGHT / 2,
        backgroundColor: '#9aa6af',
        marginHorizontal: DOT_MARGIN,
        zIndex: 1,
    },
});

export default BannerCarousel;
