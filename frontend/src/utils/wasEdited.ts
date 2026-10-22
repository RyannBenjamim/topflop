export const wasEdited = (createdAt: string, updatedAt: string): boolean => {
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000;
}
