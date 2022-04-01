export default interface Post {
  postId: number;
  userId: number;
  title: string;
  city: string; // TODO: change this to whatever ffs
  maxPeople: number;
  isOfferring: boolean;
}
