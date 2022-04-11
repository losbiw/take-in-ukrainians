export default interface Post {
  post_id: number;
  user_id: number;
  title: string;
  description: string;
  city: string; // TODO: change this to whatever ffs
  max_people: number;
  is_offering: boolean;
}
