import { CommentEntity } from "@/types/models/comment.model";
import React from "react";
import { StyleSheet, View } from "react-native";
import CommentItem from "./CommentItem";

interface DetailCommentsProps {
    comments: CommentEntity[];
}

export default function DetailComments({ comments }: Readonly<DetailCommentsProps>) {
    const commentWithMostReplies = (() => {
        const filtered = comments.filter(c => c.replyCount > 0);
        if (filtered.length === 0) return null;
    
        return filtered.reduce((max, current) =>
          current.replyCount > max.replyCount ? current : max
        );
      });
    
    return (
        <View>
            {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                    <CommentItem data={comment} isBestComment={comment.id === commentWithMostReplies()?.id} questionId={comment.questionId} commentId={comment.id} contentWidth={200} />
                    <View style={styles.childComments}>
                        {comment.replies?.map((reply) => (
                            <CommentItem key={reply.id} commentId={comment.id} data={reply} questionId={comment.questionId} contentWidth={0} style={{marginLeft: 8}} />
                        ))}
                    </View>
                </React.Fragment>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    childComments: {
        marginTop: 30,
        marginLeft: 8,
        borderLeftWidth: 1,
        borderLeftColor: '#d5d9e2',
    },
})