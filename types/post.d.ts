export default interface Post {
  id: number;
  authorId: number;
  title: string;
  city: string; // TODO: change this to whatever ffs
  maxPeople: number;
  isOfferring: boolean;
}
