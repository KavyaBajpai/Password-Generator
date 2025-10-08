import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// AUTH APIS 
export const signupUser = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { token, user }
};

export const verifyAndDelete = async (token: string, id:string, password: string) => {
   const res = await api.post(`/auth/reverify-delete/${id}`,
    {
       password
    } ,
    {
     headers: { Authorization: `Bearer ${token}` },
   })

   console.log("response from first part: ", res.data);
   return res.data;
}

export const verifyAndEdit = async (token: string, id:string, password: string, newSiteName: string, newPassword: string) => {
   const res = await api.patch(`/auth/reverify-edit/${id}`,
    {
       password, newSiteName, newPassword
    } ,
    {
     headers: { Authorization: `Bearer ${token}` },
   })

   console.log("response from first part: ", res.data);
   return res.data;
}

//  VAULT APIS 
export const getVaultItems = async (token: string) => {
  const res = await api.get("/vault/get", 
    {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addVaultItem = async (token: string, siteName: string, password: string) => {
  const res = await api.post(
    "/vault/add",
    { siteName, password: password },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteVaultItem = async (token: string, id: string) => {
  const res = await api.delete(`/vault/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default api;

