export type PublicSession = {
  user: {
    id: string;
    displayName: string;
    rankingParticipation: boolean;
    publicAchievementVisibility: boolean;
  };
};

export function toPublicSession(input: {
  id: string;
  name: string;
  rankingParticipation: boolean;
  publicAchievementVisibility: boolean;
}): PublicSession {
  return {
    user: {
      id: input.id,
      displayName: input.name,
      rankingParticipation: input.rankingParticipation,
      publicAchievementVisibility: input.publicAchievementVisibility,
    },
  };
}
