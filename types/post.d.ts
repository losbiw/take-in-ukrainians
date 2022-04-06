export default interface Post {
  postId: number;
  userId: number;
  title: string;
  description: string;
  city: string; // TODO: change this to whatever ffs
  maxPeople: number;
  isOffering: boolean;
}
