import {theme} from "../theme/theme";
import {Pressable, StyleSheet, Text, View} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {ToastConfig, ToastConfigParams} from "react-native-toast-message";
import React, {ComponentProps} from 'react';

type MaterialDesignIconName = ComponentProps<typeof MaterialDesignIcons>['name'];

interface CustomToastContainerProps {
    iconName: MaterialDesignIconName;
    iconColor: string;
    iconBgColor: string;
    borderColor?: string;
    text1?: string;
    text2?: string;
    onPress?: () => void;
    hide: () => void;
}


function CustomToastContainer({
                                  iconName,
                                  iconColor,
                                  iconBgColor,
                                  borderColor = theme.colors.borderMedium,
                                  text1,
                                  text2,
                                  onPress,
                                  hide,
                              }: CustomToastContainerProps) {
    return (
        <Pressable
            style={[styles.container, {borderColor}]}
            onPress={onPress || hide}
            android_ripple={{color: theme.colors.surfaceHover}}
        >
            <View style={[styles.iconContainer, {backgroundColor: iconBgColor}]}>
                <MaterialDesignIcons name={iconName} size={20} color={iconColor}/>
            </View>
            <View style={styles.textContainer}>
                {Boolean(text1) && (
                    <Text style={styles.title} numberOfLines={2}>
                        {text1}
                    </Text>
                )}
                {Boolean(text2) && (
                    <Text style={styles.message} numberOfLines={3}>
                        {text2}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

export const toastConfig: ToastConfig = {
    error: ({text1, text2, onPress, hide}: ToastConfigParams<any>) => (
        <CustomToastContainer
            iconName="alert-circle-outline"
            iconColor={theme.colors.danger}
            iconBgColor={theme.colors.dangerLight}
            borderColor="rgba(247, 90, 104, 0.3)"
            text1={text1}
            text2={text2}
            onPress={onPress}
            hide={hide}
        />
    ),

    success: ({text1, text2, onPress, hide}: ToastConfigParams<any>) => (
        <CustomToastContainer
            iconName="check-circle-outline"
            iconColor={theme.colors.primaryVibrant}
            iconBgColor={theme.colors.primaryLight}
            borderColor="rgba(0, 179, 126, 0.3)"
            text1={text1}
            text2={text2}
            onPress={onPress}
            hide={hide}
        />
    ),

    info: ({ text1, text2, onPress, hide }: ToastConfigParams<any>) => (
        <CustomToastContainer
            iconName="information-outline"
            iconColor={theme.colors.warning}
            iconBgColor="rgba(251, 169, 76, 0.15)"
            borderColor="rgba(251, 169, 76, 0.3)"
            text1={text1}
            text2={text2}
            onPress={onPress}
            hide={hide}
        />
    ),
}

const styles = StyleSheet.create({
    container: {
        width: '92%',
        maxWidth: 420,
        backgroundColor: theme.colors.surfaceElevated,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        paddingHorizontal: theme.spacing['2xl'],
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: theme.borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.lg,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        color: theme.colors.text,
        lineHeight: 18,
    },
    message: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: 3,
        lineHeight: 16,
    },
});
