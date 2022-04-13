export default interface Post {
  post_id: number;
  user_id: number;
  title: string;
  description: string;
  city_name: string; // TODO: change this to whatever ffs
  city_id: string;
  people_number: number;
  is_offering: boolean;
}
