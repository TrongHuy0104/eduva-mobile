import { Question } from "@/types/models/question.model";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";

 const QuestionItem = ({question}: {question: Question}) => {
    return (
        
        <Pressable style={
            ({ pressed }) => [
                styles.questionItem,
                pressed && {backgroundColor: '#32353b'}
            ]
        } onPress={() => {}}>
           {question.commentCount > 0 ? <Image
                source={require('@/assets/images/circle-check-green.svg')}
                style={styles.questionIcon}
            /> : <Image
                source={require('@/assets/images/circle-question-mark.svg')}
                style={styles.questionIcon}
            />}
            <Text style={styles.questionTitle}>{question.title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    questionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 6,
        paddingLeft: 12,
        paddingRight: 16,
        gap: 8,
        marginTop: 10,
        borderRadius: 4
    },
    questionIcon: {
        width: 16,
        height: 16,
    },
    questionTitle: {
        fontSize: 16,
        color: '#a2adbd',
    }
})

export default QuestionItem
