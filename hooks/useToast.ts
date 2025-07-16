import Toast, { ToastShowParams } from 'react-native-toast-message';

export interface ToastExtraOptions {
    visibilityTime?: number;
    autoHide?: boolean;
    topOffset?: number;
    bottomOffset?: number;
    position?: 'top' | 'bottom';
    type?: 'success' | 'info' | 'error';
}

type ToastType = 'success' | 'info' | 'error';

const show = (
    type: ToastType,
    title: string,
    message: string,
    options?: ToastExtraOptions
) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        visibilityTime: options?.visibilityTime ?? 4000,
        autoHide: options?.autoHide ?? true,
        topOffset: options?.topOffset ?? 20,
        bottomOffset: options?.bottomOffset,
        position: options?.position ?? 'top',
    } as ToastShowParams);
};

export const useToast = () => {
    return {
        success: (
            title: string,
            message: string,
            options?: ToastExtraOptions
        ) => show('success', title, message, options),
        info: (title: string, message: string, options?: ToastExtraOptions) =>
            show('info', title, message, options),
        error: (title: string, message: string, options?: ToastExtraOptions) =>
            show('error', title, message, options),
        successGeneral: (options?: ToastExtraOptions) =>
            show(
                'success',
                'Thành công',
                'Thao tác đã được thực hiện thành công.',
                options
            ),
        errorGeneral: (options?: ToastExtraOptions) =>
            show(
                'error',
                'Lỗi hệ thống',
                'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.',
                options
            ),
        clear: () => Toast.hide(),
    };
};
