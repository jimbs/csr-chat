import axios from "axios";

axios.defaults.withCredentials = true;

export default class UserService {
  getCookie(arg0: string) {
    throw new Error("Method not implemented.");
  }
  private transactionUrl: string;
  private userIrl: string;

  constructor() {
    this.userIrl =
      `${import.meta.env.VITE_API_URL}/user` ||
      "http://localhost:8005/api/v2/user";
  }

  async login({ mobileNumber }: { mobileNumber: string }): Promise<any> {
    try {
      const { data } = await axios.post(
        `${this.userIrl}/login`,
        {
          mobileNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      throw error;
    }
  }
  async requestOTP({ id }: { id: number }) {
    const { data } = await axios.post(
      `${this.userIrl}/create-otp`,
      {
        userId: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
  async verifyOTP({ id, otp }: { id: number; otp: any }) {
    const { data } = await axios.post(
      `${this.userIrl}/get-otp`,
      {
        userId: id,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  }
}
