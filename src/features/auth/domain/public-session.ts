export type PublicSession = {
  user: {
    id: string;
    displayName: string;
    image: string | null;
    rankingParticipation: boolean;
    publicAchievementVisibility: boolean;
  };
};

export function toPublicSession(input: {
  id: string;
  name: string;
  image?: string | null;
  rankingParticipation: boolean;
  publicAchievementVisibility: boolean;
}): PublicSession {
  return {
    user: {
      id: input.id,
      displayName: input.name,
      image: input.image ?? null,
      rankingParticipation: input.rankingParticipation,
      publicAchievementVisibility: input.publicAchievementVisibility,
    },
  };
}
