import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../client";
import type {
    EvaluateRequest,
    WritingFeedbackResponse,
} from "@/types/writing";

export const writingKeys = {
    all: ["writing"] as const,
    evaluate: () => [...writingKeys.all, "evaluate"] as const,
    profile: (userId: string) => [...writingKeys.all, "profile", userId] as const,
};

export function useEvaluateWriting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: EvaluateRequest): Promise<WritingFeedbackResponse> => {
            // @ts-ignore: client.ielts_writing might be dynamic
            return client.ielts_writing.evaluate_writing(request);
        },
        onSuccess: (_, variables) => {
            if (variables.user_id) {
                queryClient.invalidateQueries({
                    queryKey: writingKeys.profile(variables.user_id),
                });
            }
        },
    });
}

export function useErrorProfile(userId: string) {
    return useQuery({
        queryKey: writingKeys.profile(userId),
        queryFn: async () => {
            // @ts-ignore: client.ielts_writing might be dynamic
            return client.ielts_writing.get_error_profile({ user_id: userId });
        },
        enabled: !!userId,
    });
}
