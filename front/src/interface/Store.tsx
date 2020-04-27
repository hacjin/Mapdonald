export default interface Store{
  id : number
  store_name : String,
  branch : any,
  area : String,
  tel : String,
  address : String,
  latitude : number,
  longitude : number,
  category_list : Array<String>,
}