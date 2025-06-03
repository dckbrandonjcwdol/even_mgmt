import axios from "axios";

// const BASE_URL = "https://saucysmile-us.backendless.app/api";
const BASE_URL = "http://localhost:8000/api";
// const BASE_URL = "http://be-even-mgmt-i19rjw0zq-dckbrandonjcwdols-projects.vercel.app/api";




export default axios.create({
  baseURL: BASE_URL,
});
